'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

const POMODORO_DURATION = 25 * 60; // 25分钟
const BREAK_DURATION = 5 * 60; // 5分钟

export function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isBreak) {
        setSessions((prev) => prev + 1);
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {
          // 浏览器可能阻止自动播放
          alert(isBreak ? '休息时间结束！' : '番茄钟完成！');
        });
        setIsBreak(true);
        setTimeLeft(BREAK_DURATION);
      } else {
        setIsBreak(false);
        setTimeLeft(POMODORO_DURATION);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(POMODORO_DURATION);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isBreak ? '休息时间' : '番茄钟'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-mono font-bold mb-8">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center gap-4 mb-6">
            <Button
              size="lg"
              onClick={handleStartPause}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  开始
                </>
              )}
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              重置
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            已完成番茄钟：{sessions} 个
          </div>
        </CardContent>
      </Card>
    </div>
  );
}