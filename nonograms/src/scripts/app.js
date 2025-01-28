import Store from './store';
import View from './view';

export default class App {
  constructor(store, view) {
    this.store = store;
    this.view = view;

    this.onGameBoardClick = this.onGameBoardClick.bind(this);
    this.onGameResetClick = this.onGameResetClick.bind(this);

    this.viewUpdateMap = {
      score: (value) => {
        this.view.updateScore(value);
      },
      difficulty: (value) => {
        this.view.updateDifficulty(value);
      },
      cell: ({ id, mouseBtnType }) => {
        this.view.updateCell(id, mouseBtnType);
      },
      start: ({ hints }) => {
        this.view.updateHints(hints);
      },
    };
  }

  bindUIEvents() {
    this.view.bindGameBoard(this.onGameBoardClick);
    this.view.bindGameReset(this.onGameResetClick);
  }

  onGameBoardClick(event) {
    const mouseBtnType = event.button;
    const cellId = event.target.id;
    this.store.startGame();
    if (mouseBtnType === 0) this.store.updateScore(1);
    console.log(cellId);
    if (mouseBtnType === 2) {
    }
    this.store.updateBoardMask(cellId, mouseBtnType);
  }

  onGameResetClick(evt) {
    this.store.resetGame();
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
    this.view.mount();
    this.bindUIEvents();
    this.initStateListening();
  }
}

const data = { key: 'nonogram-key' };
const store = new Store(data.key);
const view = new View();
const app = new App(store, view);

app.init();
