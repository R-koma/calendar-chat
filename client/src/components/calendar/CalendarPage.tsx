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
      />
      <CalendarEventCreateForm
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
      />
    </div>
  );
}
