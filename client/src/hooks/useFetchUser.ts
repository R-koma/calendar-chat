import { useState, useEffect } from 'react';
import api from '../utils/api';

type UserResponse = {
  id: number;
  username: string;
  email: string;
};

const useFetchUser = () => {
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await api.get<UserResponse>('/auth/user');
      setUser(response.data);
    } catch (err) {
      setError('ユーザー情報の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser().catch(() => {
      setError('Failed to load user');
    });
  }, []);

  return {
    user,
    error,
    loading,
  };
};

export default useFetchUser;
