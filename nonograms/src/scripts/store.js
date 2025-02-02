import { dv, cat, amogus, normal } from './presets';
const initialState = {
  score: 0,
  timer: 0,
  isComplete: false,
};

const gameState = {
  difficulty: ['easy', 'normal', 'hard'],
  presets: {
    easy: {
      amogus,
      cat,
      // yang: [],
      // dove: [],
    },
    normal: { normal },
    hard: { dv },
  },
  savedGames: {
    // user: {},
  },
  user: {
    id: 'user',
    score: 0,
    difficulty: 'easy',
    preselectedPreset: 'preset-amogus',
    currPreset: amogus,
    moves: [],
    isCompleted: false,
    gameStarted: false,
    gameEnded: null,
    date: null,
    history: [],
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
    const state = this.state;
    const stateClone = structuredClone(state);
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

    this.startGame({ resetLayoutId: null });
  }

  startGame({ presetLayoutId }) {
    if (!this.#state.user.gameStarted) {
      this.#state.user.gameStarted = true;
    }
    if (presetLayoutId == null) {
      presetLayoutId = this.#state.user.preselectedPreset;
    }

    const difficulty = this.#state.user.difficulty;
    this.#setUserPreset({ presetLayoutId, difficulty });
    // console.log('this.#state.user.currPreset.lengt', )
    const len = this.#state.user.currPreset.length;
    this.#setMask(len);
    this.#setHints();
    this.#setWinCondition();
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
      const time = this.#state.user.date;
      const stateClone = structuredClone(this.#state);
      this.#saveState(stateClone, { win: true }, { time });

      this.resetGame();
    }
  }

  getClue() {
    const preset = this.#state.user.currPreset;

    const stateClone = structuredClone(this.#state);
    this.#saveState(stateClone, { end: true }, { preset });
  }

  updateBoardMask(idCell, { isLeftClick, isRightClick }) {
    // row-col 0..len - 1
    const [row, col] = idCell.split('-');
    const mask = this.#state.user.mask;
    const cell = mask[row][col];
    if (isLeftClick) {
      if (cell === 1) mask[row][col] = 0;
      else mask[row][col] = 1;
    }
    if (isRightClick) {
      if (cell === 0 || cell === 1) mask[row][col] = -1;
      else mask[row][col] = 0;
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

  gameSaveByUser() {
    const userGameProgress = this.state.user;
    userGameProgress.isSessionSaved = true;
    const userId = this.state.user.id;
    this.#state.savedGames[userId] = userGameProgress;
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
    console.log(difficulty, preset, ' HHEHE');
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
    this.#saveState(stateClone, { reset: true });
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
