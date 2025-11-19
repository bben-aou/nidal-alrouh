import {
  CommunityEvent,
  EventType,
  EventStatus,
  GetEventsResponse,
  CreateEventData,
  UpdateEventData,
} from '@/types/community';

export const USE_MOCK_EVENTS = true; // Toggle this to switch between mock and real data

const mockEvents: CommunityEvent[] = [
  {
    id: '1',
    title: 'Mindfulness Workshop: Managing Daily Stress',
    description:
      'Join us for an interactive workshop on mindfulness techniques to manage daily stress and anxiety. Learn practical breathing exercises and meditation practices that you can incorporate into your daily routine.',
    type: 'workshop',
    status: 'upcoming',
    startDate: '2024-11-20',
    endDate: '2024-11-20',
    startTime: '14:00',
    endTime: '16:00',
    timezone: 'UTC',
    location: 'Community Center - Room 101',
    meetingUrl: 'https://zoom.us/j/123456789',
    maxAttendees: 25,
    currentAttendees: 18,
    isRegistered: true,
    requiresApproval: false,
    coverImage: 'https://github.com/evilrabbit.png',
    tags: ['mindfulness', 'stress', 'workshop', 'mental-health'],
    createdAt: '2024-11-15T10:30:00Z',
    updatedAt: '2024-11-15T10:30:00Z',
    organizer: {
      id: 'user-001',
      name: 'Dr. Sarah Johnson',
      avatar: '/images/avatars/sarah-johnson.jpg',
      role: 'Licensed Therapist',
    },
    attendees: [
      {
        id: 'user-002',
        name: 'Ahmed M.',
        avatar: '/images/avatars/ahmed-m.jpg',
        registeredAt: '2024-11-16T09:15:00Z',
      },
      {
        id: 'user-003',
        name: 'Maria L.',
        avatar: '/images/avatars/maria-l.jpg',
        registeredAt: '2024-11-16T14:20:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Support Session: Building Healthy Relationships',
    description:
      'A safe space to discuss relationship challenges and learn communication strategies. Share experiences and receive support from others navigating similar situations.',
    type: 'supportSession',
    status: 'upcoming',
    startDate: '2024-11-22',
    endDate: '2024-11-22',
    startTime: '18:00',
    endTime: '19:30',
    timezone: 'UTC',
    location: 'Online',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    maxAttendees: 15,
    currentAttendees: 12,
    isRegistered: false,
    requiresApproval: true,
    coverImage: 'https://github.com/evilrabbit.png',
    tags: ['relationships', 'communication', 'support', 'group-therapy'],
    createdAt: '2024-11-10T16:45:00Z',
    updatedAt: '2024-11-10T16:45:00Z',
    organizer: {
      id: 'user-004',
      name: 'Michael Chen',
      avatar: '/images/avatars/michael-chen.jpg',
      role: 'Support Group Facilitator',
    },
  },
  {
    id: '3',
    title: 'One-on-One Consultation: Anxiety Management',
    description:
      'Personalized consultation session focused on developing coping strategies for anxiety. Limited spots available for individual attention.',
    type: 'consultation',
    status: 'upcoming',
    startDate: '2024-11-25',
    endDate: '2024-11-25',
    startTime: '10:00',
    endTime: '11:00',
    timezone: 'UTC',
    location: 'Private Office',
    meetingUrl: 'https://zoom.us/j/987654321',
    maxAttendees: 1,
    currentAttendees: 0,
    isRegistered: false,
    requiresApproval: true,
    coverImage: 'https://github.com/evilrabbit.png',
    tags: ['anxiety', 'consultation', 'individual', 'therapy'],
    createdAt: '2024-11-12T08:30:00Z',
    updatedAt: '2024-11-12T08:30:00Z',
    organizer: {
      id: 'user-005',
      name: 'Dr. Emily Rodriguez',
      avatar: '/images/avatars/emily-rodriguez.jpg',
      role: 'Clinical Psychologist',
    },
  },
  {
    id: '4',
    title: 'Community Meeting: Mental Health Awareness',
    description:
      'Monthly community gathering to discuss mental health topics, share resources, and connect with others. Open to all community members.',
    type: 'communityMeeting',
    status: 'upcoming',
    startDate: '2024-11-28',
    endDate: '2024-11-28',
    startTime: '19:00',
    endTime: '20:30',
    timezone: 'UTC',
    location: 'Community Hall',
    maxAttendees: 50,
    currentAttendees: 32,
    isRegistered: true,
    requiresApproval: false,
    coverImage: 'https://github.com/evilrabbit.png',
    tags: ['community', 'awareness', 'mental-health', 'support'],
    createdAt: '2024-11-01T12:00:00Z',
    updatedAt: '2024-11-01T12:00:00Z',
    organizer: {
      id: 'user-006',
      name: 'Community Team',
      avatar: '/images/avatars/community-team.jpg',
      role: 'Community Manager',
    },
  },
  {
    id: '5',
    title: 'Webinar: Understanding Depression',
    description:
      'Educational webinar exploring the signs, symptoms, and treatment options for depression. Q&A session included.',
    type: 'webinar',
    status: 'ongoing',
    startDate: '2024-11-18',
    endDate: '2024-11-18',
    startTime: '15:00',
    endTime: '16:30',
    timezone: 'UTC',
    location: 'Online',
    meetingUrl: 'https://zoom.us/j/555555555',
    maxAttendees: 100,
    currentAttendees: 67,
    isRegistered: true,
    requiresApproval: false,
    coverImage: 'https://github.com/evilrabbit.png',
    tags: ['depression', 'education', 'webinar', 'mental-health'],
    createdAt: '2024-11-05T09:15:00Z',
    updatedAt: '2024-11-05T09:15:00Z',
    organizer: {
      id: 'user-007',
      name: 'Prof. David Wilson',
      avatar: '/images/avatars/david-wilson.jpg',
      role: 'Psychiatry Professor',
    },
  },
  {
    id: '6',
    title: 'Workshop: Stress Management Techniques',
    description:
      'Hands-on workshop teaching practical stress management techniques including breathing exercises, progressive muscle relaxation, and cognitive reframing.',
    type: 'workshop',
    status: 'completed',
    startDate: '2024-11-15',
    endDate: '2024-11-15',
    startTime: '11:00',
    endTime: '13:00',
    timezone: 'UTC',
    location: 'Wellness Center',
    maxAttendees: 20,
    currentAttendees: 18,
    isRegistered: true,
    requiresApproval: false,
    coverImage: 'https://github.com/evilrabbit.png',
    tags: ['stress', 'workshop', 'techniques', 'relaxation'],
    createdAt: '2024-11-08T14:30:00Z',
    updatedAt: '2024-11-08T14:30:00Z',
    organizer: {
      id: 'user-008',
      name: 'Lisa Thompson',
      avatar: '/images/avatars/lisa-thompson.jpg',
      role: 'Wellness Coach',
    },
  },
  {
    id: '7',
    title: 'Support Session: Coping with Loss',
    description:
      'Compassionate support session for those dealing with grief and loss. Share your journey in a safe, understanding environment.',
    type: 'supportSession',
    status: 'upcoming',
    startDate: '2024-12-02',
    endDate: '2024-12-02',
    startTime: '17:00',
    endTime: '18:30',
    timezone: 'UTC',
    location: 'Support Center',
    meetingUrl: 'https://zoom.us/j/777777777',
    maxAttendees: 12,
    currentAttendees: 8,
    isRegistered: false,
    requiresApproval: false,
    coverImage: 'https://github.com/evilrabbit.png',
    tags: ['grief', 'loss', 'support', 'healing'],
    createdAt: '2024-11-20T10:45:00Z',
    updatedAt: '2024-11-20T10:45:00Z',
    organizer: {
      id: 'user-009',
      name: 'Rev. Patricia Brown',
      avatar: '/images/avatars/patricia-brown.jpg',
      role: 'Grief Counselor',
    },
  },
  {
    id: '8',
    title: 'Consultation: Career Anxiety',
    description:
      'Individual consultation to address career-related anxiety and develop strategies for workplace stress management.',
    type: 'consultation',
    status: 'upcoming',
    startDate: '2024-12-05',
    endDate: '2024-12-05',
    startTime: '14:30',
    endTime: '15:30',
    timezone: 'UTC',
    location: 'Online',
    meetingUrl: 'https://zoom.us/j/888888888',
    maxAttendees: 1,
    currentAttendees: 1,
    isRegistered: true,
    requiresApproval: true,
    coverImage: 'https://github.com/evilrabbit.png',
    tags: ['career', 'anxiety', 'consultation', 'workplace'],
    createdAt: '2024-11-22T11:20:00Z',
    updatedAt: '2024-11-22T11:20:00Z',
    organizer: {
      id: 'user-010',
      name: 'Dr. James Miller',
      avatar: '/images/avatars/james-miller.jpg',
      role: 'Career Counselor',
    },
  },
];

// Mock API functions
export const getMockEvents = async (
  page = 1,
  limit = 10,
  filters?: {
    type?: EventType;
    status?: EventStatus;
    search?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<GetEventsResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredEvents = [...mockEvents];

  // Apply filters
  if (filters?.type) {
    filteredEvents = filteredEvents.filter(
      (event) => event.type === filters.type
    );
  }

  if (filters?.status) {
    filteredEvents = filteredEvents.filter(
      (event) => event.status === filters.status
    );
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filters?.startDate) {
    filteredEvents = filteredEvents.filter(
      (event) => event.startDate >= filters.startDate!
    );
  }

  if (filters?.endDate) {
    filteredEvents = filteredEvents.filter(
      (event) => event.endDate <= filters.endDate!
    );
  }

  // Pagination
  const total = filteredEvents.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const events = filteredEvents.slice(startIndex, endIndex);

  return {
    items: events,
    total,
    nextCursor: endIndex < total ? String(page + 1) : undefined,
  };
};

export const getMockEventById = async (
  id: string
): Promise<CommunityEvent | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const event = mockEvents.find((event) => event.id === id);
  return event || null;
};

export const registerForMockEvent = async (
  eventId: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const eventIndex = mockEvents.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) {
    return { success: false, message: 'Event not found' };
  }

  const event = mockEvents[eventIndex];

  if (event.currentAttendees >= (event.maxAttendees || Infinity)) {
    return { success: false, message: 'Event is full' };
  }

  if (event.isRegistered) {
    return { success: false, message: 'Already registered for this event' };
  }

  // Update the event
  mockEvents[eventIndex] = {
    ...event,
    isRegistered: true,
    currentAttendees: event.currentAttendees + 1,
  };

  return { success: true, message: 'Successfully registered for the event' };
};

export const unregisterFromMockEvent = async (
  eventId: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const eventIndex = mockEvents.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) {
    return { success: false, message: 'Event not found' };
  }

  const event = mockEvents[eventIndex];

  if (!event.isRegistered) {
    return { success: false, message: 'Not registered for this event' };
  }

  // Update the event
  mockEvents[eventIndex] = {
    ...event,
    isRegistered: false,
    currentAttendees: Math.max(0, event.currentAttendees - 1),
  };

  return { success: true, message: 'Successfully unregistered from the event' };
};

export const createMockEvent = async (
  eventData: CreateEventData
): Promise<CommunityEvent> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const newEvent: CommunityEvent = {
    id: `event-${Date.now()}`,
    ...eventData,
    status: 'upcoming',
    currentAttendees: 0,
    isRegistered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    organizer: {
      id: 'current-user',
      name: 'You',
      avatar: '/images/avatars/current-user.jpg',
      role: 'Community Member',
    },
  };

  mockEvents.unshift(newEvent);
  return newEvent;
};

export const updateMockEvent = async (
  eventId: string,
  eventData: UpdateEventData
): Promise<CommunityEvent | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const eventIndex = mockEvents.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) {
    return null;
  }

  mockEvents[eventIndex] = {
    ...mockEvents[eventIndex],
    ...eventData,
    updatedAt: new Date().toISOString(),
  };

  return mockEvents[eventIndex];
};

export const deleteMockEvent = async (eventId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const eventIndex = mockEvents.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) {
    return false;
  }

  mockEvents.splice(eventIndex, 1);
  return true;
};

// Export mock data for testing
export { mockEvents };
