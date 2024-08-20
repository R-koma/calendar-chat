import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type ModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
};

export default function CalendarEventCreateForm({
  isModalOpen,
  closeModal,
  selectedDate,
  handleDateChange,
}: ModalProps) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${isModalOpen ? '' : 'hidden'}`}
    >
      <div className="bg-gray-800 p-6 rounded shadow-lg w-96 relative">
        <CloseIcon
          className="absolute top-2 right-2 icon-extra-small cursor-pointer"
          onClick={closeModal}
        />
        <h2 className="text-lg text-center mb-4 font-bold">イベント作成</h2>
        <form>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              イベント名
              <input
                type="text"
                className="w-full h-5 p-2 border rounded text-gray-700 text-xs outline-none"
              />
            </label>
          </div>
          <div className="mb-2">
            <div className="block text-xxs font-bold">
              日付
              <DatePicker
                id="date-picker"
                selected={selectedDate}
                onChange={handleDateChange}
                className="w-full h-5 p-2 border rounded text-gray-700 text-xxs outline-none"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              集合時間
              <input
                type="text"
                className="w-full h-5 p-2 border rounded text-gray-700 text-xs outline-none"
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              集合場所
              <input
                type="text"
                className="w-full h-5 p-2 border rounded text-gray-700 text-xs outline-none"
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              説明
              <textarea className="w-full h-12 p-2 border rounded text-gray-700 text-xxs outline-none"></textarea>
            </label>
          </div>
          <div className="mb-2">
            <button
              type="button"
              className="flex items-center text-blue-500 text-xxs font-bold"
            >
              <AddIcon className="icon-extra-small" />
              メンバーを招待
            </button>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center mr-2 p-2 border-none rounded bg-gray-400 text-xxs h-6"
              onClick={closeModal}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex items-center p-2 border-none rounded bg-blue-500 text-xxs text-white h-6"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
