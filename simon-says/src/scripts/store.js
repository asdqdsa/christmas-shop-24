const initialValue = {
  gameSequence: '',
  // gameRound: 0,
  // gameDifficulty: 'easy',
  gameOver: false,
  user: {
    difficulty: 'easy',
    round: 0,
    sequence: [],
    history: [],
    hint: true,
    isCorrect: false,
  },
};

export default class Store extends EventTarget {
  #state = initialValue;

  constructor() {
    super();
    this.#state = initialValue;
  }

  get difficultyState() {
    this.dispatchEvent(new Event('difficulty:change'));
    return this.#state.user.difficulty;
  }

  set difficultyState(value) {
    this.#state.user.difficulty = value;
  }

  get currentRound() {
    return this.#state.user.round;
  }

  set currentRound(value) {
    this.#state.user.round = value;
  }

  get hint() {
    return this.#state.user.hint;
  }
  set hint(value) {
    this.#state.user.hint = !!value;
  }

  get isCorrect() {
    return this.#state.user.isCorrect;
  }
  set isCorrect(value) {
    this.#state.user.isCorrect = !!value;
  }

  newRound() {
    this.reset();
    this.currentRound += 1;
  }

  reset() {
    this.#setRandomSequence();
    this.currentRound = 0;
  }

  playerMove() {}

  #setRandomSequence(len = 7, type = 'easy') {
    const sequence = '126';
    this.#state.gameSequence = sequence;
  }
}
