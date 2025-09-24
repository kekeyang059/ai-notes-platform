'use client';

import { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';
import { Note } from '@/types';
import { getNotes } from '@/lib/storage';

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotes = () => {
    const loadedNotes = getNotes();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(loadedNotes[0].id);
    }
  };

  const handleNoteUpdate = () => {
    loadNotes();
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={25} minSize={20}>
        <NoteList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onNotesChange={loadNotes}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75} minSize={40}>
        <NoteEditor
          note={selectedNote}
          onNoteChange={handleNoteUpdate}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}