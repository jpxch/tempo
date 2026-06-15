import type { DashboardData } from '@/types/dashboard';

export const dashboardData: DashboardData = {
  todayItems: [
    {
      id: 'review-rehearsal-plan',
      time: '9:00 AM',
      title: 'Review rehearsal plan',
      detail: 'Prep notes for today’s choreography session',
      type: 'Prep',
      projectId: 'artist-choreo-package',
    },
    {
      id: 'follow-up-artist-team',
      time: '12:30 PM',
      title: 'Follow up with artist team',
      detail: 'Confirm music cut, room time, and dancers',
      type: 'Follow-up',
      projectId: 'artist-choreo-package',
    },
    {
      id: 'creative-check-in',
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

  followUps: [
    {
      person: 'Artist Manager',
      reason: 'Waiting on final music cut',
      dueLabel: 'Today',
      projectId: 'artist-choreo-package',
    },
    {
      person: 'Venue Coordinator',
      reason: 'Need stage dimensions',
      dueLabel: 'Tomorrow',
      projectId: 'live-show-prep',
    },
    {
      person: 'Workshop Client',
      reason: 'Approval pending',
      dueLabel: 'This Week',
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
    {
      id: 'bridge-transition',
      title: 'Bridge transition',
      preview: 'Bridge section needs a stronger transition.',
      projectId: 'artist-choreo-package',
      updatedLabel: 'Updated today',
    },
    {
      id: 'formation-change',
      title: 'Formation idea',
      preview: 'Try a formation change after the second chorus.',
      projectId: 'live-show-prep',
      updatedLabel: 'Updated yesterday',
    },
    {
      id: 'lighting-cues',
      title: 'Lighting questions',
      preview: 'Ask about lighting cues before the final rehearsal.',
      projectId: 'workshop-series',
      updatedLabel: 'Updated Monday',
    },
  ],
};
