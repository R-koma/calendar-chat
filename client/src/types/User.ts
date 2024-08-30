export interface User {
  id: number;
  username: string;
  email: string;
}

export interface EventInvite {
  id: number;
  event_name: string;
  event_date: string;
  meeting_time: string;
  meeting_place: string;
  description: string;
  invited_by: string;
}
