'use client';

import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/useAuth';

export default function LogoutButton() {
  const { logout } = useAuth();
  return (
    <div>
      <button
        className="cursor-pointer"
        onClick={logout}
        type="button"
        aria-label="Logout"
      >
        <LogoutIcon fontSize="small" />
      </button>
    </div>
  );
}
