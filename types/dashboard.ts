export type Client = {
  id: string;
  name: string;
  contactName: string | null;
};

export type Project = {
  id: string;
  name: string;
  status: string;
  next: string;
  color: string;
  clientId: string | null;
};

export type TodayItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
  type: string;
  projectId: string;
};

export type WeekItem = {
  title: string;
  dueLabel: string;
  projectId: string;
};

export type FollowUp = {
  id: string;
  person: string;
  reason: string;
  dueLabel: string;
  projectId: string;
  status: string; // 'open' | 'done'
};

export type Note = {
  id: string;
  title: string;
  preview: string;
  projectId: string;
  updatedLabel: string;
};

export type DashboardData = {
  todayItems: TodayItem[];
  weekItems: WeekItem[];
  followUps: FollowUp[];
  projects: Project[];
  notes: Note[];
};
