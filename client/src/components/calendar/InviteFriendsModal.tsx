'use client';

import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import { User } from '@/types/User';

type InviteFriendsModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  friends: User[];
  onInvite: (selectedFriends: User[]) => void;
  alreadyInvitedFriends?: User[];
  participants?: User[];
};

export default function InviteFriendsModal({
  isOpen,
  closeModal,
  friends,
  onInvite,
  alreadyInvitedFriends = [],
  participants = [],
}: InviteFriendsModalProps) {
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);

  const availableFriends = friends.filter((friend: User) => {
    const isAlreadyInvited = alreadyInvitedFriends.some(
      (invited) => invited.id === friend.id,
    );
    const isParticipant = participants.some(
      (participant) => participant.id === friend.id,
    );
    return !isAlreadyInvited && !isParticipant;
  });

  const handleSelectFriend = (friend: User) => {
    setSelectedFriends((prev) =>
      prev.some((f) => f.id === friend.id)
        ? prev.filter((f) => f.id !== friend.id)
        : [...prev, friend],
    );
  };

  const handleInvite = () => {
    onInvite(selectedFriends);
    closeModal();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="bg-gray-800 p-6 rounded shadow-lg w-96 relative">
        <CloseIcon
          className="absolute top-2 right-2 icon-extra-small cursor-pointer"
          onClick={closeModal}
        />
        <h2 className="text-lg text-center mb-4 font-bold">
          {alreadyInvitedFriends.length > 0 ? '追加で招待' : '友達を招待'}
        </h2>
        <div className="mb-2">
          <input
            type="text"
            placeholder="名前で検索"
            className="w-full h-5 p-2 border rounded text-gray-700 text-xs outline-none mb-4"
          />
        </div>
        <div className="mb-2">
          {availableFriends.map((friend) => (
            <div key={friend.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedFriends.some((f) => f.id === friend.id)}
                onChange={() => handleSelectFriend(friend)}
              />
              <span className="text-xxs">{friend.username}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="mr-2 p-1 border-none rounded bg-gray-400 text-xxs h-6"
            onClick={closeModal}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="w-1/4 p-1 border-none rounded bg-blue-500 text-xxs text-white h-6"
            onClick={handleInvite}
          >
            招待
          </button>
        </div>
      </div>
    </div>
  );
}
