export const getMonthStartEnd = (currentDate: Date) => {
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  return { startDate, endDate };
};

export const getPrevMonthEndDate = (currentDate: Date) => {
  return new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
};

export const getWeekdays = () => [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
];

export const getMonthNames = () => [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
