import {
  getMonthNames,
  getMonthStartEnd,
  getPrevMonthEndDate,
  getWeekdays,
} from '@/utils/dateUtils';

type DaysProps = {
  currentDate: Date;
};

export default function CalendarDays({ currentDate }: DaysProps) {
  const weekdays = getWeekdays();
  const monthNames = getMonthNames();
  const { startDate, endDate } = getMonthStartEnd(currentDate);

  const weekdayElements = weekdays.map((day) => (
    <div
      key={`weekday-${day}`}
      className="p-0 border border-gray-200 text-xs text-gray-400 text-center date-cell"
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
    (_, d) => (
      <div
        key={`day-${d + 1}`}
        className="p-4 border border-gray-200 text-xs text-gray-900 date-cell"
      >
        {d + 1 === 1 ? `${monthNames[currentDate.getMonth()]} ${d + 1}` : d + 1}
      </div>
    ),
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
          <div className="grid grid-cols-7">{weekdayElements}</div>
          <div className="grid grid-cols-7 h-full">
            {prevMonthElements}
            {currentMonthElements}
            {nextMonthElements}
          </div>
        </div>
      </div>
    </div>
  );
}
