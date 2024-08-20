'use client';

import { useState } from 'react';
import { UseMenuOpenReturnType } from '../types/useMenuOpen';

const useMenuOpen = (): UseMenuOpenReturnType => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return {
    menuOpen,
    setMenuOpen,
    toggleMenu,
  };
};

export default useMenuOpen;
