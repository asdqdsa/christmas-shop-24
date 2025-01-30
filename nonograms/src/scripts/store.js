import { dv, cat, amogus } from './presets';
const initialState = {
  score: 0,
  timer: 0,
  isComplete: false,
};

const gameState = {
  difficulty: ['easy', 'normal', 'hard'],
  presets: {
    // yang: [],
    // dove: [],
    dv: dv,
    cat: cat,
    amogus: amogus,
  },
  user: {
    score: 0,
    difficulty: 'easy',
    currPreset: [],
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
    const presets = this.#state.presets;
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

  startGame({ presetId }) {
    if (!this.#state.user.gameStarted) {
      this.#state.user.gameStarted = true;
    }
    this.#setPreset(presetId);
    const len = this.#state.user.currPreset.length;
    this.#setMask(len);
    this.#setHints();
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

  playGame() {
    console.log('Playing game');
  }

  #setPreset(presetId) {
    const preset = presetId.split('-').at(-1);
    this.#state.user.currPreset = this.#state.presets[preset];
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
