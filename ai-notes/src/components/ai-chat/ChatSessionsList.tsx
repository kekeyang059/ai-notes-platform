'use client';

import { Button } from '@/components/ui/button';
import { ChatSession } from '@/types';
import { saveChatSession, deleteChatSession } from '@/lib/storage';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSessionsListProps {
  sessions: ChatSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onSessionsChange: () => void;
}

export function ChatSessionsList({ sessions, selectedSessionId, onSelectSession, onSessionsChange }: ChatSessionsListProps) {
  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新对话',
      createdAt: new Date().toISOString(),
      messages: []
    };
    
    saveChatSession(newSession);
    onSessionsChange();
    onSelectSession(newSession.id);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个对话吗？')) {
      deleteChatSession(id);
      onSessionsChange();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">对话历史</h2>
          <Button size="sm" onClick={handleNewSession} className="gap-2">
            <Plus className="w-4 h-4" />
            新建
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            还没有对话记录，点击新建开始对话
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  'p-3 rounded-md cursor-pointer transition-colors group',
                  selectedSessionId === session.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-accent/50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {session.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(session.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.messages.length} 条消息
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                    onClick={(e) => handleDeleteSession(e, session.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}