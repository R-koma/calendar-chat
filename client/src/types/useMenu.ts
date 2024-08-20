export type UseMenuReturnType = {
  menuOpen: boolean;
  toggleMenu: () => void;
  friendListOpen: boolean;
  toggleFriendList: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
};
