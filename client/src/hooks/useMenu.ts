'use client';

import { useEffect, useRef, useState } from 'react';
import useMenuOpen from './useMenuOpen';
import { UseMenuReturnType } from '../types/useMenu';

const useMenu = (): UseMenuReturnType => {
  const { menuOpen, setMenuOpen, toggleMenu } = useMenuOpen();
  const [friendListOpen, setFriendListOpen] = useState(true);
  const [friendRequestOpen, setFriendRequestOpen] = useState(true);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleFriendList = () => {
    setFriendListOpen(!friendListOpen);
  };
  const toggleFriendRequest = () => {
    setFriendRequestOpen(!friendRequestOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, setMenuOpen]);

  return {
    menuOpen,
    toggleMenu,
    friendListOpen,
    toggleFriendList,
    friendRequestOpen,
    toggleFriendRequest,
    menuRef,
  };
};

export default useMenu;
