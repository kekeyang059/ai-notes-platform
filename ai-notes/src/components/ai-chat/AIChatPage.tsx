'use client';

import { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ChatSessionsList } from './ChatSessionsList';
import { ChatWindow } from './ChatWindow';
import { ChatSession } from '@/types';
import { getChatSessions } from '@/lib/storage';

export function AIChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSessions = () => {
    const loadedSessions = getChatSessions();
    setSessions(loadedSessions);
    if (loadedSessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(loadedSessions[0].id);
    }
  };

  const handleSessionUpdate = () => {
    loadSessions();
  };

  const selectedSession = sessions.find(session => session.id === selectedSessionId);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={25} minSize={20}>
        <ChatSessionsList
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={setSelectedSessionId}
          onSessionsChange={loadSessions}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75} minSize={40}>
        <ChatWindow
          session={selectedSession}
          onSessionChange={handleSessionUpdate}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}