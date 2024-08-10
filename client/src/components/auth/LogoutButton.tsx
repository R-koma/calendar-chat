'use client';

import { useAuth } from '@/hooks/useAuth';
import React from 'react';

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
