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
          // this.store.isCorrect,
          this.store.state.user.isRoundPass,
        );

        this.view.updateRoundInfo(this.store.currentRound);
        console.table(this.store.state.gameSequenceReadable);
        this.view.showSequence(
          this.store.state.gameSequence[this.store.currentRound - 1],
        );
        // unclock input
      }

      if (currRound !== 0) {
        this.store.reset();
        console.log(this.store.currentRound, 'onStart');

        this.view.bindGameDifficultyEvent(onDifficultyClick);
        this.view.updateHelpBtn(
          this.store.currentRound,
          this.store.isHintAvailable,
          // this.store.isCorrect,
          this.store.state.user.isRoundPass,
        );

        this.view.updateRoundInfo(this.store.currentRound);
      }

      this.view.udpateStartBtn(this.store.currentRound);
    };

    const onRepeatOrNextClick = (evt) => {
      console.log('repeat or next', this.store.state);

      // if (this.store.isCorrect) this.store.nextRound();
      if (this.store.state.user.isRoundPass) {
        this.store.nextRound();
        // lock input
        this.view.showSequence(
          this.store.state.gameSequence[this.store.currentRound - 1],
        );
        // unclock input
      } else if (
        !this.store.state.user.isRoundPass &&
        this.store.isHintAvailable
      ) {
        this.store.useHint();
        // lock input
        this.view.showSequence(
          this.store.state.gameSequence[this.store.currentRound - 1],
        );
        // unclock input
      }

      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        // this.store.isCorrect,
        this.store.state.user.isRoundPass,
      );

      this.view.updateRoundInfo(this.store.currentRound);
    };

    const onVirtualKeybordClick = (evt) => {
      if (evt.target.classList.contains('keycap')) {
        console.log('press key on virt keyboard', evt.target);
        console.log('state', this.store.state);

        this.store.addUserSequence(evt.target.id);

        const isInputPassed = this.store.checkUserSequence(
          evt.target.id,
          this.store.isCorrect,
        );

        // is user mistaken - correct -> false
        this.store.isCorrect = isInputPassed;
        // deduct hp - if mistaken
        this.store.calcHP(isInputPassed);
        // ends the game by store state
        if (this.store.isGameOver) console.log('GAME OVER!');

        // if HP > 0 and user round is ok
        if (this.store.state.user.isRoundPass && this.store.state.user.hp > 0) {
          // ready for the next round
          // this.store.state.user.isRoundPass = true;
          // nextRound()
          // TODO update HelpBtn
          this.view.updateHelpBtn(
            this.store.currentRound,
            this.store.isHintAvailable,
            this.store.state.user.isRoundPass,
          );
        }

        // if HP still > 0 and use is NOT correct, last try
        // check hint
        // make isCorrect back to False with nextRound() always
        // but make isCorrect -> true to pass the check for NEXT round mb?

        // if input is matched and length is matched
        if (
          isInputPassed &&
          this.store.userSequence.length ===
            // checking row.length by round - 1 as idx of randomSeq[[0][1][2]]
            // with user input that were pushed on click
            this.store.gameSequence[this.store.currentRound - 1].length &&
          this.store.currentRound === this.store.state.gameRounds
        ) {
          console.log(
            'YOU WIN!',
            this.store.gameSequence.length,
            this.store.state.gameRounds,
          );
          // store.showEnding();
          // update view
        }
        if (
          isInputPassed &&
          this.store.userSequence.length ===
            // checking row.length by round - 1 as idx of randomSeq[[0][1][2]]
            // with user input that were pushed on click
            this.store.gameSequence[this.store.currentRound - 1].length
        ) {
          console.log('round is clear');
          // this.store.nextRound();
          // don't really need to update round here mb
          // since we're just ittering through
          // this.view.updateRoundInfo(this.store.currentRound);

          // updating HelpBtn is kinda wrong here too
          this.view.updateHelpBtn(
            this.store.currentRound,
            this.store.isHintAvailable,
            // this.store.isCorrect,
            this.store.state.user.isRoundPass,
          );
        }
      }
      setTimeout(() => {
        this.view.bindVirtualKeyboardEvent(onVirtualKeybordClick);
      }, 200);
    };

    const onKeyboardPress = (evt) => {
      this.view.unBindVirtualKeyboardEvent(onVirtualKeybordClick);
      const codeKey = evt.key.toUpperCase().charCodeAt(0);
      let isKeyPressed = true;
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
