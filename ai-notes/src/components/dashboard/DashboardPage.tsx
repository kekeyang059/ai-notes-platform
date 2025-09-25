'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNotes, getTodos } from '@/lib/storage';
import { CircularNavigation } from '@/components/ui/circular-navigation';
import { motion } from "framer-motion";

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
    <motion.div
      className="h-full flex flex-col items-center justify-center p-8 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 标题区域 */}
      <motion.div
        className="text-center mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          可可的记事本2.0
        </h1>
        <p className="text-lg text-muted-foreground">
          点击图标快速开始工作
        </p>
      </motion.div>

      {/* 圆形导航区域 */}
      <div className="flex-1 flex items-center justify-center">
        <CircularNavigation
          size={500}
          animated={true}
          interactive={true}
        />
      </div>

      {/* 底部状态卡片 - 简约版 */}
      <motion.div
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300">
          <div className="text-2xl font-bold text-blue-600">{noteCount}</div>
          <div className="text-sm text-muted-foreground mt-1">笔记</div>
        </Card>

        <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300">
          <div className="text-2xl font-bold text-green-600">{todoStats.total}</div>
          <div className="text-sm text-muted-foreground mt-1">待办</div>
        </Card>

        <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300">
          <div className="text-2xl font-bold text-yellow-600">{todoStats.completed}</div>
          <div className="text-sm text-muted-foreground mt-1">已完成</div>
        </Card>

        <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300">
          <div className="text-2xl font-bold text-purple-600">
            {todoStats.total > 0 ? Math.round((todoStats.completed / todoStats.total) * 100) : 0}%
          </div>
          <div className="text-sm text-muted-foreground mt-1">完成率</div>
        </Card>
      </motion.div>
    </motion.div>
  );
}