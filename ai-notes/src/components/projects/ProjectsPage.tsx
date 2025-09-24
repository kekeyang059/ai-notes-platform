'use client';

import { useState } from 'react';
import { Project } from '@/types';
import { saveProject, getProjects } from '@/lib/storage';
import { ProjectsList } from './ProjectsList';
import { ProjectDetail } from './ProjectDetail';

export function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '新项目',
      description: '',
      status: 'planning',
      startDate: new Date().toISOString(),
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 保存新项目到localStorage
    saveProject(newProject);
    // 更新选中的项目
    setSelectedProject(newProject);
    // 强制刷新
    setTimeout(() => {
      setSelectedProject({...newProject});
    }, 0);
  };

  const handleProjectSaved = (project: Project) => {
    // 刷新项目列表
    const projects = getProjects();
    // 更新选中的项目
    setSelectedProject(project);
    // 强制重新渲染，确保项目列表更新
    setSelectedProject(prevProject => {
      if (prevProject && prevProject.id === project.id) {
        return {...project};
      }
      return prevProject;
    });
  };

  return (
    <div className="h-full flex">
      <div className="w-1/3 border-r h-full">
        <ProjectsList
          onSelectProject={handleSelectProject}
          onNewProject={handleNewProject}
          selectedProjectId={selectedProject?.id}
        />
      </div>
      <div className="w-2/3 h-full">
        <ProjectDetail
          project={selectedProject}
          onProjectSaved={handleProjectSaved}
        />
      </div>
    </div>
  );
}