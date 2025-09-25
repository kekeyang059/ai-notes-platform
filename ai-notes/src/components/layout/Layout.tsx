'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ActiveView } from '@/types';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { NotesPage } from '@/components/notes/NotesPage';
import { TodosPage } from '@/components/todos/TodosPage';
import { PomodoroPage } from '@/components/pomodoro/PomodoroPage';
import { AIChatPage } from '@/components/ai-chat/AIChatPage';
import { ProjectsPage } from '@/components/projects/ProjectsPage';
import { BackgroundPaths } from '@/components/ui/background-paths';

export function Layout() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'notes':
        return <NotesPage />;
      case 'todos':
        return <TodosPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'pomodoro':
        return <PomodoroPage />;
      case 'ai-chat':
        return <AIChatPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BackgroundPaths title="AI Notes" />
      </div>
      <div className="relative z-10 flex w-full h-full">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}