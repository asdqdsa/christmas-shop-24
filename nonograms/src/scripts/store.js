import {
  cross,
  cat,
  amogus,
  heart,
  yinyang,
  smily,
  six,
  tetris,
  chicken,
  thething,
  dino,
  hourglass,
  clippy,
  floppy,
  cup,
} from './presets';
const initialState = {
  score: 0,
  timer: 0,
  isComplete: false,
};

const gameState = {
  difficulty: ['easy', 'normal', 'hard'],
  volume: true,
  theme: 'dark',
  presets: {
    easy: {
      amogus,
      cat,
      smily,
      six,
      tetris,
    },
    normal: { heart, chicken, clippy, floppy, cup },
    hard: { cross, yinyang, thething, dino, hourglass },
  },
  savedGames: {
    // user: {},
  },
  user: {
    id: 'user',
    score: 0,
    difficulty: 'easy',
    preselectedPreset: 'preset-amogus',
    currPressetName: '',
    currPreset: amogus,
    isCompleted: false,
    history: [],
    gameStarted: false,
    gameEnded: null,
    date: null,
    seconds: 0,
    timer: '00:00',
    mask: [[0]],
    hints: { row: [[]], col: [[]] },
    winCondition: 0,
    isSessionSaved: false,
  },
};

export default class Store extends EventTarget {
  #state;

  constructor(key) {
    super();
    this.storageKey = key;
    this.#state = gameState;
  }

  get state() {
    const currStateItem = window.localStorage.getItem(this.storageKey);
    return currStateItem ? JSON.parse(currStateItem) : this.#state;
    // return this.#state;
  }

  /**
   * @param {string} difficulty - Game difficulty
   */
  setDifficulty(difficulty) {
    const currDif = difficulty.trim().toLocaleLowerCase();
    const presets = this.#state.presets[currDif];
    this.#state.user.difficulty = currDif;
    const stateClone = structuredClone(this.#state);
    this.#saveState(
      stateClone,
      { difficulty: true },
      {
        difficulty: currDif,
        presets: presets,
      },
    );
  }

  initStore() {
    this.#state.user.gameStarted = !this.#state.user.gameStarted;
    const state = this.state;
    if (this.state.user.isSessionSaved) {
      this.#state.isSessionSaved = this.state.user.isSessionSaved;
    }
    const stateClone = structuredClone(state);
    console.log(state, this.state.user.isSessionSaved, 'INIT STORE');
    this.#saveState(
      stateClone,
      { init: true },
      {
        difficulty: this.#state.difficulty,
        isSaveExist: this.state.user.isSessionSaved,
      },
    );

