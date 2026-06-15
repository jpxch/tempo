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
  person: string;
  reason: string;
  dueLabel: string;
  projectId: string;
};

export type Note = {
  id: string;
  title: string;
  preview: string;
  projectId: string;
  updatedLabel: string;
};

export type Project = {
  id: string;
  name: string;
  status: string;
  next: string;
  color: string;
};

export type DashboardData = {
  todayItems: TodayItem[];
  weekItems: WeekItem[];
  followUps: FollowUp[];
  projects: Project[];
  notes: Note[];
};
