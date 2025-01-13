import Store from './store';
import View from './view';

class App {
  constructor() {
    this.view = new View();
    this.store = new Store();
    this.onStartOrResetClick = this.onStartOrResetClick.bind(this);
    this.onDifficultyClick = this.onDifficultyClick.bind(this);
    this.onVirtualKeybordClick = this.onVirtualKeybordClick.bind(this);
    this.onKeyboardPress = this.onKeyboardPress.bind(this);
    this.onRepeatOrNextClick = this.onRepeatOrNextClick.bind(this);
  }
  onStartOrResetClick(evt) {
    console.log('start or reset', this.store.state);
    const currRound = this.store.currentRound;
    if (currRound === 0) {
      this.store.newRound();
      console.log('reset', this.store.state);

      this.view.unBindGameDifficultyEvent(this.onDifficultyClick);
      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        // this.store.isCorrect,
        this.store.state.user.isRoundPass,
      );

      this.view.updateRoundInfo(
        this.store.currentRound,
        this.store.state.gameRounds,
      );
      console.table(this.store.state.gameSequenceReadable);
      // lock buttons
      this.lockInput();
      this.view.showSequence(
        this.store.state.gameSequence[this.store.currentRound - 1],
      );
      this.view.addEventListener('showSequence:done', () => {
        this.unLockInput();
      });
      this.view.updateInfoGeneral('');
    }

    if (currRound !== 0) {
      this.store.reset();
      console.log(this.store.currentRound, 'onStart');

      this.view.bindGameDifficultyEvent(this.onDifficultyClick);
      this.view.updateHelpBtn(
        this.store.currentRound,
        this.store.isHintAvailable,
        // this.store.isCorrect,
        this.store.state.user.isRoundPass,
      );

      this.view.updateRoundInfo(
        this.store.currentRound,
        this.store.state.gameRounds,
      );
      this.view.updateInfoGeneral('');
    }
    this.view.updateInfoGeneral('');
    this.view.udpateStartBtn(this.store.currentRound);
  }

  onDifficultyClick(evt) {
    if (evt.target.classList.contains('difficulty')) {
      this.store.difficultyState = evt.target.id;

      this.view.updateDifficulty(this.store.difficultyState);
      this.view.renderLayout(this.store.difficultyState);
    }
  }
  onVirtualKeybordClick(evt) {
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
      if (this.store.isGameOver) {
        console.log('GAME OVER!');
        this.view.updateHelpBtn(
          this.store.currentRound,
          this.store.isHintAvailable,
          this.store.state.user.isRoundPass,
          this.store.state.gameOver,
        );
        this.view.updateInfoGeneral(
          'GAME OVER! Press "NEW GAME" to try again.',
        );
        this.lockInput();
        this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
        return;
      }

      if (
        !isInputPassed &&
        this.store.state.user.hp === 1 &&
        !this.store.isHintAvailable
      ) {
        this.view.updateInfoGeneral(
          `GAME OVER! Press "NEW GAME" to try again.`,
        );
        this.lockInput();
        // this.view.bindRepeatSequenceEvent(this.onRepeatOrNextClick);
        this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
        return;
      }

      if (!isInputPassed) {
        this.view.updateInfoGeneral(
          'Oops... Press "REPEAT" to repeat the sequence',
        );
        this.lockInput();
        this.view.bindRepeatSequenceEvent(this.onRepeatOrNextClick);
        this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
        return;
      }
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
          this.store.state.gameOver,
        );
        // store.showEnding();
        // update view
        this.store.gameOver = true;
        this.view.updateInfoGeneral(
          'YOU WIN! Press "NEW GAME" to start again.',
        );
        this.view.updateHelpBtn(
          this.store.currentRound,
          this.store.isHintAvailable,
          this.store.state.user.isRoundPass,
          this.store.state.gameOver,
        );
        this.lockInput();
        this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
        return;
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
        // this.view.updateRoundInfo(this.store.currentRound, this.store.state.gameRounds);

        // updating HelpBtn is kinda wrong here too
        this.view.updateInfoGeneral('NICE! Press "Next Round" to continue!');
        this.view.updateHelpBtn(
          this.store.currentRound,
          this.store.isHintAvailable,
          // this.store.isCorrect,
          this.store.state.user.isRoundPass,
        );
      }
    }
    setTimeout(() => {
      this.view.bindVirtualKeyboardEvent(this.onVirtualKeybordClick);
    }, 200);
  }

  onKeyboardPress(evt) {
    this.view.unBindVirtualKeyboardEvent(this.onVirtualKeybordClick);
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
      this.view.bindKeyboardEvent(this.onKeyboardPress);
      this.view.bindVirtualKeyboardEvent(this.onVirtualKeybordClick);
      !isKeyPressed;
      // 1;
    }, 200);
  }

  onRepeatOrNextClick(evt) {
    console.log('repeat or next', this.store.state);
    this.view.updateInfoGeneral('..');
    // if (this.store.isCorrect) this.store.nextRound();
    if (this.store.state.user.isRoundPass) {
      this.store.nextRound();
      // lock input
      this.lockInput();
      this.view.showSequence(
        this.store.state.gameSequence[this.store.currentRound - 1],
      );
      // unclock input
      this.view.addEventListener('showSequence:done', () => {
        this.unLockInput();
      });
    } else if (
      !this.store.state.user.isRoundPass &&
      this.store.isHintAvailable
    ) {
      this.store.useHint();
      this.lockInput();
      this.view.showSequence(
        this.store.state.gameSequence[this.store.currentRound - 1],
      );
      this.view.addEventListener('showSequence:done', () => {
        this.unLockInput();
      });
    }

    this.view.updateHelpBtn(
      this.store.currentRound,
      this.store.isHintAvailable,
      // this.store.isCorrect,
      this.store.state.user.isRoundPass,
    );

    this.view.updateRoundInfo(
      this.store.currentRound,
      this.store.state.gameRounds,
    );
  }

  init() {
    this.view.renderUI(this.store.state);
    console.log('render', this.store.state);

    this.view.bindGameDifficultyEvent(this.onDifficultyClick);
    this.view.bindRepeatSequenceEvent(this.onRepeatOrNextClick);
    this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
    // this.view.bindVirtualKeyboardEvent(this.onVirtualKeybordClick);
    // this.view.bindKeyboardEvent(this.onKeyboardPress);
    this.view.updateDifficulty(this.store.difficultyState);
  }

  lockInput() {
    this.view.unBindGameDifficultyEvent(this.onDifficultyClick);
    this.view.unBindRepeatSequenceEvent(this.onRepeatOrNextClick);
    this.view.unBindStartOrResetGameEvent(this.onStartOrResetClick);
    this.view.unBindVirtualKeyboardEvent(this.onVirtualKeybordClick);
    this.view.unBindKeyboardEvent(this.onKeyboardPress);
    console.log('locked');
  }

  unLockInput() {
    this.view.bindGameDifficultyEvent(this.onDifficultyClick);
    this.view.bindRepeatSequenceEvent(this.onRepeatOrNextClick);
    this.view.bindStartOrResetGameEvent(this.onStartOrResetClick);
    this.view.bindVirtualKeyboardEvent(this.onVirtualKeybordClick);
    this.view.bindKeyboardEvent(this.onKeyboardPress);
    console.log('Unlocked');
  }
}

const app = new App();

app.init();