    this.#storeDispatcher({
      state,
      changeInfo: { difficulty: true },
      payload: {
        difficulty: this.#state.user.difficulty,
        presets: this.#state.presets[this.#state.user.difficulty],
      },
    });

    this.startGame({ presetLayoutId: null });
  }

  startGame({ presetLayoutId }) {
    if (presetLayoutId == null) {
      presetLayoutId = this.#state.user.preselectedPreset;
    }

    console.log(presetLayoutId, 'FJSDLOIKDFJoliDSJLI:F');
    const difficulty = this.#state.user.difficulty;
    console.log(presetLayoutId, difficulty, 'CURRPRESSETG');
    this.#setUserPreset({ presetLayoutId, difficulty });
    console.log(this.#state.user);
    const len = this.#state.user.currPreset.length;
    this.#setMask(len);
    this.#setHints();
    this.#setWinCondition();
    this.#resetTimer();
    const stateClone = structuredClone(this.#state);
    this.#saveState(
      stateClone,
      { start: true },
      {
        hints: this.#state.user.hints,
        boardSize: len,
      },
    );

    console.log('Starting game');
  }

  #resetTimer() {
    this.#clearTimer(this.#state.user.timerId);
    // clearInterval(this.#state.user.timerId);
    // this.#state.user.gameStarted = !this.#state.user.gameStarted;
    this.#state.user.gameStarted = false;
  }

  calcScore() {
    const mask = this.#state.user.mask;
    const preset = this.#state.user.currPreset;

    let currScore = 0;
    for (let i = 0; i < mask.length; i += 1) {
      for (let j = 0; j < mask[i].length; j += 1) {
        if (mask[i][j] === 1 && preset[i][j] === 1) currScore += 1;
        if (mask[i][j] === 1 && preset[i][j] === 0) currScore -= 1;
      }
    }
    this.#updateScore(currScore);

    const stateClone = structuredClone(this.#state);
    this.#saveState(stateClone, { score: true });

    console.log('calculating score on click', currScore);
  }

  checkUserWin() {
    const isWin = this.#state.user.winCondition === this.#state.user.score;
    if (isWin) {
      console.log('YOU WIN!');
      const formatedTime = this.#state.user.timer;
      const timeInSeconds = this.#state.user.seconds;
      this.#state.user.gameStarted = false;
      this.#state.user.isCompleted = true;
      this.#state.user.history.push(timeInSeconds);
      this.#state.user.history.sort((a, b) => a - b);
      console.log(this.#state.user.history);
      const stateClone = structuredClone(this.#state);
      this.#saveState(
        stateClone,
        { win: true },
        { formatedTime, isSoundOn: this.#state.volume },
      );

      this.resetGame();
    }
  }

  getClue() {
    const preset = this.#state.user.currPreset;
    clearInterval(this.#state.user.timerId);
    const stateClone = structuredClone(this.#state);
    this.#saveState(stateClone, { end: true }, { preset });
  }

  setVolume() {
    this.#state.volume = !this.#state.volume;
    this.#storeDispatcher({
      changeInfo: { onVolume: true },
      payload: { isVolumeOn: this.#state.volume },
    });
  }

  setPreset() {}

  toggleTheme() {
    if (this.#state.theme === 'dark') this.#state.theme = 'light';
    else this.#state.theme = 'dark';
    this.#storeDispatcher({
      changeInfo: { onSwitchTheme: true },
      payload: {
        themeType: this.#state.theme,
      },
    });
  }

  updateBoardMask(idCell, { isLeftClick, isRightClick }) {
    // row-col 0..len - 1
    const [row, col] = idCell.split('-');
    const mask = this.#state.user.mask;
    const cell = mask[row][col];
    let onSoundOff = false;
    let onSoundLeft = false;
    let onSoundRight = false;
    if (this.#state.volume) {
      onSoundOff = true;
      onSoundLeft = true;
      onSoundRight = true;
    }
    if (isLeftClick) {
      if (cell === 1) {
        mask[row][col] = 0;
        this.#storeDispatcher({
          changeInfo: { onSoundOff: onSoundOff },
        });
      } else {
        mask[row][col] = 1;
        this.#storeDispatcher({
          changeInfo: { onSoundOnLeft: onSoundLeft },
        });
      }
    }
    if (isRightClick) {
      if (cell === 0 || cell === 1) {
        mask[row][col] = -1;
        this.#storeDispatcher({
          changeInfo: { onSoundOnRight: onSoundRight },
        });
      } else {
        mask[row][col] = 0;

        this.#storeDispatcher({
          changeInfo: { onSoundOff: onSoundOff },
        });
      }
    }
    this.#state.user.mask = mask;
    const stateClone = structuredClone(this.#state);
    console.log('update mask', idCell, stateClone.user.mask);
    this.#saveState(
      stateClone,
      { cell: true },
      { id: idCell, mouseTypeClick: { isLeftClick, isRightClick } },
    );
  }

  setTimer() {
    console.log(!this.#state.user.gameStarted, !this.#state.user.isCompleted);
    if (!this.#state.user.gameStarted && !this.#state.user.isCompleted) {
      this.#state.user.gameStarted = true;
      let seconds = 0;
      this.#state.user.timerId = setInterval(() => {
        const formatedTime = this.#formatTimer(++seconds);
        // console.log(seconds, formatedTime);
        this.#state.user.seconds = seconds;
        this.#state.user.timer = formatedTime;
        const stateClone = structuredClone(this.#state);
        this.#storeDispatcher({
          changeInfo: { onTimerTick: true },
          payload: { formatedTime },
        });
      }, 1000);
    }
    console.log(this.#state.user.timerId);
    if (this.#state.user.isCompleted) {
      clearInterval(this.#state.user.timerId);
      console.log(
        this.#state.user.gameStarted,
        this.#state.user.isCompleted,
        'settiemr',
      );
      // this.#state.user.gameStarted = !this.#state.user.gameStarted;
      this.#state.user.isCompleted = !this.#state.user.isCompleted;
    }
  }

  #formatTimer(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  }

  gameSaveByUser() {
    const userGameProgress = this.state.user;
    userGameProgress.isSessionSaved = true;
    const userId = this.state.user.id;
    this.#state.savedGames[userId] = userGameProgress;
    this.state.savedGames[userId] = userGameProgress;
    this.#state.user.isSessionSaved = true;

    const stateClone = structuredClone(this.#state);
    this.#saveState(
      stateClone,
      { onSave: true },
      { isSaveExist: this.#state.user.isSessionSaved },
    );
  }

  gameLoadByUser() {
    const userId = 'user';
    const preset = this.state.savedGames[userId]?.mask;
    const hints = this.state.user.hints;
    const boardSize = preset.length;
    this.#state.user.mask = this.state.savedGames.user.mask;
    this.#state.user.score = this.state.savedGames.user.score;
    this.#storeDispatcher({
      changeInfo: { start: true, onContinueGame: true },
      payload: { preset, hints, boardSize },
    });
  }

  #setWinCondition() {
    const currPreset = this.#state.user.currPreset;
    const winCondition = currPreset.reduce((acc, val) => {
      const rowSumm = val.reduce((rowAcc, rowVal) => rowAcc + rowVal, 0);
      return acc + rowSumm;
    }, 0);
    this.#state.user.winCondition = winCondition;
  }

  #setUserPreset({ presetLayoutId, difficulty }) {
    const preset = presetLayoutId.split('-').at(-1);
    this.#state.user.currPressetName = presetLayoutId;
    this.#state.user.currPreset = this.#state.presets[difficulty][preset];
  }

  #setMask(len) {
    this.#state.user.mask = Array.from({ length: len }, () =>
      Array.from({ length: len }).fill(0),
    );
  }

  #setHints(preset = this.#state.user.currPreset) {
    const currPreset = preset;
    const rowHints = [];
    const colHints = [];
    let rowAcc = 0;
    let colAcc = 0;
    for (let i = 0; i < currPreset.length; i += 1) {
      rowHints[i] = [];
      colHints[i] = [];
      for (let j = 0; j < currPreset.length; j += 1) {
        if (currPreset[i][j] === 1) {
          rowAcc += 1;
          if (currPreset[i][j + 1] == null || currPreset[i][j + 1] === 0) {
            rowHints[i].push(rowAcc);
            rowAcc = 0;
          }
        }

        if (currPreset[j][i] === 1) {
          colAcc += 1;
          if (currPreset[j + 1] == null || currPreset[j + 1][i] === 0) {
            colHints[i].push(colAcc);

            colAcc = 0;
          }
        }
      }

      if (rowHints[i].length === 0) rowHints[i] = [0];
      if (colHints[i].length === 0) colHints[i] = [0];
    }

    this.#state.user.hints = {
      row: rowHints,
      col: colHints,
    };
  }

  #updateScore(score) {
    this.#state.user.score = score;
    const stateClone = structuredClone(this.#state);
    console.log('update score', stateClone.user);
    this.#saveState(stateClone, { score: true });
  }

  resetGame() {
    const stateClone = structuredClone(this.#state);
    console.log(stateClone.user);
    this.#state.user.isCompleted = true;
    this.#state.user.score = 0;
    this.#state.user.gameStarted = !this.#state.user.gameStarted;
    this.#saveState(
      stateClone,
      { reset: true },
      { time: this.#state.user.timer },
    );
  }

  #clearTimer(timerId) {
    clearInterval(timerId);
    this.#storeDispatcher({
      changeInfo: { onTimerClear: true },
    });
  }

  restartGame() {
    // console.log('presetLayoutId', presetLayoutId);
    this.#state.user.score = 0;
    // this.#state.user.gameStarted = !this.#state.user.gameStarted;
    this.#clearTimer(this.#state.user.timerId);
    // this.startGame({ presetLayoutId: this.#state.user.currPressetName });
    this.startGame({ presetLayoutId: this.#state.user.currPressetName });
    const stateClone = structuredClone(this.#state);
    this.#saveState(
      stateClone,
      { onRestart: true, start: true },
      {
        time: this.#state.user.timer,
        hints: this.#state.user.hints,
        boardSize: this.#state.user.currPreset.length,
      },
    );
  }

  #storeDispatcher({ state = null, changeInfo, payload = {} }) {
    this.dispatchEvent(
      new CustomEvent('state:changed', {
        detail: {
          state,
          changed: changeInfo,
          payload,
        },
      }),
    );
  }

  /**
   *
   * @param {Object} state
   * @param {Object} changeInfo
   * @param {null | Object} payload
   */
  #saveState(state, changeInfo, payload = {}) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(state));
    this.#storeDispatcher({ state, changeInfo, payload });
  }
}
