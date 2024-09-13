import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFriends } from '@/contexts/FriendsContext';
import { useEventForm } from '@/hooks/useEventForm';
import { User } from '@/types/User';
import api from '@/utils/api';
import InviteFriendsModal from './InviteFriendsModal';

type ModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
  isInviteModalOpen: boolean;
  setInviteModalOpen: (isOpen: boolean) => void;
  fetchEvents: () => void;
};

export default function CalendarEventCreateForm({
  isModalOpen,
  closeModal,
  selectedDate,
  handleDateChange,
  isInviteModalOpen,
  setInviteModalOpen,
  fetchEvents,
}: ModalProps) {
  const {
    eventName,
    setEventName,
    meetingTime,
    setMeetingTime,
    meetingPlace,
    setMeetingPlace,
    description,
    setDescription,
    invitedFriends,
    setInvitedFriends,
    error,
    setError,
  } = useEventForm();

  const { friends } = useFriends();

  const handleOpenInviteModal = () => setInviteModalOpen(true);

  const handleInviteFriends = (selectedFriends: User[]) => {
    setInvitedFriends(selectedFriends);
    setInviteModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrf_access_token='))
        ?.split('=')[1];

      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      await api.post(
        '/event/create',
        {
          event_name: eventName,
          event_date: selectedDate,
          meeting_time: meetingTime,
          meeting_place: meetingPlace,
          description,
          invitees: invitedFriends.map((friend) => friend.id),
        },
        { headers: { 'X-CSRF-TOKEN': csrfToken } },
      );
      setEventName('');
      handleDateChange(null);
      setMeetingTime('');
      setMeetingPlace('');
      setDescription('');
      setInvitedFriends([]);

      fetchEvents();
      closeModal();
    } catch (err) {
      setError('イベントの作成に失敗しました');
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
        isModalOpen ? '' : 'hidden'
      }`}
    >
      <div className="bg-gray-800 p-6 rounded shadow-lg w-96 relative">
        <CloseIcon
          className="absolute top-2 right-2 icon-extra-small cursor-pointer"
          onClick={closeModal}
        />
        <h2 className="text-lg text-center mb-4 font-bold">イベント作成</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              イベント名
              <input
                type="text"
                className="w-full h-8 p-2 border rounded text-gray-700 text-xs outline-none"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
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
                className="w-full h-8 p-2 border rounded text-gray-700 text-xxs outline-none"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              時間
              <select
                className="w-full h-8 p-2 border rounded text-gray-700 text-xs outline-none"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              >
                <option value="" />
                <option value="未定">未定</option>
                <option value="00:00">0:00</option>
                <option value="01:00">1:00</option>
                <option value="02:00">2:00</option>
                <option value="03:00">3:00</option>
                <option value="04:00">4:00</option>
                <option value="05:00">5:00</option>
                <option value="06:00">6:00</option>
                <option value="07:00">7:00</option>
                <option value="08:00">8:00</option>
                <option value="09:00">9:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
                <option value="19:00">19:00</option>
                <option value="20:00">20:00</option>
                <option value="21:00">21:00</option>
                <option value="22:00">22:00</option>
                <option value="23:00">23:00</option>
              </select>
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              場所
              <input
                type="text"
                className="w-full h-8 p-2 border rounded text-gray-700 text-xs outline-none"
                value={meetingPlace}
                onChange={(e) => setMeetingPlace(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-xxs font-bold">
              説明
              <textarea
                className="w-full h-12 p-2 border rounded text-gray-700 text-xxs outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-2">
            <button
              type="button"
              className="flex items-center text-blue-500 text-xxs font-bold"
              onClick={handleOpenInviteModal}
            >
              <AddIcon className="icon-extra-small" />
              友達を招待
            </button>
            <ul className="mt-2">
              {invitedFriends.map((friend) => (
                <li key={friend.id} className="text-xxs">
                  {friend.username}
                </li>
              ))}
            </ul>
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
        <InviteFriendsModal
          isOpen={isInviteModalOpen}
          closeModal={() => setInviteModalOpen(false)}
          friends={friends}
          onInvite={handleInviteFriends}
          alreadyInvitedFriends={[]}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
