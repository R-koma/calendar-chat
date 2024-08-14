import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('LoginForm', () => {
  let loginMock: jest.Mock;
  let setErrorMock: jest.Mock;

  beforeEach(() => {
    loginMock = jest.fn();
    setErrorMock = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      login: loginMock,
      error: '',
      setError: setErrorMock,
    });
  });

  it('should render the login form', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument();
  });

  it('should call login on form submission', async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText('メールアドレス'),
      'test@example.com',
    );
    await user.type(screen.getByPlaceholderText('パスワード'), 'password');
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });

  it('should display error message', () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      login: jest.fn(),
      error: 'ログインエラーメッセージ',
      setError: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByText('ログインエラーメッセージ')).toBeInTheDocument();
  });
});
