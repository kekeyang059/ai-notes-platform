'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChatSession, ChatMessage } from '@/types';
import { saveChatSession } from '@/lib/storage';
import { callOpenRouter, AVAILABLE_MODELS } from '@/lib/ai-service';
import { getOpenRouterApiKey } from '@/lib/config';
import { Send, Loader2, Bot } from 'lucide-react';

interface ChatWindowProps {
  session: ChatSession | undefined;
  onSessionChange: () => void;
}

export function ChatWindow({ session, onSessionChange }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session) return;

    const apiKey = getOpenRouterApiKey();

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim()
    };

    const updatedMessages = [...session.messages, userMessage];
    
    // 更新会话标题（如果是第一条消息）
    const updatedTitle = session.messages.length === 0 
      ? inputValue.trim().substring(0, 20) + '...'
      : session.title;

    const updatedSession: ChatSession = {
      ...session,
      title: updatedTitle,
      messages: updatedMessages
    };

    saveChatSession(updatedSession);
    onSessionChange();
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await callOpenRouter(updatedMessages, apiKey, selectedModel);
      
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, aiMessage]
      };

      saveChatSession(finalSession);
      onSessionChange();
    } catch (error) {
      alert('发送消息失败：' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!session) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        选择左侧对话开始聊天，或创建新对话
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {session.messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              开始与 AI 对话...
            </div>
          ) : (
            session.messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          
          {/* 滚动锚点 */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 - 固定在底部 */}
      <div className="flex-shrink-0 border-t p-4 bg-background">
        {/* 模型选择区域 */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b">
          <Bot className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">模型:</span>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[200px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            disabled={isLoading}
            className="min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}