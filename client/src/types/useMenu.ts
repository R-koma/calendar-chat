export type UseMenuReturnType = {
  menuOpen: boolean;
  toggleMenu: () => void;
  friendListOpen: boolean;
  toggleFriendList: () => void;
  friendRequestOpen: boolean;
  toggleFriendRequest: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
};
