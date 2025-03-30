import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datePicker = document.getElementById('datetime-picker');
const startButton = document.getElementById('start-btn');
const timerDisplay = document.getElementById('timer');

let userSelectedDate = null;
let countdownInterval = null;

// Параметри для Flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Помилка',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

// Ініціалізація Flatpickr
flatpickr(datePicker, options);

// Функція конвертації часу
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Додає нуль попереду, якщо число менше 10
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Оновлення таймера на сторінці
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  timerDisplay.textContent = `${addLeadingZero(days)}:${addLeadingZero(
    hours
  )}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
}

// Запуск таймера
function startCountdown() {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  datePicker.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeRemaining = userSelectedDate - now;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datePicker.disabled = false;
      iziToast.success({
        title: 'Готово!',
        message: 'Час вийшов!',
        position: 'topRight',
      });
      return;
    }

    const timeComponents = convertMs(timeRemaining);
    updateTimerDisplay(timeComponents);
  }, 1000);
}

// Додаємо обробник кліку на кнопку "Start"
startButton.addEventListener('click', startCountdown);
