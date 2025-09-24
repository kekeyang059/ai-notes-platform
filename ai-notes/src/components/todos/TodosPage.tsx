'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/types';
import { getTodos, saveTodo, deleteTodo } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Check, Square } from 'lucide-react';

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = () => {
    setTodos(getTodos());
  };

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveTodo(newTodo);
    setNewTodoTitle('');
    loadTodos();
  };

  const handleToggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date().toISOString()
    };

    saveTodo(updatedTodo);
    loadTodos();
  };

  const handleDeleteTodo = (id: string) => {
    if (confirm('确定要删除这个待办事项吗？')) {
      deleteTodo(id);
      loadTodos();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold mb-4">待办清单</h1>
        <div className="flex gap-2">
          <Input
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="添加新的待办事项..."
            className="flex-1"
          />
          <Button onClick={handleAddTodo} className="gap-2">
            <Plus className="w-4 h-4" />
            添加
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {totalCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {completedCount} / {totalCount} 已完成 ({Math.round((completedCount / totalCount) * 100)}%)
            </div>
          )}

          {todos.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                还没有待办事项，开始添加吧！
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card key={todo.id} className={todo.completed ? 'opacity-75' : ''}>
                <CardContent className="flex items-center gap-3 py-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleTodo(todo.id)}
                    className="p-2"
                  >
                    {todo.completed ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </Button>

                  <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.title}
                  </span>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}