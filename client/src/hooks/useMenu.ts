'use client';

import { useEffect, useRef, useState } from 'react';
import { UseMenuReturnType } from '../types/useMenu';
import useMenuOpen from './useMenuOpen';

const useMenu = (): UseMenuReturnType => {
  const { menuOpen, setMenuOpen, toggleMenu } = useMenuOpen();
  const [friendListOpen, setFriendListOpen] = useState(true);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleFriendList = () => {
    setFriendListOpen(!friendListOpen);
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
    menuRef,
  };
};

export default useMenu;
