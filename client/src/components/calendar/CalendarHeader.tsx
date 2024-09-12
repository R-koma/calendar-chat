import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/hooks/useAuth';

type CalendarHeaderProps = {
  user: { username: string };
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
  toggleMenu: () => void;
};

export default function CalendarHeader({
  user,
  currentDate,
  setCurrentDate,
  view,
  setView,
  toggleMenu,
}: CalendarHeaderProps) {
  const { logout } = useAuth();
  return (
    <div className="flex justify-between items-center w-full h-10 bg-gray-800 px-4">
      <div className="flex items-center">
        <MenuIcon
          fontSize="small"
          className="mr-4 cursor-pointer"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        />
        <div className="font-bold cursor-pointer">CC</div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="flex items-center mx-2 px-2 py-1 border border-gray-500 rounded">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="text-blue-600 hover:text-blue-400 font-bold text-xxs bg-gray-800 p-0.5"
          >
            Today
          </button>
        </div>
        <div className="flex items-center">
          <ArrowBackIosIcon
            className="cursor-pointer mx-2"
            style={{ fontSize: '16px' }}
            onClick={() =>
              setCurrentDate(
                new Date(
                  new Date(currentDate).setMonth(currentDate.getMonth() - 1),
                ),
              )
            }
            aria-label="Previous Month"
          />
          <div className="cursor-pointer font-medium mx-2 text-xs">
            {currentDate.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
            })}
          </div>
          <ArrowForwardIosIcon
            className="cursor-pointer mx-2"
            style={{ fontSize: '16px' }}
            onClick={() =>
              setCurrentDate(
                new Date(
                  new Date(currentDate).setMonth(currentDate.getMonth() + 1),
                ),
              )
            }
            aria-label="Next Month"
          />
        </div>
      </div>
      <div className="flex items-center justify-end text-xs">
        <SearchIcon fontSize="small" className="mr-4 cursor-pointer" />
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="mr-4 text-xxs text-white cursor-pointer bg-gray-800 border border-gray-500 rounded px-2 py-1 outline-none"
        >
          {/* <option value="day">Day</option> */}
          {/* <option value="week">Week</option> */}
          <option value="month">Month</option>
          {/* <option value="year">Year</option> */}
        </select>
        <button
          onClick={logout}
          type="button"
          className="cursor-pointer text-xxs w-6 h-6 flex items-center justify-center border border-gray-500 rounded-full mr-2"
        >
          {user.username.charAt(0)}
        </button>
      </div>
    </div>
  );
}
