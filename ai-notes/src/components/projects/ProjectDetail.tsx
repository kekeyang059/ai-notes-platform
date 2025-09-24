'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectTask } from '@/types';
import { saveProject } from '@/lib/storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Save, Edit, Trash2, CheckCircle } from 'lucide-react';

interface ProjectDetailProps {
  project: Project | null;
  onProjectSaved: (project: Project) => void;
}

export function ProjectDetail({ project, onProjectSaved }: ProjectDetailProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(project);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    setCurrentProject(project);
    setEditMode(false);
  }, [project]);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        请选择或创建一个项目
      </div>
    );
  }

  const handleSave = () => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        updatedAt: new Date().toISOString()
      };
      saveProject(updatedProject);
      onProjectSaved(updatedProject);
      setEditMode(false);
    }
  };

  const handleAddTask = () => {
    if (!newTask.trim() || !currentProject) return;

    const newTaskObj: ProjectTask = {
      id: Date.now().toString(),
      title: newTask,
      description: '',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProject = {
      ...currentProject,
      tasks: [...currentProject.tasks, newTaskObj],
      updatedAt: new Date().toISOString()
    };

    // 更新本地状态
    setCurrentProject(updatedProject);
    // 保存到localStorage
    saveProject(updatedProject);
    // 通知父组件项目已更新
    onProjectSaved(updatedProject);

    setNewTask('');
  };

  const handleUpdateTaskStatus = (taskId: string, status: ProjectTask['status']) => {
    if (!currentProject) return;

    const updatedTasks = currentProject.tasks.map(task => 
      task.id === taskId ? { ...task, status, updatedAt: new Date().toISOString() } : task
    );

    const updatedProject = {
      ...currentProject,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    };

    // 更新本地状态
    setCurrentProject(updatedProject);
    // 保存到localStorage
    saveProject(updatedProject);
    // 通知父组件项目已更新
    onProjectSaved(updatedProject);
  };

  const handleUpdateTaskPriority = (taskId: string, priority: ProjectTask['priority']) => {
    if (!currentProject) return;

    const updatedTasks = currentProject.tasks.map(task => 
      task.id === taskId ? { ...task, priority, updatedAt: new Date().toISOString() } : task
    );

    const updatedProject = {
      ...currentProject,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    };

    // 更新本地状态
    setCurrentProject(updatedProject);
    // 保存到localStorage
    saveProject(updatedProject);
    // 通知父组件项目已更新
    onProjectSaved(updatedProject);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!currentProject) return;

    const updatedTasks = currentProject.tasks.filter(task => task.id !== taskId);

    const updatedProject = {
      ...currentProject,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    };

    // 更新本地状态
    setCurrentProject(updatedProject);
    // 保存到localStorage
    saveProject(updatedProject);
    // 通知父组件项目已更新
    onProjectSaved(updatedProject);
  };

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      [field]: value,
      updatedAt: new Date().toISOString()
    };

    // 更新本地状态
    setCurrentProject(updatedProject);
    // 保存到localStorage
    saveProject(updatedProject);
    // 通知父组件项目已更新
    onProjectSaved(updatedProject);
  };

  const handleStatusChange = (status: Project['status']) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      status,
      updatedAt: new Date().toISOString()
    };

    // 更新本地状态
    setCurrentProject(updatedProject);
    // 保存到localStorage
    saveProject(updatedProject);
    // 通知父组件项目已更新
    onProjectSaved(updatedProject);
  };

  const getTaskStatusColor = (status: ProjectTask['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        {editMode ? (
          <Input
            value={currentProject.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="font-semibold text-lg"
          />
        ) : (
          <h2 className="text-lg font-semibold">{currentProject.name}</h2>
        )}
        <div className="flex space-x-2">
          {editMode ? (
            <Button onClick={handleSave} size="sm" variant="outline">
              <Save className="w-4 h-4 mr-1" />
              保存
            </Button>
          ) : (
            <Button onClick={() => setEditMode(true)} size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-1" />
              编辑
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">项目描述</h3>
            {editMode ? (
              <textarea
                value={currentProject.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-2 border rounded-md h-24"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{currentProject.description}</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">项目状态</h3>
            {editMode ? (
              <div className="flex space-x-2">
                {(['planning', 'in-progress', 'completed', 'on-hold'] as Project['status'][]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1 text-xs rounded-full ${currentProject.status === status ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}
                  >
                    {status === 'planning' && '规划中'}
                    {status === 'in-progress' && '进行中'}
                    {status === 'completed' && '已完成'}
                    {status === 'on-hold' && '已暂停'}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${currentProject.status === 'planning' ? 'bg-blue-100 text-blue-800' : currentProject.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : currentProject.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {currentProject.status === 'planning' && '规划中'}
                  {currentProject.status === 'in-progress' && '进行中'}
                  {currentProject.status === 'completed' && '已完成'}
                  {currentProject.status === 'on-hold' && '已暂停'}
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">日期</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">开始日期</label>
                {editMode ? (
                  <Input
                    type="date"
                    value={currentProject.startDate.split('T')[0]}
                    onChange={(e) => handleInputChange('startDate', new Date(e.target.value).toISOString())}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm">{new Date(currentProject.startDate).toLocaleDateString()}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">结束日期</label>
                {editMode ? (
                  <Input
                    type="date"
                    value={currentProject.endDate ? currentProject.endDate.split('T')[0] : ''}
                    onChange={(e) => handleInputChange('endDate', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm">{currentProject.endDate ? new Date(currentProject.endDate).toLocaleDateString() : '未设置'}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">任务列表</h3>
              <span className="text-xs text-muted-foreground">
                {currentProject.tasks.filter(t => t.status === 'completed').length}/{currentProject.tasks.length} 已完成
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="添加新任务..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <Button onClick={handleAddTask} size="sm" variant="outline">
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {currentProject.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">暂无任务</p>
              ) : (
                currentProject.tasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleUpdateTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                            className={`mr-2 ${task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            const nextStatus = task.status === 'todo' ? 'in-progress' : 
                                             task.status === 'in-progress' ? 'completed' : 'todo';
                            handleUpdateTaskStatus(task.id, nextStatus);
                          }}
                          className={`text-xs px-2 py-1 rounded-full cursor-pointer ${getTaskStatusColor(task.status)}`}
                        >
                          {task.status === 'todo' && '待办'}
                          {task.status === 'in-progress' && '进行中'}
                          {task.status === 'completed' && '已完成'}
                        </button>
                        <button 
                          onClick={() => {
                            const nextPriority = task.priority === 'low' ? 'medium' : 
                                               task.priority === 'medium' ? 'high' : 'low';
                            handleUpdateTaskPriority(task.id, nextPriority);
                          }}
                          className={`text-xs px-2 py-1 rounded-full cursor-pointer ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority === 'low' && '低'}
                          {task.priority === 'medium' && '中'}
                          {task.priority === 'high' && '高'}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}