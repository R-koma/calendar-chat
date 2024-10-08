import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogoutButton from './LogoutButton';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('LogoutButton', () => {
  it('should call logout when button is clicked', async () => {
    const logoutMock = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({ logout: logoutMock });

    const { getByRole } = render(<LogoutButton />);
    const button = getByRole('button', { name: /logout/i });

    const user = userEvent.setup();
    await user.click(button);

    expect(logoutMock).toHaveBeenCalled();
  });
});
