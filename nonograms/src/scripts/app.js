import Store from './store';
import View from './view';

export default class App {
  constructor(store, view) {
    this.store = store;
    this.view = view;

    this.onGameBoardClick = this.onGameBoardClick.bind(this);
    this.onGameResetClick = this.onGameResetClick.bind(this);
    this.onGamePresetClick = this.onGamePresetClick.bind(this);
    this.onDifficultyClick = this.onDifficultyClick.bind(this);
    this.onClueClick = this.onClueClick.bind(this);

    this.viewUpdateMap = {
      score: (value) => {
        this.view.updateScore(value);
      },
      difficulty: ({ difficulty, presets }) => {
        this.view.updateDifficulty({ difficulty, presets });
      },
      cell: ({ id, mouseTypeClick }) => {
        this.view.updateCell(id, mouseTypeClick);
      },
      start: ({ hints, boardSize }) => {
        this.view.updateHints(hints);
        this.view.renderBoardLayout(boardSize);
      },
      end: ({ time, preset }) => {
        this.view.renderBoardLayout(preset.length);
        this.view.renderPresetOnBoard({ preset });
      },
      win: ({ time }) => {
        this.view.renderEndScreen({ time });
        this.view.updateScoreBoard({ time });
      },
    };
  }

  bindUIEvents() {
    this.view.bindGameBoard(this.onGameBoardClick);
    this.view.bindGameReset(this.onGameResetClick);
    this.view.bindGameDifficulty(this.onDifficultyClick);
    this.view.bindGamePresetType(this.onGamePresetClick);
    this.view.bindGameClue(this.onClueClick);
  }

  onGameBoardClick({ cellId, isLeftClick, isRightClick }) {
    this.store.updateBoardMask(cellId, { isLeftClick, isRightClick });
    this.store.calcScore();
    this.store.checkUserWin();
    if (isLeftClick) console.log('LeftClick');
    if (isRightClick) console.log('RightClick');
  }

  onDifficultyClick(difficultyId) {
    console.log(difficultyId);
    this.store.setDifficulty(difficultyId);
  }

  onGamePresetClick(presetId) {
    console.log(presetId);
    this.store.startGame({ presetId });
  }

  onGameResetClick(evt) {
    this.store.resetGame();
  }

  onClueClick() {
    console.log('jfdslk');
    this.store.getClue();
  }

  initStateListening() {
    this.store.addEventListener('state:changed', ({ detail }) => {
      const { state, changed, payload } = detail;
      Object.keys(changed).forEach((key) => {
        if (changed[key] && this.viewUpdateMap[key]) {
          if (payload) {
            console.log(payload);
            this.viewUpdateMap[key](payload);
          } else {
            this.viewUpdateMap[key](state[key]);
          }
        }
      });
    });
  }

  init() {
    this.view.mount(this.store.state.difficulty);
    this.bindUIEvents();
    this.initStateListening();
  }
}

const data = { key: 'nonogram-key' };
const store = new Store(data.key);
const view = new View();
const app = new App(store, view);

app.init();
