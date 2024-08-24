import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LogoutButton from '../auth/LogoutButton';

type MenuProps = {
  user: { username: string };
  menuOpen: boolean;
  toggleMenu: () => void;
  openModal: () => void;
  friendListOpen: boolean;
  toggleFriendList: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
  openSearchModal: () => void;
};

export default function CalendarMenu({
  user,
  menuOpen,
  toggleMenu,
  openModal,
  friendListOpen,
  toggleFriendList,
  menuRef,
  openSearchModal,
}: MenuProps) {
  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 w-56 h-full bg-gray-800 text-white transform ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center p-2">
        <CloseIcon
          fontSize="small"
          className="mr-4 cursor-pointer"
          onClick={toggleMenu}
        />
        <div className="font-bold cursor-pointer">CC</div>
      </div>
      <button
        type="button"
        className="flex items-center ml-1 p-1 text-xxs bg-gray-700 border rounded-full"
        onClick={openModal}
      >
        <AddIcon className="icon-extra-small" />
        イベント作成
      </button>

      <div>
        <div
          className="flex items-center px-2 pt-2 cursor-pointer"
          onClick={toggleFriendList}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleFriendList();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="text-xxs mr-2">友達リスト</div>
          {friendListOpen ? (
            <ArrowDropUpIcon
              onClick={toggleFriendList}
              fontSize="small"
              className="cursor-pointer"
            />
          ) : (
            <ArrowDropDownIcon
              onClick={toggleFriendList}
              fontSize="small"
              className="cursor-pointer"
            />
          )}
        </div>
        {friendListOpen && (
          <div className="px-2">
            <div className="flex items-center p-1">
              <input
                type="text"
                className="flex-grow p-1 bg-gray-700 rounded-sm text-xxs h-4"
                placeholder="名前を検索"
              />
            </div>
            <div className="flex items-center p-1 w-full cursor-pointer">
              <div className="text-xxs w-6 h-6 flex items-center justify-center border border-gray-500 rounded-full mr-2">
                T
              </div>
              <div className="text-xxs">タナカ</div>
            </div>
            <div className="flex items-center p-1 w-full cursor-pointer">
              <div className="cursor-pointer text-xxs w-6 h-6 flex items-center justify-center border border-gray-500 rounded-full mr-2">
                M
              </div>
              <div className="text-xxs">マイケル</div>
            </div>
            <div className="flex items-center p-1 w-full cursor-pointer">
              <div className="cursor-pointer text-xxs w-6 h-6 flex items-center justify-center border border-gray-500 rounded-full mr-2">
                J
              </div>
              <div className="text-xxs">ジョン</div>
            </div>
            <div className="flex items-center p-1 w-full cursor-pointer">
              <div className="cursor-pointer text-xxs w-6 h-6 flex items-center justify-center border border-gray-500 rounded-full mr-2">
                N
              </div>
              <div className="text-xxs">ニーナ</div>
            </div>
          </div>
        )}
      </div>
      <div
        className="flex items-center p-2 cursor-pointer"
        onClick={openSearchModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            openSearchModal();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <AddIcon fontSize="small" />
        <div className="text-xxs">友達を追加</div>
      </div>
      <div className="flex items-center justify-between p-2 absolute bottom-0 w-full">
        <div className="flex items-center">
          <div className="cursor-pointer text-xxs w-6 h-6 flex items-center justify-center border border-gray-500 rounded-full mr-2">
            {user.username.charAt(0)}
          </div>
          <div className="text-xxs">{user.username}</div>
        </div>
        <div className="mx-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
