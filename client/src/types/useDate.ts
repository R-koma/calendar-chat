export type UseDateReturnType = {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
};
