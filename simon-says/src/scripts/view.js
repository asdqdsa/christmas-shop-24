export default class View extends EventTarget {
  el = {};

  constructor() {
    super();
    this.el.body = document.querySelector('body');
    this.el.main = null;
    this.el.mainContainer = null;
    this.el.display = null;
    this.el.controls = null;
    this.el.difficulty = null;
    this.el.startBtn = null;
    this.el.helpBtn = null;
    this.el.keyboard = null;
    this.el.infoRound = null;
    this.el.infoGeneral = null;
    this.el.infoUserSeq = null;
  }

  // render HTML
  renderUI(initialState) {
    const main = this.#createElement(
      'main',
      {
        class: 'main',
        id: 'main',
        ['data-id']: 'main',
      },
      '',
    );
    this.el.main = main;
    this.el.body.appendChild(main);

    // MAIN
    const mainContainer = this.#createElement('div', {
      class: 'main-container',
      id: 'main-container',
      ['data-id']: 'main-container',
    });
    this.el.mainContainer = mainContainer;
    this.el.main.appendChild(mainContainer);

    // DISPLAY
    const display = this.#createElement('div', {
      class: 'display',
      id: 'display',
      ['data-id']: 'display',
    });
    this.el.display = display;
    this.el.mainContainer.appendChild(display);

    // INFO
    this.renderRoundInfo(initialState.user.round);
    this.renderGeneralInfo(initialState.user.info);
    this.renderUserSeqInfo();

    // DIFFICUTLY
    const controls = this.#createElement('div', {
      class: 'controls',
      id: 'controls',
      ['data-id']: 'controls',
    });
    this.el.controls = controls;
    this.el.mainContainer.appendChild(controls);

    const renderDifficulty = (type) => {
      const difficultyType = type;
      const pad = this.el.controls;
      const dict = ['Easy', 'Medium', 'Hard'];

      for (const key of dict) {
        const difficulty = this.#createElement(
          'div',
          {
            class: 'difficulty',
            id: `${key.toLowerCase()}`,
            ['data-id']: `data-${key.toLowerCase()}`,
          },
          key,
        );
        this.el.controls.appendChild(difficulty);
      }
    };
    renderDifficulty();

    // START/RESET
    const startBtn = this.#createElement(
      'button',
      {
        class: 'start-btn',
        id: 'start-btn',
        ['data-id']: 'start-btn',
      },
      'START',
    );
    this.el.startBtn = startBtn;
    this.el.mainContainer.appendChild(startBtn);

    // HELP/NEXT
    const helpBtn = this.#createElement(
      'button',
      {
        class: 'help-btn',
        id: 'help-btn',
        ['data-id']: 'help-btn',
      },
      'HELP/NEXT',
    );
    this.el.helpBtn = helpBtn;
    helpBtn.classList.add('hidden');
    this.el.mainContainer.appendChild(helpBtn);

    // KEYBOARD
    const keyboard = this.#createElement('div', {
      class: 'keyboard',
      id: 'keyboard',
      ['data-id']: 'keyboard',
    });
    this.el.keyboard = keyboard;
    this.el.mainContainer.appendChild(keyboard);
    this.renderLayout('easy');
  }

  // Star/Reset
  // update btn
  udpateStartBtn(round) {
    if (round === 0) this.el.startBtn.textContent = 'START';
    else this.el.startBtn.textContent = 'NEW GAME';
  }

  updateHelpBtn(round, hintExist, isRoundPass, isGameOver = false) {
    console.log(...arguments, 'round, hintExist, isCorrect');
    if (round === 0) {
      this.el.helpBtn.classList.remove('innactive');
      this.el.helpBtn.classList.remove('next');
      this.el.helpBtn.classList.add('hidden');
    }
    if (round > 0) {
      this.el.helpBtn.classList.remove('hidden');
    }

    if (hintExist) {
      this.el.helpBtn.textContent = 'REPEAT';
      this.el.helpBtn.classList.remove('next');
    }
    if (!hintExist) {
      this.el.helpBtn.textContent = 'REPEAT';
      this.el.helpBtn.classList.add('innactive');
      this.el.helpBtn.classList.remove('next');
    }
    if (isRoundPass) {
      this.el.helpBtn.textContent = 'Next Round';
      this.el.helpBtn.classList.add('next');
      this.el.helpBtn.classList.remove('innactive');
    }
    if (isGameOver) {
      this.el.helpBtn.textContent = 'REPEAT';
      this.el.helpBtn.classList.remove('next');
      this.el.helpBtn.classList.add('innactive');
    }
  }

  updateRoundInfo(round, totalRounds) {
    if (round === 0)
      this.el.infoRound.textContent = 'Choose difficulty and press "START"';
    else
      this.el.infoRound.textContent = `Current round: ${round}/${totalRounds}`;
  }

  updateInfoGeneral(text) {
    this.el.infoGeneral.textContent = `${text}`;
  }

  updateUserSeqInfo(symb) {
    if (symb === '') this.el.infoUserSeq.textContent = '';
    else this.el.infoUserSeq.textContent += symb;
  }

  // Difficulty
  // set difficly level
  updateDifficulty(type) {
    const difficulty = this.el.controls;
    const difficultyLevel = difficulty.querySelector(`[data-id=data-${type}]`);
    Array.from(difficulty.children).forEach((node) =>
      node.classList.remove('hightlight-difficulty'),
    );
    difficultyLevel.classList.add('hightlight-difficulty');
  }
  // set difficulty layout
  renderLayout(type) {
    const layoutType = type;
    const pad = this.el.keyboard;
    const dict = {
      easy: '1234567890',
      medium: 'QWERTYUIOPASDFGHJKLZXCVBNM',
      hard: '1234567890' + 'QWERTYUIOPASDFGHJKLZXCVBNM',
    };

    pad.replaceChildren();
    console.log(dict[`${type}`]);
    for (const key of dict[layoutType].split('')) {
      const keycap = this.#createElement(
        'div',
        {
          class: 'keycap',
          id: key.charCodeAt(0),
          ['data-id']: `data-${key.charCodeAt(0)}`,
        },
        key,
      );
      this.el.keyboard.appendChild(keycap);
    }
  }

  highlightKey(code) {
    const pad = this.el.keyboard;
    console.log(`#${code}`, this.el.keyboard);
    const key = document.getElementById(code);
    key?.classList.add('keycap-highlight');
    setTimeout(() => {
      key?.classList.remove('keycap-highlight');
    }, 100);
  }

  showSequence(sequenceMap) {
    console.log(sequenceMap);

    sequenceMap.forEach((keyCode, idx, list) => {
      setTimeout(() => {
        const key = document.getElementById(keyCode);
        key?.classList.add('keycap-highlight');

        setTimeout(() => {
          key?.classList.remove('keycap-highlight');
        }, 300);

        if (idx === list.length - 1) {
          setTimeout(() => {
            document
              .getElementById(list[idx])
              ?.classList.remove('keycap-highlight');
            this.dispatchEvent(new Event('showSequence:done'));
          }, 300);
        }
      }, idx * 600);
    });
  }

  // set rounds info
  renderRoundInfo(text = 'ROUND INFO') {
    const infoText = text;
    const info = this.#createElement(
      'div',
      {
        class: 'info',
        id: 'info',
        ['data-id']: `info`,
      },
      // infoText === 0 ? '' : infoText,
      'Choose difficulty and press "START"',
    );

    this.el.infoRound = info;
    this.el.display.appendChild(info);
  }
  renderGeneralInfo(text = 'SUCCESS/FAIL/GAMEOVER/YOUWIN') {
    const infoText = text;
    const info = this.#createElement(
      'div',
      {
        class: 'info-general',
        id: 'info-general',
        ['data-id']: `info-general`,
      },
      // infoText === '' ? '' : infoText,
      ``,
    );

    this.el.infoGeneral = info;
    this.el.display.appendChild(info);
  }

  renderUserSeqInfo(text = 'User typed:') {
    const infoText = text;
    const info = this.#createElement(
      'div',
      {
        class: 'info-user-sequence',
        id: 'info-user-sequence',
        ['data-id']: `info-user-sequence`,
      },
      // infoText === '' ? '' : infoText,
      ``,
    );

    this.el.infoUserSeq = info;
    this.el.display.appendChild(info);
  }

  // register event listeners
  bindGameDifficultyEvent(handler) {
    this.el.controls.addEventListener('click', handler);
  }

  unBindGameDifficultyEvent(handler) {
    this.el.controls.removeEventListener('click', handler);
  }

  bindStartOrResetGameEvent(handler) {
    this.el.startBtn.addEventListener('click', handler);
  }

  unBindStartOrResetGameEvent(handler) {
    this.el.startBtn.removeEventListener('click', handler);
  }

  bindRepeatSequenceEvent(handler) {
    this.el.helpBtn.addEventListener('click', handler);
  }

  unBindRepeatSequenceEvent(handler) {
    this.el.helpBtn.removeEventListener('click', handler);
  }

  bindVirtualKeyboardEvent(handler) {
    console.log('Bind Virtual keyboard fired');
    this.el.keyboard.addEventListener('click', handler, { once: true });
  }

  unBindVirtualKeyboardEvent(handler) {
    console.log('unbind Virtual keyboard fired');
    this.el.keyboard.removeEventListener('click', handler);
  }

  bindKeyboardEvent(handler) {
    console.log('Bind keyboard fired');
    document.addEventListener('keydown', handler, { once: true });
  }

  unBindKeyboardEvent(handler) {
    console.log('unbind keyboard fired');
    document.removeEventListener('keydown', handler);
  }

  // utils
  #createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    for (const attribute in attributes) {
      element.setAttribute(attribute, attributes[attribute]);
    }
    element.textContent = textContent;
    return element;
  }
}
