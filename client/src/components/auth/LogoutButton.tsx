'use client';

import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Logout() {
  const { logout } = useAuth();
  return (
    <div>
      <button className="cursor-pointer" onClick={logout} type="button">
        Logout
      </button>
    </div>
  );
}
