'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '../utils/api';

export const useAuth = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.status === 200) {
        router.push('/protected/calendar');
      }
    } catch (err) {
      setError('メールアドレスまたはパスワードが間違っています。');
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        router.push('/auth/login');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          setError(
            'このメールアドレスまたはユーザー名は既に登録されています。',
          );
        } else {
          setError(
            `登録に失敗しました。ステータスコード: ${err.response?.status}`,
          );
        }
      } else {
        setError('エラーが発生しました。');
      }
    }
  };

  const logout = async () => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrf_access_token='))
        ?.split('=')[1];
      await api.post(
        '/auth/logout',
        {},
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
        },
      );
      router.push('/auth/login');
    } catch (err) {
      setError('ログアウトに失敗しました。');
    }
  };

  return {
    login,
    register,
    logout,
    error,
    setError,
  };
};
