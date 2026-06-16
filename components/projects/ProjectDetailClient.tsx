'use client';

import { useTempo } from '@/components/TempoProvider';
import { ProjectDetailView } from '@/components/projects/ProjectDetailView';

type ProjectDetailClientProps = {
  projectId: string;
};

export function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const { dashboardData } = useTempo();
  const project = dashboardData.projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
        <p className="text-sm text-neutral-500 comfort:text-base">
          Project not found. It may have been deleted.
        </p>
      </div>
    );
  }

  return <ProjectDetailView project={project} data={dashboardData} />;
}
