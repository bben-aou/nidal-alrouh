// Cal.com webhook payload types
export interface CalWebhookPayload {
  triggerEvent: 'BOOKING_CREATED' | 'BOOKING_RESCHEDULED' | 'BOOKING_CANCELLED';
  createdAt: string;
  payload: {
    type: string;
    title: string;
    description: string | null;
    customInputs: Record<string, any>;
    startTime: string;
    endTime: string;
    organizer: {
      id: number;
      name: string;
      email: string;
      timeZone: string;
      language: { locale: string };
    };
    attendees: Array<{
      email: string;
      name: string;
      timeZone: string;
      language: { locale: string };
    }>;
    location: string;
    destinationCalendar: any | null;
    hideCalendarNotes: boolean;
    requiresConfirmation: boolean | null;
    eventTypeId: number;
    seatsShowAttendees: boolean | null;
    seatsPerTimeSlot: number | null;
    uid: string;
    conferenceData: {
      createRequest: { requestId: string };
    } | null;
    videoCallData: {
      type: string;
      id: string;
      password: string;
      url: string;
    } | null;
    appsStatus: any[];
    eventTitle: string;
    eventDescription: string | null;
    price: number;
    currency: string;
    length: number;
    bookingId: number;
    metadata: Record<string, any>;
    status: 'ACCEPTED' | 'PENDING' | 'CANCELLED' | 'REJECTED';
  };
}
