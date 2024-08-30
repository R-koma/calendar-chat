'use client';

import React, { useEffect, useState } from 'react';
import useDate from '@/hooks/useDate';
import useFetchUser from '@/hooks/useFetchUser';
import useMenu from '@/hooks/useMenu';
import useModal from '@/hooks/useModal';
import api from '@/utils/api';
import { User } from '@/types/User';
import { useFriends } from '@/contexts/FriendsContext';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarMenu from './CalendarMenu';
import SearchUser from './SearchUser';
import CalendarEventCreateForm from './CalendarEventCreateForm';

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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="calendar-container bg-white  shadow rounded-lg overflow-hidden relative">
      <CalendarHeader
        user={user}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        toggleMenu={toggleMenu}
      />
      <CalendarDays currentDate={currentDate} />
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
      />

      <CalendarEventCreateForm
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
      />
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
