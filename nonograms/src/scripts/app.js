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
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onContinueClick = this.onContinueClick.bind(this);

    this.viewUpdateMap = {
      init: ({ difficulty, isSaveExist }) => {
        this.view.mount({ difficulty });
        this.view.initView({ isSaveExist });
      },
      score: (score) => {
        this.view.updateScore(score);
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
        this.view.updateStartView();
      },
      end: ({ time, preset }) => {
        this.view.renderBoardLayout(preset.length);
        this.view.revealGamePreset({ preset });
      },
      win: ({ time }) => {
        this.view.renderEndScreen({ time });
        this.view.updateScoreBoard({ time });
      },
      onContinueGame: ({ preset }) => {
        this.view.renderBoardLayout(preset.length);
        this.view.updateBoardLayout({ preset });
      },
    };
  }

  bindUIEvents() {
    this.view.bindGameBoard(this.onGameBoardClick);
    this.view.bindGameReset(this.onGameResetClick);
    this.view.bindGameDifficulty(this.onDifficultyClick);
    this.view.bindGamePresetType(this.onGamePresetClick);
    this.view.bindGameClue(this.onClueClick);
    this.view.bindGameSave(this.onSaveClick);
    this.view.bindSaveLoad(this.onContinueClick);
  }

  onGameBoardClick({ cellId, isLeftClick, isRightClick }) {
    console.log(cellId);
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

  onGamePresetClick(presetLayoutId) {
    console.log(presetLayoutId);
    this.store.startGame({ presetLayoutId });
  }

  onGameResetClick(evt) {
    this.store.resetGame();
  }

  onClueClick() {
    console.log('show clue');
    this.store.getClue();
  }

  onSaveClick() {
    console.log('save game');
    this.store.gameSaveByUser();
  }

  onContinueClick() {
    console.log('save load');
    this.store.gameLoadByUser();
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
    try {
      this.initStateListening();
      this.store.initStore();
      this.bindUIEvents();
    } catch (error) {
      console.error(new Error(error));
    }
  }
}

const data = { key: 'nonogram-key' };
const store = new Store(data.key);
const view = new View();
const app = new App(store, view);

app.init();
