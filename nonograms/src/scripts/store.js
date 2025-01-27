import { dv } from './presets';
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
    const len = 15;
    if (!this.#state.user.gameStarted) {
      this.#state.user.gameStarted = true;
      this.#state.user.mask = Array.from({ length: len }, () =>
        Array.from({ length: len }).fill(0),
      );
    }

    // ADD TIMER
    console.log('Starting game');
    const stateClone = structuredClone(this.#state);
    this.#saveState(stateClone, { start: true });
  }

  updateScore(value) {
    this.#state.user.score += 1;
    const stateClone = structuredClone(this.#state);
    console.log('update score', stateClone.user);
    this.#saveState(stateClone, { score: true });
  }

  updateBoardMask(idCell) {
    // row-col 0..len - 1
    const [row, col] = idCell.split('-');
    const mask = this.#state.user.mask;
    const cell = mask[row][col];
    if (cell === 1) mask[row][col] = 0;
    else mask[row][col] = 1;
    this.#state.user.mask = mask;
    const stateClone = structuredClone(this.#state);
    console.log('update mask', stateClone.user.mask);
    this.#saveState(stateClone, { cell: true }, { id: idCell });
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
