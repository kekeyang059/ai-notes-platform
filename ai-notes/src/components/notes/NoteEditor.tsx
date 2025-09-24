'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Note } from '@/types';
import { saveNote } from '@/lib/storage';
import { polishText, generateTags } from '@/lib/ai-service';
import { getOpenRouterApiKey } from '@/lib/config';
import { Save, Sparkles, Tag, Loader2 } from 'lucide-react';

interface NoteEditorProps {
  note: Note | undefined;
  onNoteChange: () => void;
}

export function NoteEditor({ note, onNoteChange }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(', '));
    } else {
      setTitle('');
      setContent('');
      setTags('');
    }
  }, [note]);

  const handleSave = async () => {
    if (!note) return;

    setIsSaving(true);
    try {
      const updatedNote: Note = {
        ...note,
        title: title.trim() || content.trim().substring(0, 20) + '...',
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        updatedAt: new Date().toISOString()
      };

      saveNote(updatedNote);
      onNoteChange();
    } finally {
      setIsSaving(false);
    }
  };

  const handlePolishText = async () => {
    if (!content.trim()) return;

    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      alert('API密钥未配置，请联系管理员');
      return;
    }

    setIsPolishing(true);
    try {
      const polished = await polishText(content, apiKey);
      setContent(polished);
    } catch (error) {
      alert('文本润色失败：' + (error as Error).message);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!content.trim()) return;

    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      alert('API密钥未配置，请联系管理员');
      return;
    }

    setIsGeneratingTags(true);
    try {
      const generatedTags = await generateTags(content, apiKey);
      setTags([...new Set([...tags.split(',').map(t => t.trim()).filter(t => t), ...generatedTags])].join(', '));
    } catch (error) {
      alert('标签生成失败：' + (error as Error).message);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        选择左侧笔记开始编辑，或创建新笔记
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="笔记标题"
          className="text-lg font-semibold border-none focus-visible:ring-0 px-0"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePolishText}
            disabled={isPolishing || !content.trim()}
            className="gap-2"
          >
            {isPolishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            润色
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateTags}
            disabled={isGeneratingTags || !content.trim()}
            className="gap-2"
          >
            {isGeneratingTags ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Tag className="w-4 h-4" />
            )}
            生成标签
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            保存
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="开始写作..."
          className="min-h-[300px] resize-none border-none focus-visible:ring-0 p-0 text-base"
        />
      </div>

      <div className="p-4 border-t">
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="标签（用逗号分隔）"
          className="text-sm"
        />
      </div>
    </div>
  );
}