import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import api from '../utils/api';

jest.mock('../utils/api');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useAuth', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (api.post as jest.Mock).mockReset();
  });

  it('should login successfully', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(push).toHaveBeenCalledWith('/protected/calendar');
    expect(result.current.error).toBe('');
  });

  it('should handle login error', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error());

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'wrongpassword');
    });

    expect(result.current.error).toBe(
      'メールアドレスまたはパスワードが間違っています。',
    );
  });

  it('should register successfully', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ status: 201 });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('username', 'test@example.com', 'password');
    });

    expect(push).toHaveBeenCalledWith('/auth/login');
    expect(result.current.error).toBe('');
  });

  it('should handle register error', async () => {
    const errorResponse = {
      response: {
        status: 400,
      },
      isAxiosError: true,
    };
    (api.post as jest.Mock).mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('username', 'test@example.com', 'password');
    });

    expect(result.current.error).toBe(
      'このメールアドレスまたはユーザー名は既に登録されています。',
    );
  });

  it('should logout successfully', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(push).toHaveBeenCalledWith('/auth/login');
    expect(result.current.error).toBe('');
  });
});
