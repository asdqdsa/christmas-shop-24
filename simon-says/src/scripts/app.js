import View from './view';

class App {
  constructor() {
    this.view = new View();
  }

  init() {
    this.view.renderUI();

    this.view.bindGameDifficultyEvent((evt) => {
      if (evt.target.classList.contains('difficulty')) {
        console.log('set difficulty', evt.target);
      }
    });

    this.view.bindRepeatSequenceEvent((evt) => {
      console.log('repeat', evt.target);
    });

    this.view.bindStartOrResetGameEvent((evt) => {
      console.log('start or reset', evt.target);
    });

    this.view.bindVirtualKeyboardEvent((evt) => {
      if (evt.target.classList.contains('keycap')) {
        console.log('pressing keys on virt keyboard', evt.target);
      }
    });
  }
}

const app = new App();

app.init();
