import { useState, useEffect } from 'react';
import api from '../utils/api';

type UserResponse = {
  username: string;
  email: string;
};

const useFetchUser = () => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(
    null,
  );
  const [error, setError] = useState('');

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await api.get<UserResponse>('/auth/user');
      setUser(response.data);
    } catch (err) {
      setError('ユーザー情報の取得に失敗しました。');
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        await fetchUser();
      } catch (err) {
        setError('Failed to load user.');
      }
    };

    // awaitでloadUserを呼び出す
    loadUser().catch(() => {
      setError('Failed to load user.');
    });
  }, []);

  return {
    user,
    error,
  };
};

export default useFetchUser;
