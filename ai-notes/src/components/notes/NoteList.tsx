'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Note } from '@/types';
import { saveNote, deleteNote } from '@/lib/storage';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNotesChange: () => void;
}

export function NoteList({ notes, selectedNoteId, onSelectNote, onNotesChange }: NoteListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveNote(newNote);
    onNotesChange();
    onSelectNote(newNote.id);
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个笔记吗？')) {
      deleteNote(id);
      onNotesChange();
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">笔记</h2>
          <Button size="sm" onClick={handleNewNote} className="gap-2">
            <Plus className="w-4 h-4" />
            新建
          </Button>
        </div>
        <input
          type="text"
          placeholder="搜索笔记..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {searchTerm ? '没有找到匹配的笔记' : '还没有笔记，点击新建开始创建'}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={cn(
                  'p-3 rounded-md cursor-pointer transition-colors group',
                  selectedNoteId === note.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-accent/50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {note.title || '无标题笔记'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(note.updatedAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                    onClick={(e) => handleDeleteNote(e, note.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                {note.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {note.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{note.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}