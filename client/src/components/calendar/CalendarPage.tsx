'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useFriends } from '@/contexts/FriendsContext';
import useDate from '@/hooks/useDate';
import useFetchUser from '@/hooks/useFetchUser';
import useMenu from '@/hooks/useMenu';
import useModal from '@/hooks/useModal';
import { CalendarEvent, EventDetail } from '@/types/Event';
import { User } from '@/types/User';
import api from '@/utils/api';
import CalendarDays from './CalendarDays';
import CalendarEventCreateForm from './CalendarEventCreateForm';
import CalendarHeader from './CalendarHeader';
import CalendarMenu from './CalendarMenu';
import EventDetailModal from './EventDetailModal';
import SearchUser from './SearchUser';

export default function CalendarPage() {
  const { user } = useFetchUser();
  const {
    currentDate,
    setCurrentDate,
    selectedDate,
    handleDateChange,
    view,
    setView,
  } = useDate();
  const {
    menuOpen,
    toggleMenu,
    friendListOpen,
    toggleFriendList,
    friendRequestOpen,
    toggleFriendRequest,
    menuRef,
  } = useMenu();
  const { isModalOpen, openModal, closeModal } = useModal();

  const {
    isModalOpen: isSearchModalOpen,
    openModal: openSearchModal,
    closeModal: closeSearchModal,
  } = useModal();

  const { setFriends } = useFriends();
  const [error, setError] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [showChatButton, setShowChatButton] = useState(false);
  const [showAddFriendsButton, setShowAddFrindsButton] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const openEventDetailModal = (
    event: CalendarEvent,
    showChat: boolean,
    addFriends: boolean,
  ) => {
    const detailedEvent: EventDetail = {
      ...event,
      meeting_time: '',
      meeting_place: '',
      description: '',
      participants: [],
      messages: [],
    };
    setSelectedEvent(detailedEvent);
    setShowChatButton(showChat);
    setShowAddFrindsButton(addFriends);
    setIsEventDetailModalOpen(true);
  };

  const closeEventDetailModal = () => {
    setSelectedEvent(null);
    setIsEventDetailModalOpen(false);
    setShowChatButton(false);
  };

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get<CalendarEvent[]>(
        '/event/user/participated-events',
        {
          params: {
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
          },
        },
      );
      setEvents(response.data);
    } catch (err) {
      setError('イベントの取得に失敗しました');
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents().catch(() => {
      setError('イベントの取得に失敗しました');
    });
  }, [fetchEvents]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get<User[]>('/user/friends');
        setFriends(response.data);
      } catch (err) {
        setError('友達の取得に失敗しました');
      }
    };

    fetchFriends().catch(() => {
      setError('友達の取得に失敗しました');
    });
  }, [setFriends]);

  const handleDeleteEvent = (deletedEventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== deletedEventId),
    );
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="calendar-container bg-white shadow overflow-hidden relative">
      <CalendarHeader
        user={user}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        toggleMenu={toggleMenu}
      />
      <CalendarDays
        currentDate={currentDate}
        openEventDetailModal={openEventDetailModal}
        events={events}
        setEvents={setEvents}
        openModal={openModal}
        handleDateChange={handleDateChange}
      />
      <CalendarMenu
        user={user}
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
        openModal={openModal}
        friendListOpen={friendListOpen}
        toggleFriendList={toggleFriendList}
        friendRequestOpen={friendRequestOpen}
        toggleFriendRequest={toggleFriendRequest}
        menuRef={menuRef}
        openSearchModal={openSearchModal}
        openEventDetailModal={openEventDetailModal}
        fetchEvents={fetchEvents}
      />

      <CalendarEventCreateForm
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        isInviteModalOpen={isInviteModalOpen}
        setInviteModalOpen={setInviteModalOpen}
        fetchEvents={fetchEvents}
      />
      {isEventDetailModalOpen && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={closeEventDetailModal}
          onDelete={handleDeleteEvent}
          showChatButton={showChatButton}
          isInviteModalOpen={isInviteModalOpen}
          setInviteModalOpen={setInviteModalOpen}
          showAddFriendsButton={showAddFriendsButton}
        />
      )}
      {isSearchModalOpen && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
            <h2 className="text-xl text-center font-semibold text-white mb-4">
              友達を検索
            </h2>
            <SearchUser closeSearchModal={closeSearchModal} />
          </div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
