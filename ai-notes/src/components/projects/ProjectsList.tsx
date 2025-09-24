'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { getProjects, deleteProject } from '@/lib/storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2 } from 'lucide-react';

interface ProjectsListProps {
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
  selectedProjectId?: string;
}

export function ProjectsList({ onSelectProject, onNewProject, selectedProjectId }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(() => getProjects());

  // 添加useEffect钩子，确保在组件挂载和依赖项变化时重新获取项目列表
  useEffect(() => {
    // 获取最新的项目列表
    setProjects(getProjects());
  }, []);

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个项目吗？')) {
      deleteProject(id);
      setProjects(getProjects());
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">项目列表</h2>
        <button
          onClick={onNewProject}
          className="flex items-center text-sm text-primary hover:text-primary/80"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          新建项目
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {projects.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              没有项目，点击"新建项目"创建
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${selectedProjectId === project.id ? 'bg-accent' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                    {project.status === 'planning' && '规划中'}
                    {project.status === 'in-progress' && '进行中'}
                    {project.status === 'completed' && '已完成'}
                    {project.status === 'on-hold' && '已暂停'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}