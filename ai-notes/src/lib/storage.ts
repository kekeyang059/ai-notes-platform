import { Note, Todo, ChatSession, Project } from '@/types';

const STORAGE_KEYS = {
  NOTES: 'ai-notes-notes',
  TODOS: 'ai-notes-todos',
  CHAT_SESSIONS: 'ai-notes-chat-sessions',
  PROJECTS: 'ai-notes-projects'
};

// Notes
export const getNotes = (): Note[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.NOTES);
  return data ? JSON.parse(data) : [];
};

export const saveNote = (note: Note): void => {
  if (typeof window === 'undefined') return;
  const notes = getNotes();
  const existingIndex = notes.findIndex(n => n.id === note.id);
  
  if (existingIndex >= 0) {
    notes[existingIndex] = note;
  } else {
    notes.push(note);
  }
  
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

export const deleteNote = (id: string): void => {
  if (typeof window === 'undefined') return;
  const notes = getNotes().filter(note => note.id !== id);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

// Todos
export const getTodos = (): Todo[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.TODOS);
  return data ? JSON.parse(data) : [];
};

export const saveTodo = (todo: Todo): void => {
  if (typeof window === 'undefined') return;
  
  const todos = getTodos();
  const existingIndex = todos.findIndex(t => t.id === todo.id);
  
  if (existingIndex >= 0) {
    todos[existingIndex] = todo;
  } else {
    todos.push(todo);
  }
  
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
};

export const deleteTodo = (id: string): void => {
  if (typeof window === 'undefined') return;
  const todos = getTodos().filter(todo => todo.id !== id);
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
};

// Chat Sessions
export const getChatSessions = (): ChatSession[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
  return data ? JSON.parse(data) : [];
};

export const saveChatSession = (session: ChatSession): void => {
  if (typeof window === 'undefined') return;
  const sessions = getChatSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  
  localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
};

export const deleteChatSession = (id: string): void => {
  if (typeof window === 'undefined') return;
  const sessions = getChatSessions().filter(session => session.id !== id);
  localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
};

// Projects
export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  const projects = data ? JSON.parse(data) : [];
  console.log('获取项目列表:', projects); // 添加调试信息
  return projects;
};

export const saveProject = (project: Project): void => {
  if (typeof window === 'undefined') return;
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
    console.log('更新项目:', project); // 添加调试信息
  } else {
    projects.push(project);
    console.log('新增项目:', project); // 添加调试信息
  }
  
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  console.log('保存后的项目列表:', projects); // 添加调试信息
};

export const deleteProject = (id: string): void => {
  if (typeof window === 'undefined') return;
  const projects = getProjects().filter(project => project.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};