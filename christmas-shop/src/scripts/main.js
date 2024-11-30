console.log('main.js is set');

// Timer
const days = document.querySelector('#days');
const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');

const FINISH_TIME_COUNTDOWN_ISO = new Date(2025, 0, 1, 0, 0, 0);

function getTimeToDate(targetDate, configTimer) {
  const deltaNewYear = targetDate - Date.now();
  configTimer.daysDelta = Math.floor(deltaNewYear / (1000 * 60 * 60 * 24));
  let timeDeltaMs = deltaNewYear % (1000 * 60 * 60 * 24);
  configTimer.hoursDelta = Math.floor(timeDeltaMs / (1000 * 60 * 60));
  timeDeltaMs %= 1000 * 60 * 60;
  configTimer.minutesDelta = Math.floor(timeDeltaMs / (1000 * 60));
  timeDeltaMs %= 1000 * 60;
  configTimer.secondsDelta = Math.floor(timeDeltaMs / 1000);
  configTimer.msDelta = timeDeltaMs % 1000;
  return configTimer;
}

const idTimerTick = setInterval(
  updateLayoutTimer,
  1000,
  FINISH_TIME_COUNTDOWN_ISO,
);

function updateLayoutTimer(targetDate) {
  const getData = getTimeToDate(targetDate, {});
  days.textContent = getData.daysDelta;
  hours.textContent = getData.hoursDelta;
  minutes.textContent = getData.minutesDelta;
  seconds.textContent = getData.secondsDelta;
}

// TODO Slider

// TODO JSON Modal
const modalTemplateContent = document.querySelector('#modal').content;
const modal = modalTemplateContent.querySelector('.modal').cloneNode(true);
const page = document.querySelector('.page');

function openModal() {
  page.appendChild(modal);
  page.classList.toggle('scroll-disable');
}

// openModal();

const scrollDis = () => page.classList.add('scroll-disable');
// scrollDis();

// TODO Tabs

// TODO Random Cards
// console.log(getEventListeners(window));
