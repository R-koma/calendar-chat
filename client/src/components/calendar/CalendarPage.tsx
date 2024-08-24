'use client';

import React from 'react';
import useDate from '@/hooks/useDate';
import useFetchUser from '@/hooks/useFetchUser';
import useMenu from '@/hooks/useMenu';
import useModal from '@/hooks/useModal';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarMenu from './CalendarMenu';
import CalendarEventCreateForm from './CalendarEventCreateForm';
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
  const { menuOpen, toggleMenu, friendListOpen, toggleFriendList, menuRef } =
    useMenu();
  const { isModalOpen, openModal, closeModal } = useModal();

  const {
    isModalOpen: isSearchModalOpen,
    openModal: openSearchModal,
    closeModal: closeSearchModal,
  } = useModal();

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
    </div>
  );
}
