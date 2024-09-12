export type EventDetail = {
  id: number;
  event_name: string;
  event_date: string;
  meeting_time: string;
  meeting_place: string;
  description: string;
  created_by?: number;
  participants: Array<{
    id: number;
    username: string;
  }>;
  invited_friends?: Array<{
    id: number;
    username: string;
  }>;
  messages: Message[];
};

export type CalendarEvent = {
  id: number;
  event_name: string;
  event_date: string;
};

export type EventInvite = {
  id: number;
  event_name: string;
  event_date: string;
  meeting_time: string;
  meeting_place: string;
  description: string;
  invited_by: string;
};

export type Message = {
  id: string;
  user: string;
  message: string;
  timestamp: string;
};
