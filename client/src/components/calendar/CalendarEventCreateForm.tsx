'use client';

import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { User } from '@/types/User';
import api from '@/utils/api';
import { useFriends } from '@/contexts/FriendsContext';
import InviteFriendsModal from './InviteFriendsModal';

type ModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
  isInviteModalOpen: boolean;
  setInviteModalOpen: (isOpen: boolean) => void;
};

export default function CalendarEventCreateForm({
  isModalOpen,
  closeModal,
  selectedDate,
  handleDateChange,
  isInviteModalOpen,
  setInviteModalOpen,
}: ModalProps) {
  const [eventName, setEventName] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingPlace, setMeetingPlace] = useState('');
  const [description, setDescription] = useState('');
  const [invitedFriends, setInvitedFriends] = useState<User[]>([]);
  // const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { friends } = useFriends();

  const handleOpenInviteModal = () => setInviteModalOpen(true);

  const handleInviteFriends = (selectedFriends: User[]) => {
    setInvitedFriends(selectedFriends);
    setInviteModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrf_access_token='))
        ?.split('=')[1];

      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      await api.post(
        '/event/create',
        {
          event_name: eventName,
          event_date: selectedDate,
          meeting_time: meetingTime,
          meeting_place: meetingPlace,
          description,
          invitees: invitedFriends.map((friend) => friend.id),
        },
        { headers: { 'X-CSRF-TOKEN': csrfToken } },
      );
      closeModal();
    } catch (err) {
      setError('イベントの作成に失敗しました');
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
        isModalOpen ? '' : 'hidden'
      }`}
    >
      <div className="bg-gray-800 p-6 rounded shadow-lg w-96 relative">
        <CloseIcon
          className="absolute top-2 right-2 icon-extra-small cursor-pointer"
          onClick={closeModal}
        />
        <h2 className="text-lg text-center mb-4 font-bold">イベント作成</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              イベント名
              <input
                type="text"
                className="w-full h-5 p-2 border rounded text-gray-700 text-xs outline-none"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-2">
            <div className="block text-xxs font-bold">
              日付
              <DatePicker
                id="date-picker"
                selected={selectedDate}
                onChange={handleDateChange}
                className="w-full h-5 p-2 border rounded text-gray-700 text-xxs outline-none"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              時間
              <input
                type="text"
                className="w-full h-5 p-2 border rounded text-gray-700 text-xs outline-none"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              場所
              <input
                type="text"
                className="w-full h-5 p-2 border rounded text-gray-700 text-xs outline-none"
                value={meetingPlace}
                onChange={(e) => setMeetingPlace(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              説明
              <textarea
                className="w-full h-12 p-2 border rounded text-gray-700 text-xxs outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-2">
            <button
              type="button"
              className="flex items-center text-blue-500 text-xxs font-bold"
              onClick={handleOpenInviteModal}
            >
              <AddIcon className="icon-extra-small" />
              友達を招待
            </button>
            <ul className="mt-2">
              {invitedFriends.map((friend) => (
                <li key={friend.id} className="text-xxs">
                  {friend.username}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center mr-2 p-2 border-none rounded bg-gray-400 text-xxs h-6"
              onClick={closeModal}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex items-center p-2 border-none rounded bg-blue-500 text-xxs text-white h-6"
            >
              作成
            </button>
          </div>
        </form>
        <InviteFriendsModal
          isOpen={isInviteModalOpen}
          closeModal={() => setInviteModalOpen(false)}
          friends={friends}
          onInvite={handleInviteFriends}
          alreadyInvitedFriends={[]}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
