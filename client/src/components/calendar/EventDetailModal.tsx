'use client';

import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PushPinIcon from '@mui/icons-material/PushPin';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFriends } from '@/contexts/FriendsContext';
import useFetchUser from '@/hooks/useFetchUser';
import { EventDetail } from '@/types/Event';
import { User } from '@/types/User';
import api from '@/utils/api';
import InviteFriendsModal from './InviteFriendsModal';
import { useEventForm } from '@/hooks/useEventForm';

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
  const [createdBy, setCreatedBy] = useState(event.created_by);
  const handleOpenInviteModal = () => setInviteModalOpen(true);
  const router = useRouter();
  const { user } = useFetchUser();
  const { friends } = useFriends();
  const {
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
  } = useEventForm(event);

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
        setCreatedBy(response.data.created_by);
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

  useEffect(() => {
    if (isEditing) {
      setEventName(event.event_name);
      setMeetingTime(event.meeting_time);
      setMeetingPlace(event.meeting_place);
      setDescription(event.description);
    }
  }, [isEditing, event]);

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
          description,
        },
        { headers: { 'X-CSRF-TOKEN': csrfToken } },
      );
      setIsEditing(false);
    } catch (err) {
      setError('イベントの更新に失敗しました');
    }
  };

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-96 relative">
        <CloseIcon
          className="absolute top-2 right-2 cursor-pointer"
          onClick={onClose}
        />
        <div className="flex items-center justify-center mb-4">
          <h2 className="flex justify-center text-md text-center mr-4 font-bold">
            イベント詳細
          </h2>
          {user?.id === createdBy && (
            <div className="flex items-center">
              {!isEditing && (
                <button
                  type="button"
                  className="flex items-center p-1 border-none rounded bg-gray-400 text-xxs text-white h-6"
                  onClick={() => setIsEditing(true)}
                >
                  <EditIcon style={{ fontSize: '16px' }} />
                </button>
              )}
              <button
                type="button"
                className="flex items-center p-1 border-none rounded bg-red-500 text-xxs text-white h-6 ml-2"
                onClick={handleDeleteEvent}
              >
                <DeleteIcon style={{ fontSize: '16px' }} />
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div>
            <div className="mb-2">
              <label className="block text-xxs font-bold">
                イベント名
                <input
                  type="text"
                  className="w-full h-8 p-2 border rounded text-gray-700 text-xs outline-none"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-2">
              <label className="block text-xxs font-bold">
                時間
                <select
                  className="w-full h-8 p-2 border rounded text-gray-700 text-xs outline-none"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                >
                  <option value="" />
                  <option value="未定">未定</option>
                  <option value="00:00">0:00</option>
                  <option value="01:00">1:00</option>
                  <option value="02:00">2:00</option>
                  <option value="03:00">3:00</option>
                  <option value="04:00">4:00</option>
                  <option value="05:00">5:00</option>
                  <option value="06:00">6:00</option>
                  <option value="07:00">7:00</option>
                  <option value="08:00">8:00</option>
                  <option value="09:00">9:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </select>
              </label>
            </div>
            <div className="mb-2">
              <label className="block text-xxs font-bold">
                場所
                <input
                  type="text"
                  className="w-full h-8 p-2 border rounded text-gray-700 text-xs outline-none"
                  value={meetingPlace}
                  onChange={(e) => setMeetingPlace(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-xxs font-bold">
                説明
                <textarea
                  className="w-full h-12 p-2 border rounded text-gray-700 text-xxs outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            </div>
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={handleUpdateEvent}
                className="flex items-center p-2 border-none rounded bg-blue-700 text-xxs text-white h-6"
              >
                更新
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center p-2 border-none rounded bg-gray-400 text-xxs text-white h-6"
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
                  className="flex items-center p-4 border-none rounded bg-blue-500 text-xxs text-white h-6"
                  onClick={startChat}
                >
                  <ChatIcon className="mr-1" style={{ fontSize: '16px' }} />
                  チャット
                </button>
              </div>
            )}
          </div>
        )}
        {!isEditing && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="flex items-center p-2 border-none rounded bg-gray-400 text-xxs text-white h-6"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
    </div>
  );
}
