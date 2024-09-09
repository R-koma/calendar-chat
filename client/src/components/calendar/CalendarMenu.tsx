'use client';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import api from '@/utils/api';
import { User } from '@/types/User';
import { useFriends } from '@/contexts/FriendsContext';
import { useEffect, useState } from 'react';
import { EventInvite } from '@/types/Event';
import LogoutButton from '../auth/LogoutButton';
import FriendRequests from './FriendRequest';

type MenuProps = {
  user: { username: string };
  menuOpen: boolean;
  toggleMenu: () => void;
  openModal: () => void;
  friendListOpen: boolean;
  toggleFriendList: () => void;
  friendRequestOpen: boolean;
  toggleFriendRequest: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
  openSearchModal: () => void;
  openEventDetailModal: (event: EventInvite, showChatButton: boolean) => void;
  fetchEvents: () => void;
};

type EventResponse = {
  event_name: string;
  event_date: string;
};

export default function CalendarMenu({
  user,
  menuOpen,
  toggleMenu,
  openModal,
  friendListOpen,
  toggleFriendList,
  friendRequestOpen,
  toggleFriendRequest,
  menuRef,
  openSearchModal,
  openEventDetailModal,
  fetchEvents,
}: MenuProps) {
  const { friends, setFriends } = useFriends();

  const [eventInvites, setEventInvites] = useState<EventInvite[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventInvites = async () => {
      try {
        const response = await api.get<EventInvite[]>('/user/event-invites');
        setEventInvites(response.data);
      } catch (err) {
        setError('イベント招待の取得に失敗しました');
      }
    };
    fetchEventInvites().catch(() => {
      setError('イベント招待の取得に失敗しました');
    });
  }, []);

  const handleRespondToInvite = async (eventId: number, response: string) => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrf_access_token='))
        ?.split('=')[1];

      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      const res = await api.post<EventResponse>(
        '/event/respond',
        { event_id: eventId, response },
        { headers: { 'X-CSRF-TOKEN': csrfToken } },
      );

      if (response === 'accepted' && res.status === 200) {
        fetchEvents();
      }

      setEventInvites((prevInvites) =>
        prevInvites.filter((invite) => invite.id !== eventId),
      );
    } catch (err) {
      console.error('参加に失敗しました', err);
      setError('イベントへの参加/不参加の処理に失敗しました');
    }
  };

  const addFriend = (newFriend: User) => {
    setFriends((prevFriends) => {
      if (!prevFriends.some((friend) => friend.id === newFriend.id)) {
        return [...prevFriends, newFriend];
      }
      return prevFriends;
    });
  };

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 w-56 h-full bg-gray-800 text-white transform ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center p-2">
        <CloseIcon
          fontSize="small"
          className="mr-4 cursor-pointer"
          onClick={toggleMenu}
        />
        <div className="font-bold cursor-pointer">CC</div>
      </div>
      <button
        type="button"
        className="flex items-center ml-1 p-1 text-xxs bg-gray-700 border rounded-full"
        onClick={openModal}
      >
        <AddIcon className="icon-extra-small" />
        イベント作成
      </button>
      <div className="p-2">
        <div className="text-xxs font-bold mb-4">イベント招待リスト</div>
        {eventInvites.length > 0 ? (
          eventInvites.map((invite) => (
            <div
              key={invite.id}
              className="mb-2 flex items-center justify-between"
            >
              <button
                type="button"
                className="text-xxs font-bold cursor-pointer"
                onClick={() => openEventDetailModal(invite, false)}
              >
                {invite.event_name}
              </button>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleRespondToInvite(invite.id, 'accepted')}
                  className="text-xxs text-green-500"
                >
                  参加
                </button>
                <button
                  type="button"
                  onClick={() => handleRespondToInvite(invite.id, 'declined')}
                  className="text-xxs text-red-500"
                >
                  不参加
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xxs text-gray-400">招待がありません</div>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="p-2">
        <div
          className="flex items-center px-2 pt-2 cursor-pointer"
          onClick={toggleFriendList}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleFriendList();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="text-xxs mr-2">友達リスト</div>
          {friendListOpen ? (
            <ArrowDropUpIcon
              onClick={toggleFriendList}
              fontSize="small"
              className="cursor-pointer"
            />
          ) : (
            <ArrowDropDownIcon
              onClick={toggleFriendList}
              fontSize="small"
              className="cursor-pointer"
            />
          )}
        </div>
        {friendListOpen && (
          <div className="px-2">
            {friends.map((friend) =>
              friend ? (
                <div
                  key={friend.id}
                  className="flex items-center p-1 w-full cursor-pointer"
                >
                  <div className="text-xxs w-6 h-6 flex items-center justify-center border border-gray-500 rounded-full mr-2">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xxs">{friend.username}</div>
                </div>
              ) : (
                <div
                  key={Math.random()}
                  className="flex items-center p-1 w-full cursor-pointer"
                >
                  <div className="text-xxs w-6 h-6 flex items-center justify-center border border-gray-500 rounded-full mr-2">
                    U
                  </div>
                  <div className="text-xxs">Unknown Friend</div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
      <div className="p-2">
        <div
          className="flex items-center px-2 pt-2  mb-2 cursor-pointer"
          onClick={toggleFriendRequest}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleFriendRequest();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="text-xxs mr-2">フレンドリクエスト</div>
          {friendRequestOpen ? (
            <ArrowDropUpIcon
              onClick={toggleFriendRequest}
              fontSize="small"
              className="cursor-pointer"
            />
          ) : (
            <ArrowDropDownIcon
              onClick={toggleFriendRequest}
              fontSize="small"
              className="cursor-pointer"
            />
          )}
        </div>
        {friendRequestOpen && <FriendRequests addFriend={addFriend} />}
      </div>
      <div
        className="flex items-center p-2 cursor-pointer"
        onClick={openSearchModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            openSearchModal();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <AddIcon fontSize="small" />
        <div className="text-xxs">友達を追加</div>
      </div>
      <div className="flex items-center justify-between p-2 absolute bottom-0 w-full">
        <div className="flex items-center">
          <div className="cursor-pointer text-xxs w-6 h-6 flex items-center justify-center border border-gray-500 rounded-full mr-2">
            {user.username.charAt(0)}
          </div>
          <div className="text-xxs">{user?.username ?? 'Guest'}</div>
        </div>
        <div className="mx-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
