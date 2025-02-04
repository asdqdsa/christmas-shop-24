import Store from './store';
import View from './view';

export default class App {
  constructor(store, view) {
    this.store = store;
    this.view = view;
    this.rightClickSound = new Audio('sounds/b6.mp3');
    this.leftClickSound = new Audio('sounds/a6.mp3');
    this.piano = new Audio('sounds/g6.mp3');
    this.win = new Audio('sounds/win.mp3');

    this.onGameBoardClick = this.onGameBoardClick.bind(this);
    this.onGameResetClick = this.onGameResetClick.bind(this);
    this.onGamePresetClick = this.onGamePresetClick.bind(this);
    this.onDifficultyClick = this.onDifficultyClick.bind(this);
    this.onClueClick = this.onClueClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onContinueClick = this.onContinueClick.bind(this);
    this.onMuteSoundClick = this.onMuteSoundClick.bind(this);

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
      win: ({ formatedTime, isCompleted, isSoundOn }) => {
        this.view.updateTimer({ formatedTime, isCompleted });
        this.view.showNotification(formatedTime);
        if (isSoundOn) {
          this.win.load();
          this.win.play();
        }
      },
      onContinueGame: ({ preset }) => {
        this.view.renderBoardLayout(preset.length);
        this.view.updateBoardLayout({ preset });
      },
      onTimerTick: ({ formatedTime }) => {
        this.view.updateTimer({ formatedTime });
      },
      onTimerClear: () => {
        this.view.clearTimer();
      },
      onRestart: () => {
        this.view.updateStartView();
      },
      onSave: ({ isSaveExist }) => {
        this.view.updateStartView({ isSaveExist });
      },
      onSoundOff: ({}) => {
        this.piano.load();
        this.piano.play();
      },
      onSoundOnRight: ({}) => {
        this.rightClickSound.load();
        this.rightClickSound.play();
      },
      onSoundOnLeft: ({}) => {
        this.leftClickSound.load();
        this.leftClickSound.play();
      },
      onVolume: ({ isVolumeOn }) => {
        console.log(isVolumeOn);
        this.view.updateVolume(isVolumeOn);
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
    this.view.bindMuteSound(this.onMuteSoundClick);
  }

  onGameBoardClick({ cellId, isLeftClick, isRightClick }) {
    console.log(cellId);
    this.store.updateBoardMask(cellId, { isLeftClick, isRightClick });
    this.store.calcScore();
    this.store.checkUserWin();
    this.store.setTimer();
    if (isLeftClick) {
      // this.sounda6.load();

      // this.sounda6.play().catch((err) => {
      //   console.log(err);
      // });
      console.log('LeftClick');
    }
    if (isRightClick) {
      // this.soundb6.load();
      // this.soundb6.play();
      // console.log('RightClick');
    }
  }

  onDifficultyClick(difficultyId) {
    console.log(difficultyId);
    this.store.setDifficulty(difficultyId);
  }

  onGamePresetClick(presetLayoutId) {
    console.log(presetLayoutId);
    this.store.setPreset();
    this.store.startGame({ presetLayoutId });
    this.store.restartGame(presetLayoutId);
    // this.store.setTimer();
  }

  onGameResetClick() {
    // this.store.resetGame();
    this.store.restartGame();
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

  onMuteSoundClick() {
    console.log('mute');
    this.store.setVolume();
  }

  initStateListening() {
    this.store.addEventListener('state:changed', ({ detail }) => {
      const { state, changed, payload } = detail;
      Object.keys(changed).forEach((key) => {
        if (changed[key] && this.viewUpdateMap[key]) {
          if (payload) {
            this.viewUpdateMap[key](payload);
          } else {
            this.viewUpdateMap[key](state[key]);
          }
        }
      });
    });
  }

  init() {
    this.initStateListening();
    this.store.initStore();
    this.bindUIEvents();
    try {
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
