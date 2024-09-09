'use client';

import CloseIcon from '@mui/icons-material/Close';
import { EventDetail } from '@/types/Event';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import { useFriends } from '@/contexts/FriendsContext';
import { User } from '@/types/User';
import InviteFriendsModal from './InviteFriendsModal';

type EventDetailModalProps = {
  event: EventDetail;
  onClose: () => void;
  showChatButton: boolean;
  isInviteModalOpen: boolean;
  setInviteModalOpen: (isOpen: boolean) => void;
  showAddFriendsButton: boolean;
};

export default function EventDetailModal({
  event,
  onClose,
  showChatButton,
  isInviteModalOpen,
  setInviteModalOpen,
  showAddFriendsButton,
}: EventDetailModalProps) {
  const [participants, setParticipants] = useState(event.participants);
  const [invitedFriends, setInvitedFriends] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const handleOpenInviteModal = () => setInviteModalOpen(true);
  const router = useRouter();
  const { friends } = useFriends();

  const startChat = () => {
    if (event.id) {
      router.push(`/chat/${event.id}`);
    } else {
      setError('IDが見つかりません');
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get<EventDetail>(
          `/event/${event.id}/detail`,
        );
        setParticipants(response.data.participants);
        setInvitedFriends(response.data.invited_friends || []);
      } catch (err) {
        setError('イベントの詳細の取得に失敗しました');
      }
    };

    fetchEventDetails().catch(() => {
      setError('イベントの詳細の取得に失敗しました');
    });
  }, [event.id]);

  const handleInviteMoreFriends = async (selectedFriends: User[]) => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrf_access_token='))
        ?.split('=')[1];

      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      await api.post(
        `/event/${event.id}/invite`,
        {
          invitees: selectedFriends.map((friend) => friend.id),
        },
        { headers: { 'X-CSRF-TOKEN': csrfToken } },
      );

      setInvitedFriends((prevInvitedFriends) => [
        ...prevInvitedFriends,
        ...selectedFriends,
      ]);

      setInviteModalOpen(false);
    } catch (err) {
      setError('友達の招待に失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-96 relative">
        <CloseIcon
          className="absolute top-2 right-2 icon-extra-small cursor-pointer"
          onClick={onClose}
        />
        <h2 className="text-lg text-center mb-4 font-bold">イベント詳細</h2>
        <div className="mb-2 flex items-center">
          <div className="w-1/3 text-xxs font-bold">イベント名</div>
          <div className="w-2/3 text-xs text-gray-300">{event.event_name}</div>
        </div>
        <div className="mb-2 flex items-center">
          <div className="w-1/3 text-xxs font-bold">日付</div>
          <div className="w-2/3 text-xs text-gray-300">
            {new Date(event.event_date).toLocaleDateString()}
          </div>
        </div>
        <div className="mb-2 flex items-center">
          <div className="w-1/3 text-xxs font-bold">時間</div>
          <div className="w-2/3 text-xs text-gray-300">
            {event.meeting_time}
          </div>
        </div>
        <div className="mb-2 flex items-center">
          <div className="w-1/3 text-xxs font-bold">場所</div>
          <div className="w-2/3 text-xs text-gray-300">
            {event.meeting_place}
          </div>
        </div>
        <div className="mb-2 flex items-center">
          <div className="w-1/3 text-xxs font-bold">説明</div>
          <div className="w-2/3 text-xs text-gray-300">{event.description}</div>
        </div>
        <div className="mb-2 flex items-center">
          <div className="w-1/3 text-xxs font-bold">参加者</div>
          <ul className="w-1/3 flex text-xs text-gray-300">
            {participants.length > 0 ? (
              participants.map((participant) => (
                <li className="mr-2" key={participant.id}>
                  {participant.username}
                </li>
              ))
            ) : (
              <li>参加者がいません</li>
            )}
          </ul>
          {showAddFriendsButton && (
            <button
              type="button"
              className="w-1/3 flex items-center text-blue-500 text-xxs font-bold"
              onClick={handleOpenInviteModal}
            >
              <AddIcon className="icon-extra-small" />
              追加
            </button>
          )}
        </div>
        <div className="mb-2 flex items-center">
          <div className="w-1/3 text-xxs font-bold">招待リスト</div>
          <ul className="w-1/3 flex text-xs text-gray-300">
            {invitedFriends.length > 0 ? (
              invitedFriends.map((friend) => (
                <li className="mr-2" key={friend.id}>
                  {friend.username}
                </li>
              ))
            ) : (
              <li>招待者はいません。</li>
            )}
          </ul>
        </div>
        <InviteFriendsModal
          isOpen={isInviteModalOpen}
          closeModal={() => setInviteModalOpen(false)}
          friends={friends}
          alreadyInvitedFriends={invitedFriends}
          participants={participants}
          onInvite={handleInviteMoreFriends}
        />
        {showChatButton && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="flex items-center p-2 border-none rounded bg-blue-500 text-xxs text-white h-6"
              onClick={startChat}
            >
              チャットを始める
            </button>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="flex items-center p-2 border-none rounded bg-gray-400 text-xxs text-white h-6"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
    </div>
  );
}
