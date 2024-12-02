// Timer
const page = document.querySelector('.page');
const days = document.querySelector('#days');
const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');

const FINISH_TIME_COUNTDOWN_ISO = Date.UTC(2025, 0, 1, 0, 0, 0);

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
