import { notFound } from 'next/navigation';
import { dashboardData } from '@/lib/dashboard-data';
import { ProjectDetailView } from '@/components/projects/ProjectDetailView';

export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const project = dashboardData.projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} data={dashboardData} />;
}

export function generateStaticParams() {
  return dashboardData.projects.map((project) => ({ id: project.id }));
}
