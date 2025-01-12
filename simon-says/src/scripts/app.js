import Store from './store';
import View from './view';

class App {
  constructor() {
    this.view = new View();
    this.store = new Store();
  }

  init() {
    this.view.renderUI(this.store.state);
    console.log('render', this.store.state);

    const onDifficultyClick = (evt) => {
      if (evt.target.classList.contains('difficulty')) {
        this.store.difficultyState = evt.target.id;

        this.view.updateDifficulty(this.store.difficultyState);
        this.view.renderLayout(this.store.difficultyState);
      }
    };

    const onStartOrResetClick = (evt) => {
      console.log('start or reset', this.store.state);
      const currRound = this.store.currentRound;
      if (currRound === 0) {
        this.store.newRound();
        console.log('reset', this.store.state);

        this.view.unBindGameDifficultyEvent(onDifficultyClick);
        this.view.updateHelpBtn(
          this.store.currentRound,
          this.store.isHintAvailable,
          this.store.isCorrect,
        );

        this.view.updateRoundInfo(this.store.currentRound);
      }

      if (currRound !== 0) {
        this.store.reset();
        console.log(this.store.currentRound, 'onStart');

        this.view.bindGameDifficultyEvent(onDifficultyClick);
        this.view.updateHelpBtn(
          this.store.currentRound,
          this.store.isHintAvailable,
          this.store.isCorrect,
        );

        this.view.updateRoundInfo(this.store.currentRound);
      }

      this.view.udpateStartBtn(this.store.currentRound);
    };

    const onRepeatOrNextClick = (evt) => {
      console.log('repeat or next', this.store.state);

      if (this.store.isCorrect) this.store.nextRound();
      else if (!this.store.isCorrect && this.store.isHintAvailable) {
        this.store.useHint();
      }

      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        this.store.isCorrect,
      );

      this.view.updateRoundInfo(this.store.currentRound);
    };

    const onVirtualKeybordClick = (evt) => {
      if (evt.target.classList.contains('keycap')) {
        console.log('press key on virt keyboard', evt.target);
        console.log('state', this.store.state);

        this.store.addUserSequents(evt.target.id);
        const sequentsPassed = this.store.checkUserSequence(
          evt.target.id,
          this.store.gameSequence,
          this.store.currentRound,
        );

        this.store.isCorrect = sequentsPassed;
        const currRound = this.store.currentRound;
        if (
          this.store.isCorrect &&
          this.store.gameSequence[currRound - 1].length === 0
        ) {
          // this.store.nextRound();
          // this.view.updateRoundInfo(this.store.currentRound);
          this.view.updateHelpBtn(
            this.store.currentRound,
            this.store.isHintAvailable,
            this.store.isCorrect,
          );
        }
      }
      setTimeout(() => {
        this.view.bindVirtualKeyboardEvent(onVirtualKeybordClick);
      }, 200);
    };

    const onKeyboardPress = (evt) => {
      const codeKey = evt.key.toUpperCase().charCodeAt(0);
      let isKeyPressed = true;
      // 48 .. 57 nums
      // 65 .. 90 ABC
      // 97 .. 122 abc
      if (
        (48 <= codeKey && codeKey <= 57) ||
        (65 <= codeKey && codeKey <= 90 && evt.key.length === 1)
      ) {
        console.log(true, evt.key, codeKey);
      }
      this.view.highlightKey(codeKey);
      setTimeout(() => {
        this.view.bindKeyboardEvent(onKeyboardPress);
        this.view.bindVirtualKeyboardEvent(onVirtualKeybordClick);
        !isKeyPressed;
        1;
      }, 200);
    };

    this.view.bindGameDifficultyEvent(onDifficultyClick);
    this.view.bindRepeatSequenceEvent(onRepeatOrNextClick);
    this.view.bindStartOrResetGameEvent(onStartOrResetClick);
    this.view.bindVirtualKeyboardEvent(onVirtualKeybordClick);
    this.view.bindKeyboardEvent(onKeyboardPress);
    this.view.updateDifficulty(this.store.difficultyState);
  }
}

const app = new App();

app.init();
