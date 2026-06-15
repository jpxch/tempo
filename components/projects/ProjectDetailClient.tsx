'use client';

import { useTempo } from '@/components/TempoProvider';
import { ProjectDetailView } from '@/components/projects/ProjectDetailView';

type ProjectDetailClientProps = {
  projectId: string;
};

export function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const { dashboardData } = useTempo();
  const project = dashboardData.projects.find((p) => p.id === projectId);

  if (!project) return null;

  return <ProjectDetailView project={project} data={dashboardData} />;
}
