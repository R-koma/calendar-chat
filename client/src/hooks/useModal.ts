'use client';

import { useState } from 'react';
import { UseModalReturnType } from '@/types/useModal';
import useMenuOpen from './useMenuOpen';

const useModal = (): UseModalReturnType => {
  const { menuOpen, setMenuOpen, toggleMenu } = useMenuOpen();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    menuOpen,
    setMenuOpen,
    toggleMenu,
    isModalOpen,
    openModal,
    closeModal,
  };
};

export default useModal;
