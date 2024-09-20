'use client';

import { useState, useEffect } from 'react';
import { EventDetail } from '@/types/Event';
import { User } from '@/types/User';

export function useEventForm(initialEvent: EventDetail | null = null) {
  const [eventName, setEventName] = useState(initialEvent?.event_name || '');
  const [meetingTime, setMeetingTime] = useState(
    initialEvent?.meeting_time || '',
  );
  const [meetingPlace, setMeetingPlace] = useState(
    initialEvent?.meeting_place || '',
  );
  const [description, setDescription] = useState(
    initialEvent?.description || '',
  );
  const [invitedFriends, setInvitedFriends] = useState<User[]>([]);
  const [participants, setParticipants] = useState(
    initialEvent?.participants || [],
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEvent) {
      setEventName(initialEvent.event_name);
      setMeetingTime(initialEvent.meeting_time);
      setMeetingPlace(initialEvent.meeting_place);
      setDescription(initialEvent.description);
      setParticipants(initialEvent.participants);
    }
  }, [initialEvent]);

  return {
    eventName,
    setEventName,
    meetingTime,
    setMeetingTime,
    meetingPlace,
    setMeetingPlace,
    description,
    setDescription,
    invitedFriends,
    setInvitedFriends,
    participants,
    setParticipants,
    error,
    setError,
  };
}
