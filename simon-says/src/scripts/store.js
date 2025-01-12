const initialValue = {
  gameSequence: [
    ['49', '50', '54'],
    ['49', '50', '54'],
    ['49', '50', '54'],
  ],
  // gameRound: 0,
  // gameDifficulty: 'easy',
  gameOver: false,
  user: {
    difficulty: 'easy',
    round: 0,
    sequents: [],
    history: [],
    isHintAvailable: true,
    isUserCorrect: false,
  },
};

export default class Store extends EventTarget {
  #state = initialValue;

  constructor() {
    super();
    this.#state = initialValue;
  }

  get state() {
    return this.#state;
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

  get isHintAvailable() {
    return this.#state.user.isHintAvailable;
  }
  set isHintAvailable(value) {
    this.#state.user.isHintAvailable = value;
  }

  get isCorrect() {
    return this.#state.user.isUserCorrect;
  }
  set isCorrect(value) {
    this.#state.user.isUserCorrect = value;
  }

  get userSequents() {
    return this.#state.user.sequents;
  }

  addUserSequents(value) {
    const list = this.#state.user.sequents;
    list.push(value);
  }

  newRound() {
    this.reset();
    this.currentRound += 1;
  }

  reset() {
    this.#setRandomSequence();
    this.currentRound = 0;
    this.#state.user.sequents = [];
    this.isHintAvailable = true;
    this.isCorrect = false;
  }

  useHint() {
    this.#state.user.isHintAvailable = !this.#state.user.isHintAvailable;
  }

  nextRound() {
    this.#state.user.round += 1;
    this.#state.user.isUserCorrect = false;
    // gameover check
  }

  get gameSequence() {
    return this.#state.gameSequence;
  }

  checkUserSequence(userSequents, gameSequence, round) {
    console.log(userSequents, gameSequence, 'arguments');

    if (userSequents !== gameSequence[round - 1].shift()) {
      console.log('comp', userSequents, gameSequence.shift());
      return false;
    }
    return true;
  }

  #setRandomSequence(len = 7, type = 'easy') {
    // [1, 2, 6]
    const sequence = [
      ['49', '50', '54'],
      ['49', '50', '54'],
      ['49', '50', '54'],
    ];
    this.#state.gameSequence = sequence;
  }
}
