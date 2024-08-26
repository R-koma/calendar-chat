'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';

type FriendRequest = {
  id: number;
  sender_id: number;
  sender_username: string;
};

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await api.get<FriendRequest[]>('/friend/requests');
      setRequests(response.data);
    };
    fetchRequests().catch(() => setError('リクエストの取得に失敗しました'));
  }, []);

  const handleRespond = async (requestId: number, action: string) => {
    try {
      await api.post(`/friend/request/${requestId}/respond`, { action });
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (err) {
      setError('処理に失敗しました');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xxs">リクエストがあればここに表示される。</div>
      <ul className="space-y-2">
        {requests.map((req) => (
          <li
            key={req.id}
            className="flex justify-between items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm"
          >
            <span>{req.sender_username}</span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => handleRespond(req.id, 'accept')}
                className="bg-green-600 text-white text-sm py-1 px-3 rounded-lg hover:bg-green-500 focus:outline-none"
              >
                承認
              </button>
              <button
                type="button"
                onClick={() => handleRespond(req.id, 'reject')}
                className="bg-red-600 text-white text-sm py-1 px-3 rounded-lg hover:bg-red-500 focus:outline-none"
              >
                拒否
              </button>
            </div>
          </li>
        ))}
      </ul>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
