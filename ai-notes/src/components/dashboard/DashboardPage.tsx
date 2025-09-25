'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNotes, getTodos } from '@/lib/storage';
import { OlympicRings } from '@/components/ui/olympic-rings';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function DashboardPage() {
  const [noteCount, setNoteCount] = useState(0);
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [currentDate, setCurrentDate] = useState('');
  const [projectCount, setProjectCount] = useState(0);
  const router = useRouter();

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

      // 获取项目数量
      try {
        const projectsData = localStorage.getItem('projects');
        if (projectsData) {
          const projects = JSON.parse(projectsData);
          setProjectCount(projects.length);
        } else {
          setProjectCount(0);
        }
      } catch (error) {
        console.error('获取项目数量失败:', error);
        setProjectCount(0);
      }

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

      {/* 五环项目展示区域 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">项目管理中心</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* 五环动画 */}
            <div className="flex-shrink-0">
              <OlympicRings
                size={180}
                animated={true}
                interactive={true}
                onRingClick={(index) => {
                  router.push('/projects');
                }}
              />
            </div>

            {/* 项目信息 */}
            <div className="flex-1 text-center lg:text-left">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">项目概览</h3>
                  <p className="text-muted-foreground">
                    当前共有 {projectCount} 个项目
                  </p>
                </div>

                <div className="flex justify-center lg:justify-start gap-4">
                  <Button
                    onClick={() => router.push('/projects')}
                    variant="default"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    管理项目
                  </Button>
                  <Button
                    onClick={() => {
                      router.push('/projects');
                      // 触发新建项目逻辑
                      setTimeout(() => {
                        const event = new CustomEvent('newProject');
                        window.dispatchEvent(event);
                      }, 100);
                    }}
                    variant="outline"
                  >
                    新建项目
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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