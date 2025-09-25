'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNotes, getTodos } from '@/lib/storage';

export function DashboardPage() {
  const [noteCount, setNoteCount] = useState(0);
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateStats = () => {
      const notes = getNotes();
      const todos = getTodos();
      
      setNoteCount(notes.length);
      setTodoStats({
        total: todos.length,
        completed: todos.filter(t => t.completed).length,
        pending: todos.filter(t => !t.completed).length
      });
      
      const now = new Date();
      const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).replace(/\//g, '/');
      const weekdayStr = now.toLocaleDateString('zh-CN', {
        weekday: 'short'
      });
      setCurrentDate(`${dateStr}\n${weekdayStr}`);
    };

    updateStats();
    
    // Listen for storage changes
    window.addEventListener('storage', updateStats);
    return () => window.removeEventListener('storage', updateStats);
  }, []);

  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-3xl font-bold mb-6">可可的记事本2.0</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-muted-foreground">
              当前日期
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold whitespace-pre-line leading-tight">{currentDate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-muted-foreground">
              总笔记数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{noteCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-muted-foreground">
              待办总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-muted-foreground">
              待办完成率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todoStats.total > 0 ? Math.round((todoStats.completed / todoStats.total) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">待办事项统计</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>总待办:</span>
              <span className="font-medium">{todoStats.total}</span>
            </div>
            <div className="flex justify-between">
              <span>已完成:</span>
              <span className="font-medium text-green-600">{todoStats.completed}</span>
            </div>
            <div className="flex justify-between">
              <span>待完成:</span>
              <span className="font-medium text-orange-600">{todoStats.pending}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              使用左侧导航栏快速访问各个功能模块
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}