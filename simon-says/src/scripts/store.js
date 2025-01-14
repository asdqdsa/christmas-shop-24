const initialValue = {
  gameSequence: [
    ['49', '50', '54'],
    ['49', '50', '54'],
    ['49', '50', '54'],
  ],
  gameSequenceReadable: [
    ['1', '2', '6'],
    ['1', '2', '6'],
    ['1', '2', '6'],
  ],
  currSequence: [],
  // gameRound: 0,
  // gameDifficulty: 'easy',
  gameOver: false,
  gameRounds: 5,
  user: {
    difficulty: 'easy',
    round: 0,
    sequence: [],
    history: '',
    isHintAvailable: true,
    isUserCorrect: true,
    hp: 2,
    isRoundPass: false,
    info: '',
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

  get userSequence() {
    return this.#state.user.sequence;
  }

  addUserSequence(value) {
    const list = this.#state.user.sequence;
    let history = this.#state.user.history;
    list.push(value);
    history = String.fromCharCode(value);
    this.#state.user.sequence = list;
    this.#state.user.history = history;
  }

  newRound() {
    this.reset();
    this.currentRound += 1;
  }

  reset() {
    this.#setRandomSequence(
      this.#state.gameRounds,
      this.#state.user.difficulty,
    );
    this.currentRound = 0;
    this.#state.user.sequence = [];
    this.isHintAvailable = true;
    this.isCorrect = null;
    this.#state.gameOver = false;
    this.#state.user.hp = 2;
    this.#state.user.isRoundPass = false;
    this.#state.user.history = '';
  }

  useHint() {
    this.#state.user.isHintAvailable = !this.#state.user.isHintAvailable;
    this.#state.user.sequence = [];
  }

  nextRound() {
    this.#state.user.round += 1;
    this.#state.user.isUserCorrect = null;
    this.#state.user.isRoundPass = false;
    // gameover check
    // user seq
    // this.#state.user.history += (this.#state.user.sequence.slice());
    this.#state.user.sequence = [];
    this.#state.user.isHintAvailable = true;
    this.#state.user.hp = 2;
  }

  calcHP(pass) {
    if (!pass) this.#state.user.hp -= 1;
    if (this.#state.user.hp === 0) {
      this.#state.gameOver = true;
    }
  }

  get isGameOver() {
    // this.reset()
    return this.#state.gameOver;
  }

  set gameOver(value) {
    this.#state.gameOver = value;
  }

  get gameSequence() {
    return this.#state.gameSequence;
  }

  checkUserSequence(userInput, isLastInputRight) {
    let userSequence = this.#state.user.sequence;
    const gameSequence = this.#state.gameSequence;
    const round = this.#state.user.round;

    this.#state.currSequence = gameSequence[round - 1].slice();
    const currRow = this.#state.currSequence;

    const expectedValue = currRow[userSequence.length - 1];

    if (expectedValue !== userInput) {
      return false;
    }
    if (currRow.length === userSequence.length) {
      this.state.user.isRoundPass = true;
      return true;
    }
    return true;
  }

  #setRandomSequence(len = 5, type = 'easy') {
    // [1, 2, 6]
    // 48 .. 57 nums
    // 65 .. 90 ABC
    // 97 .. 122 abc
    const dict = {
      easy: '1234567890',
      medium: 'QWERTYUIOPASDFGHJKLZXCVBNM',
      hard: '1234567890' + 'QWERTYUIOPASDFGHJKLZXCVBNM',
    };

    let start = 0;
    let end = dict[type].length;
    const randomNum = Math.floor(Math.random() * (end - start)) + start;
    const randomChar = dict[type][randomNum];
    const list = [];
    const listReadable = [];
    for (let i = 0; i < len; i += 1) {
      const row = [];
      const rowReadable = [];
      const rowLen = (i + 1) * 2;
      for (let j = 0; j < rowLen; j += 1) {
        const randomNum = Math.floor(Math.random() * (end - start)) + start;
        const randomChar = dict[type][randomNum];
        rowReadable.push(randomChar);
        row.push(randomChar.charCodeAt(0).toString());
      }
      listReadable.push(rowReadable);
      list.push(row);
    }

    // console.log(listReadable);
    this.#state.gameSequence = list;
    this.#state.gameSequenceReadable = listReadable;
  }
}
