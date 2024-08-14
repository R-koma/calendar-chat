import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('RegisterForm', () => {
  let registerMock: jest.Mock;

  beforeEach(() => {
    registerMock = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      register: registerMock,
      error: '',
      setError: jest.fn(),
    });
  });

  it('should render the registration form', () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText('ユーザー名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument();
  });

  it('should call register on form submission', async () => {
    render(<RegisterForm />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('ユーザー名'), 'username');
    await user.type(
      screen.getByPlaceholderText('メールアドレス'),
      'test@example.com',
    );
    await user.type(screen.getByPlaceholderText('パスワード'), 'password');

    await user.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith(
        'username',
        'test@example.com',
        'password',
      );
    });
  });

  it('should display error message', () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      register: jest.fn(),
      error: 'エラーメッセージ',
      setError: jest.fn(),
    });

    render(<RegisterForm />);

    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument();
  });
});
