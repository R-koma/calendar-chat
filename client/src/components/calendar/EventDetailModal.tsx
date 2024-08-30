'use client';

import CloseIcon from '@mui/icons-material/Close';
import { EventDetail } from '@/types/Event';
import { useEffect, useState } from 'react';
import api from '@/utils/api';

type EventDetailModalProps = {
  event: EventDetail;
  onClose: () => void;
};

export default function EventDetailModal({
  event,
  onClose,
}: EventDetailModalProps) {
  const [participants, setParticipants] = useState(event.participants);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get<EventDetail>(
          `/event/${event.id}/detail`,
        );
        setParticipants(response.data.participants);
      } catch (err) {
        setError('イベントの詳細の取得に失敗しました');
      }
    };

    fetchEventDetails().catch(() => {
      setError('イベントの詳細の取得に失敗しました');
    });
  }, [event.id]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-96 relative">
        <CloseIcon
          className="absolute top-2 right-2 icon-extra-small cursor-pointer"
          onClick={onClose}
        />
        <h2 className="text-lg text-center mb-4 font-bold">イベント詳細</h2>
        <div className="mb-2">
          <div className="text-xxs font-bold">イベント名</div>
          <div className="text-xs text-gray-300">{event.event_name}</div>
        </div>
        <div className="mb-2">
          <div className="text-xxs font-bold">日付</div>
          <div className="text-xs text-gray-300">
            {new Date(event.event_date).toLocaleDateString()}
          </div>
        </div>
        <div className="mb-2">
          <div className="text-xxs font-bold">集合時間</div>
          <div className="text-xs text-gray-300">{event.meeting_time}</div>
        </div>
        <div className="mb-2">
          <div className="text-xxs font-bold">集合場所</div>
          <div className="text-xs text-gray-300">{event.meeting_place}</div>
        </div>
        <div className="mb-2">
          <div className="text-xxs font-bold">説明</div>
          <div className="text-xs text-gray-300">{event.description}</div>
        </div>
        <div className="mb-2">
          <div className="text-xxs font-bold">参加者</div>
          <ul className="text-xs text-gray-300">
            {participants.length > 0 ? (
              participants.map((participant) => (
                <li key={participant.id}>{participant.username}</li>
              ))
            ) : (
              <li>参加者がいません</li>
            )}
          </ul>
        </div>
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
