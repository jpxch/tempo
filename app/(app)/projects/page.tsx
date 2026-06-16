import { fetchClients, fetchProjects } from '@/lib/supabase/queries';
import { ProjectsClient } from '@/components/projects/ProjectsClient';

export default async function ProjectsPage() {
  const [projects, clients] = await Promise.all([fetchProjects(), fetchClients()]);
  return <ProjectsClient initialProjects={projects} initialClients={clients} />;
}
