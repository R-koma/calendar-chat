'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import { User } from '@/types/User';
import api from '@/utils/api';

type FriendsContextType = {
  friends: User[];
  setFriends: React.Dispatch<React.SetStateAction<User[]>>;
  fetchFriends: () => Promise<void>;
};

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export function FriendsProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = async () => {
    try {
      const response = await api.get<User[]>('/user/friends');
      setFriends(response.data);
    } catch (err) {
      setError('友達の取得に失敗しました');
    }
  };

  useEffect(() => {
    fetchFriends().catch(() => {
      setError('友達の取得に失敗しました');
    });
  }, []);

  const value = useMemo(
    () => ({ friends, setFriends, fetchFriends }),
    [friends],
  );

  return (
    <FriendsContext.Provider value={value}>
      {children}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </FriendsContext.Provider>
  );
}

export const useFriends = (): FriendsContextType => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};
