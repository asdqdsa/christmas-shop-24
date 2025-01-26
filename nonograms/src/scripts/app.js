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
    };
  }
  bindEvents() {
    this.view.bindGameBoard(this.onGameBoardClick.bind(this));
    this.view.bindGameReset(this.onGameResetClick.bind(this));
  }

  onGameBoardClick(evt) {
    // console.log(idCell.target.id);
    console.log(evt.target.id, '??');
    this.store.updateScore(1);
    this.view.updateCell(evt.target.id);
  }

  onGameResetClick(evt) {
    this.store.resetGame();
  }

  init() {
    this.view.mount();
    this.bindEvents();

    this.store.addEventListener('state:changed', (event) => {
      const { state, changed } = event.detail;
      Object.keys(changed).forEach((key) => {
        if (changed[key] && this.viewUpdateMap[key]) {
          this.viewUpdateMap[key](state[key]);
        }
      });
    });

    // this.store.saveState();
  }
}

const data = { key: 'nonogram-key' };
const store = new Store(data.key);
const view = new View();
const app = new App(store, view);

app.init();
