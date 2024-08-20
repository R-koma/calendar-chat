export type UseModalReturnType = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMenu: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};
