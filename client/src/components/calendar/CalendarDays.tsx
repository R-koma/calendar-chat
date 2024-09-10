'use client';

import api from '@/utils/api';
import {
  getMonthNames,
  getMonthStartEnd,
  getPrevMonthEndDate,
  getWeekdays,
} from '@/utils/dateUtils';
import { useEffect, useState } from 'react';
import { CalendarEvent } from '@/types/Event';

type DaysProps = {
  currentDate: Date;
  openEventDetailModal: (
    event: CalendarEvent,
    showChatButton: boolean,
    showAddFriendsButton: boolean,
  ) => void;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
};

export default function CalendarDays({
  currentDate,
  openEventDetailModal,
  events,
  setEvents,
}: DaysProps) {
  const weekdays = getWeekdays();
  const monthNames = getMonthNames();
  const { startDate, endDate } = getMonthStartEnd(currentDate);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get<CalendarEvent[]>(
          '/event/user/participated-events',
          {
            params: {
              month: currentDate.getMonth() + 1,
              year: currentDate.getFullYear(),
            },
          },
        );
        setEvents(response.data);
      } catch (err) {
        setError('イベントの取得に失敗しました');
      }
    };

    fetchEvents().catch(() => {
      setError('イベントの取得に失敗しました');
    });
  }, [currentDate, setEvents]);

  const renderEvents = (date: Date) => {
    const eventsForDate = events.filter(
      (e) => new Date(e.event_date).getDate() === date.getDate(),
    );

    return eventsForDate.length > 0 ? (
      <div className="h-full pl-2 overflow-y-auto overflow-x-hidden relative">
        <div className="max-h-full">
          {eventsForDate.map((event) => (
            <button
              key={event.id}
              type="button"
              className="w-full text-gray-800 text-xxxs text-left mb-2 pl-1 p-0.1 
              bg-blue-400 rounded-sm whitespace-nowrap block overflow-hidden text-ellipsis"
              style={{ maxWidth: '100px' }}
              onClick={() => openEventDetailModal(event, true, true)}
            >
              {event.event_name}
            </button>
          ))}
        </div>
      </div>
    ) : null;
  };

  const weekdayElements = weekdays.map((day, index) => (
    <div
      key={`weekday-${day}`}
      className={`p-0 border border-gray-200 text-xs text-center date-cell ${
        index === 6
          ? 'text-blue-500'
          : index === 0
            ? 'text-red-500'
            : 'text-gray-400'
      }`}
    >
      {day}
    </div>
  ));

  const prevMonthEndDate = getPrevMonthEndDate(currentDate);
  const prevMonthDays = startDate.getDay();

  const prevMonthElements = Array.from({ length: prevMonthDays }).map(
    (_, i) => (
      <div
        key={`prev-month-day-${prevMonthEndDate.getDate() - (prevMonthDays - 1 - i)}`}
        className="p-4 border border-gray-200  text-gray-400 date-cell"
      >
        {prevMonthEndDate.getDate() - (prevMonthDays - 1 - i)}
      </div>
    ),
  );

  const currentMonthElements = Array.from({ length: endDate.getDate() }).map(
    (_, d) => {
      const currentDateDisplay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        d + 1,
      );
      const isToday =
        currentDateDisplay.toDateString() === new Date().toDateString();

      const dayOfWeek = currentDateDisplay.getDay();
      return (
        <div
          key={`day-${d + 1}`}
          className={`p-0 border border-gray-200 text-xs text-center cursor-pointer overflow-hidden flex flex-col ${
            dayOfWeek === 0
              ? 'text-red-500'
              : dayOfWeek === 6
                ? 'text-blue-500'
                : 'text-gray-900'
          }
            ${isToday ? 'bg-blue-300' : ''}`}
          style={{ height: '95px' }}
        >
          <div className="flex-none px-2 py-1">
            {d + 1 === 1
              ? `${monthNames[currentDate.getMonth()]} ${d + 1}`
              : d + 1}
          </div>
          <div className="flex-1 h-full w-full overflow-hidden">
            {renderEvents(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                d + 1,
              ),
            )}
          </div>
        </div>
      );
    },
  );

  const totalDays = prevMonthDays + endDate.getDate();

  const nextMonthDays = (7 - (totalDays % 7)) % 7;
  const nextMonthElements = Array.from({ length: nextMonthDays }).map(
    (_, nextMonthDay) => (
      <div
        key={`next-month-day-${nextMonthDay + 1}`}
        className="p-4 border border-gray-200 text-xs text-gray-400 date-cell"
      >
        {nextMonthDay + 1 === 1
          ? `${monthNames[(currentDate.getMonth() + 1) % 12]} ${nextMonthDay + 1}`
          : nextMonthDay + 1}
      </div>
    ),
  );

  return (
    <div className="calendar-content">
      <div className="text-gray-800 pt-0 w-full">
        <div className="h-full">
          <div className="grid grid-cols-7 gap-0">{weekdayElements}</div>
          <div className="grid grid-cols-7 h-full gap-0">
            {prevMonthElements}
            {currentMonthElements}
            {nextMonthElements}
          </div>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
