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

// Scroll to Top
const scrollUpArrow = document.querySelector('#scroll-up');
scrollUpArrow.addEventListener('click', handleScrollToTop);

function handleScrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollUpArrow.classList.remove('scroll-up-arrow_inactive');
  } else scrollUpArrow.classList.add('scroll-up-arrow_inactive');
});

// TODO Slider

// TODO Menu

// TODO JSON Modal

// TODO Tabs

// TODO Random Cards
