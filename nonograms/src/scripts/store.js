const initialState = {
  score: 0,
  timer: 0,
  isComplete: false,
};

export default class Store extends EventTarget {
  #state;

  constructor(key) {
    super();
    this.storageKey = key;
    this.#state = initialState;
  }

  get state() {
    const currStateItem = window.localStorage.getItem(this.storageKey);
    return currStateItem ? JSON.parse(currStateItem) : this.#state;
    // return this.#state;
  }

  updateScore(value) {
    console.log(this.state.score);
    this.#state.score += 1;
    // this.state.score += 1;
    console.log(this.state.score);
    const stateClone = structuredClone(this.#state);
    console.log('update score', value, stateClone);
    this.#saveState(stateClone);
  }

  resetGame() {
    const stateClone = structuredClone(this.#state);
    console.log(stateClone);
    this.#state.isComplete = true;
    this.#state.score = 0;
    this.#saveState(stateClone);
  }

  #saveState(state) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(state));
    this.dispatchEvent(
      new CustomEvent('state:changed', {
        detail: {
          state: this.#state,
          changed: { score: true },
        },
      }),
    );
  }
}
