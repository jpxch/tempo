import type { DashboardData } from '@/types/dashboard';

export const dashboardData: DashboardData = {
  todayItems: [
    {
      time: '9:00 AM',
      title: 'Review rehearsal plan',
      detail: 'Prep notes for today’s choreography session',
      type: 'Prep',
      projectId: 'artist-choreo-package',
    },
    {
      time: '12:30 PM',
      title: 'Follow up with artist team',
      detail: 'Confirm music cut, room time, and dancers',
      type: 'Follow-up',
      projectId: 'artist-choreo-package',
    },
    {
      time: '4:00 PM',
      title: 'Creative check-in',
      detail: 'Review concept notes and update project direction',
      type: 'Meeting',
      projectId: 'artist-choreo-package',
    },
  ],

  weekItems: [
    {
      title: 'Showcase rehearsal',
      dueLabel: 'Thursday',
      projectId: 'live-show-prep',
    },
    {
      title: 'Payment follow-up',
      dueLabel: 'Friday',
      projectId: 'artist-choreo-package',
    },
    {
      title: 'New artist concept review',
      dueLabel: 'Weekend',
      projectId: 'workshop-series',
    },
  ],

  projects: [
    {
      id: 'artist-choreo-package',
      name: 'Artist Choreo Package',
      status: 'Active',
      next: 'Needs music notes cleaned up',
      color: '#a78bfa',
    },
    {
      id: 'live-show-prep',
      name: 'Live Show Prep',
      status: 'Upcoming',
      next: 'Confirm dancers and rehearsal space',
      color: '#38bdf8',
    },
    {
      id: 'workshop-series',
      name: 'Workshop Series',
      status: 'Waiting',
      next: 'Waiting on client approval',
      color: '#f472b6',
    },
  ],

  notes: [
    'Bridge section needs stronger transition.',
    'Try formation change after second chorus.',
    'Ask about lighting cues before final rehearsal.',
  ],
};
