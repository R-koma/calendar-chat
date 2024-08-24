'use client';

import React, { useState } from 'react';
import api from '@/utils/api';
import { User } from '@/types/User';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

type SearchUserProps = {
  closeSearchModal: () => void;
};

export default function SearchUser({ closeSearchModal }: SearchUserProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (query.trim() === '') return;

    try {
      const response = await api.get('/user/search', {
        params: { query },
      });
      setResults(response.data as User[]);
      setError(null);
    } catch (err) {
      setError('検索に失敗しました');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          className="w-full p-1 text-sm text-gray-700 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="ユーザー名かメールアドレスで検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className=" bg-blue-600 text-sm p-1 px-2 w-1/4  text-white  rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleSearch}
        >
          検索
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {results.map((user) => (
          <li
            key={user.id}
            className="flex justify-center px-4 py-2  cursor-pointer"
          >
            {/* TODO:アイコン追加 */}
            <PersonIcon className="mr-1" fontSize="small" />
            {user.username}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className=" bg-gray-700  text-xxs text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={closeSearchModal}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
