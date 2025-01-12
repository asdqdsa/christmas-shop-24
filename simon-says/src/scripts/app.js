import Store from './store';
import View from './view';

class App {
  constructor() {
    this.view = new View();
    this.store = new Store();
  }

  init() {
    this.view.renderUI();

    const onDifficultyClick = (evt) => {
      if (evt.target.classList.contains('difficulty')) {
        this.store.difficultyState = evt.target.id.trim();
        this.view.updateDifficulty(this.store.difficultyState);
        this.view.renderLayout(this.store.difficultyState);
      }
    };

    const onStartOrResetClick = (evt) => {
      console.log('start or reset', evt.target);
      if (this.store.currentRound !== 0) {
        this.store.reset();
        this.view.bindGameDifficultyEvent(onDifficultyClick);
        this.view.updateHelpBtn(
          this.store.currentRound,
          this.store.hint,
          this.store.isCorrect,
        );
      } else {
        this.store.newRound();
        this.view.unBindGameDifficultyEvent(onDifficultyClick);
      }

      this.view.udpateStartBtn(this.store.currentRound);
      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.hint,
        this.store.isCorrect,
      );
    };

    this.view.bindGameDifficultyEvent(onDifficultyClick);
    this.view.bindRepeatSequenceEvent((evt) => {});

    this.view.bindStartOrResetGameEvent(onStartOrResetClick);
    this.view.bindVirtualKeyboardEvent((evt) => {
      if (evt.target.classList.contains('keycap')) {
        // console.log('press key on virt keyboard', evt.target);
      }
    });

    this.view.updateDifficulty(this.store.difficultyState);
  }
}

const app = new App();

app.init();
