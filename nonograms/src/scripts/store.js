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
  },
  user: {
    score: 0,
    difficulty: 'easy',
    currPreset: [],
    moves: [],
    isCompleted: false,
    gameStarted: null,
    gameEnded: null,
    date: null,
    history: [],
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

  updateScore(value) {
    console.log(this.state.score);
    this.#state.user.score += 1;
    // this.state.score += 1;
    console.log(this.state.score);
    const stateClone = structuredClone(this.#state);
    console.log('update score', value, stateClone.user);
    this.#saveState(stateClone);
  }

  resetGame() {
    const stateClone = structuredClone(this.#state);
    console.log(stateClone.user);
    this.#state.user.isCompleted = true;
    this.#state.user.score = 0;
    this.#saveState(stateClone);
  }

  #saveState(state) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(state));
    this.dispatchEvent(
      new CustomEvent('state:changed', {
        detail: {
          state: this.#state.user,
          changed: { score: true },
        },
      }),
    );
  }
}
