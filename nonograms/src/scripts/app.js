import Store from './store';
import View from './view';

export default class App {
  constructor(store, view) {
    this.store = store;
    this.view = view;

    this.viewUpdateMap = {
      score: (value) => {
        this.view.updateScore(value);
      },
      difficulty: (value) => {
        this.view.updateDifficulty(value);
      },
      cell: (value) => {
        this.view.updateCell(value.id);
      },
    };
  }
  bindEvents() {
    this.view.bindGameBoard(this.onGameBoardClick.bind(this));
    this.view.bindGameReset(this.onGameResetClick.bind(this));
  }

  onGameBoardClick(evt) {
    this.store.startGame();
    this.store.updateScore(1);
    this.store.updateBoardMask(evt.target.id);
  }

  onGameResetClick(evt) {
    this.store.resetGame();
  }

  init() {
    this.view.mount();
    this.bindEvents();

    this.store.addEventListener('state:changed', (event) => {
      const { state, changed, payload } = event.detail;
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
}

const data = { key: 'nonogram-key' };
const store = new Store(data.key);
const view = new View();
const app = new App(store, view);

app.init();
