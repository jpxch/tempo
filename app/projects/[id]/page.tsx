import { notFound } from 'next/navigation';

import { dashboardData } from '@/lib/dashboard-data';
import { ProjectDetailClient } from '@/components/projects/ProjectDetailClient';

export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const projectExists = dashboardData.projects.some((p) => p.id === id);

  if (!projectExists) {
    notFound();
  }

  return <ProjectDetailClient projectId={id} />;
}

export function generateStaticParams() {
  return dashboardData.projects.map((project) => ({ id: project.id }));
}
