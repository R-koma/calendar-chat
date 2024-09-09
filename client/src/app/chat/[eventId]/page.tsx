'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import io from 'socket.io-client';
import useFetchUser from '@/hooks/useFetchUser';
import api from '@/utils/api';
import { EventDetail, Message } from '@/types/Event';
import { useRouter } from 'next/navigation';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001', {
  withCredentials: true,
});

export default function ChatPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const hasJoinedRoom = useRef(false);
  const { user } = useFetchUser();
  const currentUser = user?.username;
  const router = useRouter();

  let lastDate: string = '';

  const formatTimeToJST = (timestamp: string) => {
    const date = new Date(timestamp);

    return new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Tokyo',
    }).format(date);
  };

  const formatDateToJST = (timestamp: string) => {
    const date = new Date(timestamp);

    return new Intl.DateTimeFormat('ja-JP', {
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Tokyo',
    }).format(date);
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (eventId) {
          const response = await api.get<EventDetail>(
            `/event/${eventId}/detail`,
          );
          setEventDetail(response.data);
          if (response.data.messages) {
            setMessages(response.data.messages);
          }
        }
      } catch (err) {
        setError('イベント詳細の取得に失敗しました');
      }
    };

    fetchEventDetails().catch(() => {
      setError('イベント詳細の取得に失敗しました');
    });

    if (eventId && !hasJoinedRoom.current) {
      socket.off('receive_message');
      socket.emit('join_event_chat', { event_id: eventId });
      hasJoinedRoom.current = true;

      socket.on('receive_message', (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }

    return () => {
      if (hasJoinedRoom.current) {
        socket.off('receive_message');
        socket.emit('leave_room', { event_id: eventId });
        hasJoinedRoom.current = false;
      }
    };
  }, [eventId]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (message && eventId) {
      socket.emit('send_message', { event_id: eventId, message });
      setMessage('');
    }
  };

  const handleReturnToCalendar = () => {
    if (hasJoinedRoom.current) {
      socket.emit('leave_room', { event_id: eventId });
      hasJoinedRoom.current = false;
    }
    router.push('/protected/calendar');
  };

  if (!eventDetail) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-gray-100 p-4 ">
        <h2 className="text-lg font-bold mb-4">
          イベント: {eventDetail.event_name}
        </h2>
        <p>
          <strong>日付:</strong> {eventDetail.meeting_time}
        </p>
        <p>
          <strong>時間:</strong> {eventDetail.meeting_time}
        </p>
        <p>
          <strong>場所:</strong> {eventDetail.meeting_place}
        </p>
        <p>
          <strong>説明:</strong> {eventDetail.description}
        </p>
        <h3 className="font-bold mt-4">参加者</h3>
        <ul>
          {eventDetail.participants.map((participant) => {
            return <li key={participant.id}>{participant.username}</li>;
          })}
        </ul>
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-gray-500 text-white rounded p-1 my-4"
            onClick={handleReturnToCalendar}
          >
            戻る
          </button>
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="w-2/3 bg-white p-4">
        <div className="h-5/6 overflow-y-auto mb-4">
          {messages.map((msg, index) => {
            const currentDate = new Date(msg.timestamp).toLocaleDateString();

            const showDate = lastDate !== currentDate;
            lastDate = currentDate;
            return (
              <div key={msg.id || `message-${index}`} className="mb-2">
                {showDate && (
                  <div className="text-center text-gray-500 mb-2">
                    {formatDateToJST(msg.timestamp)}
                  </div>
                )}
                {msg.user === currentUser ? (
                  <div className="flex justify-end items-center ">
                    <div className="mr-1 text-xxs text-gray-500 relative top-1">
                      {formatTimeToJST(msg.timestamp)}
                    </div>
                    <div className="bg-slate-500 rounded-xl mr-2 p-2">
                      {msg.message}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start items-center">
                    <div className="mr-2 text-gray-700 font-bold">
                      {msg.user}
                    </div>
                    <div className="bg-slate-500 rounded-xl mr-1 p-2">
                      {msg.message}
                    </div>
                    <div className="text-xxs text-gray-500 relative top-1">
                      {formatTimeToJST(msg.timestamp)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <form className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow border border-gray-400 rounded p-2"
            placeholder="メッセージを入力"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white rounded p-2"
            onClick={handleSendMessage}
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
}
