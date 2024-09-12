'use client';

import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';
import EventIcon from '@mui/icons-material/Event';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { EventDetail } from '@/types/Event';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useFriends } from '@/contexts/FriendsContext';
import { User } from '@/types/User';
import InviteFriendsModal from './InviteFriendsModal';
import useFetchUser from '@/hooks/useFetchUser';

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
  const [isEditing, setIsEditing] = useState(false);
  const [eventName, setEventName] = useState(event.event_name);
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingPlace, setMeetingPlace] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState(event.participants);
  const [invitedFriends, setInvitedFriends] = useState<User[]>([]);
  const [created_by, setCreated_by] = useState(event.created_by);
  const [error, setError] = useState<string | null>(null);
  const handleOpenInviteModal = () => setInviteModalOpen(true);
  const router = useRouter();
  const { user } = useFetchUser();
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
        setMeetingTime(response.data.meeting_time);
        setMeetingPlace(response.data.meeting_place);
        setDescription(response.data.description);
        setCreated_by(response.data.created_by);
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

  const handleUpdateEvent = async () => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrf_access_token='))
        ?.split('=')[1];

      await api.put(
        `/event/${event.id}/update`,
        {
          event_name: eventName,
          meeting_time: meetingTime,
          meeting_place: meetingPlace,
          description: description,
        },
        { headers: { 'X-CSRF-TOKEN': csrfToken } },
      );
      setIsEditing(false); // 編集モード終了
    } catch (err) {
      setError('イベントの更新に失敗しました');
    }
  };

  // イベント削除のための関数
  const handleDeleteEvent = async () => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrf_access_token='))
        ?.split('=')[1];

      await api.delete(`/event/${event.id}/delete`, {
        headers: { 'X-CSRF-TOKEN': csrfToken },
      });
      window.location.reload();
    } catch (err) {
      setError('イベントの削除に失敗しました');
    }
  };
  console.log(user?.id, event.created_by);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-96 relative">
        <CloseIcon
          className="absolute top-2 right-2 cursor-pointer"
          onClick={onClose}
        />
        <h2 className="text-md text-center mb-4 font-bold">イベント詳細</h2>
        {isEditing ? (
          // 編集モード
          <div>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="mb-2 p-1 w-full"
            />
            <input
              type="text"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="mb-2 p-1 w-full"
            />
            <input
              type="text"
              value={meetingPlace}
              onChange={(e) => setMeetingPlace(e.target.value)}
              className="mb-2 p-1 w-full"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-2 p-1 w-full"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleUpdateEvent}
                className="bg-blue-500 text-white p-1 rounded"
              >
                更新
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white p-1 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-2 flex items-center">
              <PushPinIcon
                className="w-1/3 mr-4"
                style={{ width: '16px', height: '16px' }}
              />
              <div className="w-1/3 text-xxs font-bold">イベント名</div>
              <div className="w-1/3 text-xs text-gray-300">
                {event.event_name}
              </div>
            </div>
            <div className="mb-2 flex items-center">
              <EventIcon
                className="w-1/3 mr-4"
                style={{ width: '16px', height: '16px' }}
              />
              <div className="w-1/3 text-xxs font-bold">日付</div>
              <div className="w-1/3 text-xs text-gray-300">
                {new Date(event.event_date).toLocaleDateString()}
              </div>
            </div>
            <div className="mb-2 flex items-center">
              <QueryBuilderIcon
                className="w-1/3 mr-4"
                style={{ width: '16px', height: '16px' }}
              />
              <div className="w-1/3 text-xxs font-bold">時間</div>
              <div className="w-1/3 text-xs text-gray-300">{meetingTime}</div>
            </div>
            <div className="mb-2 flex items-center">
              <LocationOnIcon
                className="w-1/3 mr-4"
                style={{ width: '16px', height: '16px' }}
              />
              <div className="w-1/3 text-xxs font-bold">場所</div>
              <div className="w-1/3 text-xs text-gray-300">{meetingPlace}</div>
            </div>
            <div className="mb-2 flex items-center">
              <DescriptionIcon
                className="w-1/3 mr-4"
                style={{ width: '16px', height: '16px' }}
              />
              <div className="w-1/3 text-xxs font-bold">説明</div>
              <div className="w-1/3 text-xs text-gray-300">{description}</div>
            </div>
            <div className="mb-2 flex items-center">
              <PersonIcon
                className="w-1/3 mr-4"
                style={{ width: '16px', height: '16px' }}
              />
              <div className="w-1/3 text-xxs font-bold">参加者</div>
              <ul className="w-1/3 flex items-center text-xs text-gray-300">
                {participants.length > 0 ? (
                  participants.map((participant) => (
                    <li className="mr-2" key={participant.id}>
                      {participant.username}
                    </li>
                  ))
                ) : (
                  <li>参加者がいません</li>
                )}
                {showAddFriendsButton && (
                  <PersonAddIcon
                    className="w-1/3 flex items-center text-blue-500 text-xxs font-bold cursor-pointer"
                    style={{ width: '16px', height: '16px' }}
                    onClick={handleOpenInviteModal}
                  />
                )}
              </ul>
            </div>
            <div className="mb-2 flex items-center">
              <PersonAddIcon
                className="w-1/3 mr-4"
                style={{ width: '16px', height: '16px' }}
              />
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
          {user?.id === created_by && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="flex items-center p-2 border-none rounded bg-gray-400 text-xxs text-white h-6"
                onClick={() => setIsEditing(true)} // 編集モードに切り替え
              >
                <EditIcon style={{ fontSize: '16px' }} /> 編集
              </button>
              <button
                type="button"
                className="flex items-center p-2 border-none rounded bg-red-500 text-xxs text-white h-6 ml-2"
                onClick={handleDeleteEvent} // 削除関数を呼び出す
              >
                <DeleteIcon style={{ fontSize: '16px' }} />
                削除
              </button>
            </div>
          )}
        </div>
      </div>
      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
    </div>
  );
}
