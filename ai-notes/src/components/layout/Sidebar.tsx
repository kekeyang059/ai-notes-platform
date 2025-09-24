'use client';

import { cn } from '@/lib/utils';
import { ActiveView } from '@/types';
import { 
  Home, 
  FileText, 
  CheckSquare, 
  Timer, 
  MessageSquare,
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const menuItems = [
  { id: 'dashboard', label: '可可的记事本2.0', icon: Home },
  { id: 'notes', label: '笔记', icon: FileText },
  { id: 'todos', label: '待办', icon: CheckSquare },
  { id: 'projects', label: '项目管理', icon: Briefcase },
  { id: 'pomodoro', label: '番茄钟', icon: Timer },
  { id: 'ai-chat', label: 'AI对话', icon: MessageSquare }
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-16 bg-background border-r flex flex-col items-center py-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ActiveView)}
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
              activeView === item.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
}