import { dv, cat, amogus } from './presets';
const initialState = {
  score: 0,
  timer: 0,
  isComplete: false,
};

const gameState = {
  difficulty: ['easy', 'normal', 'hard'],
  presets: {
    yang: [],
    dove: [],
    dv: dv,
    cat: cat,
  },
  user: {
    score: 0,
    difficulty: 'easy',
    currPreset: amogus,
    moves: [],
    isCompleted: false,
    gameStarted: false,
    gameEnded: null,
    date: null,
    history: [],
    mask: [[0]],
    hints: { row: [[]], col: [[]] },
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
    this.#state.user.difficulty = currDif;
    const stateClone = structuredClone(this.#state);
    this.#saveState(stateClone, { difficulty: true });
  }

  startGame() {
    console.log(this.#state.presets);
    const len = 5;
    const infoChanged = { start: false };
    if (!this.#state.user.gameStarted) {
      this.#state.user.gameStarted = true;
      this.#state.user.mask = Array.from({ length: len }, () =>
        Array.from({ length: len }).fill(0),
      );
      this.setHints();
      infoChanged.start = true;
      console.log('Starting game');
    }

    // ADD TIMER
    console.log('Playing game');
    const stateClone = structuredClone(this.#state);
    this.#saveState(stateClone, infoChanged, { hints: this.#state.user.hints });
  }

  setHints(preset = this.#state.user.currPreset) {
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

      if (rowHints[i].length === 0) rowHints[i] = null;
      if (colHints[i].length === 0) colHints[i] = null;
    }

    this.#state.user.hints = {
      row: rowHints,
      col: colHints,
    };
  }

  updateScore(value) {
    this.#state.user.score += 1;
    const stateClone = structuredClone(this.#state);
    console.log('update score', stateClone.user);
    this.#saveState(stateClone, { score: true });
  }

  updateBoardMask(idCell, mouseBtnType) {
    // row-col 0..len - 1
    const [row, col] = idCell.split('-');
    const mask = this.#state.user.mask;
    const cell = mask[row][col];
    if (mouseBtnType === 0) {
      if (cell === 1) mask[row][col] = 0;
      else mask[row][col] = 1;
    }
    if (mouseBtnType === 2) {
      if (cell === 0 || cell === 1) mask[row][col] = -1;
      else mask[row][col] = 0;
    }
    this.#state.user.mask = mask;
    const stateClone = structuredClone(this.#state);
    console.log('update mask', idCell, stateClone.user.mask);
    this.#saveState(stateClone, { cell: true }, { id: idCell, mouseBtnType });
  }

  resetGame() {
    const stateClone = structuredClone(this.#state);
    console.log(stateClone.user);
    this.#state.user.isCompleted = true;
    this.#state.user.score = 0;
    this.#saveState(stateClone, { reset: true });
  }

  /**
   *
   * @param {Object} state
   * @param {Object} changeInfo
   * @param {null | Object} payload
   */
  #saveState(state, changeInfo, payload = null) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(state));
    this.dispatchEvent(
      new CustomEvent('state:changed', {
        detail: {
          state: this.#state.user,
          changed: changeInfo,
          payload,
        },
      }),
    );
  }
}
