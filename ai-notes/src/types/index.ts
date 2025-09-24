export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  tasks: ProjectTask[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActiveView = 'dashboard' | 'notes' | 'todos' | 'pomodoro' | 'ai-chat' | 'projects';