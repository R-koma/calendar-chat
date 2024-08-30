export type EventDetail = {
  id: number;
  event_name: string;
  event_date: string;
  meeting_time: string;
  meeting_place: string;
  description: string;
  participants: Array<{
    id: number;
    username: string;
  }>;
};

export type Event = {
  id: number;
  event_name: string;
  event_date: string;
};
