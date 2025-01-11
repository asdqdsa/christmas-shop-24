export default class View {
  el = {};

  constructor() {
    this.el.body = document.querySelector('body');
    this.el.main = null;
    this.el.mainContainer = null;
    this.el.display = null;
    this.el.controls = null;
    this.el.startBtn = null;
    this.el.helpBtn = null;
    this.el.keyboard = null;
    this.el.info = null;
  }

  // render HTML
  renderUI() {
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
    const renderInfo = (text) => {
      const infoText = text || 'ROUND INFO';
      const info = this.#createElement(
        'div',
        {
          class: 'info',
          id: 'info',
          ['data-id']: `${text}-info`,
        },
        infoText,
      );

      this.el.info = info;
      this.el.display.appendChild(info);
    };
    renderInfo();

    // DIFFICUTLY
    const controls = this.#createElement('div', {
      class: 'controls',
      id: 'controls',
      ['data-id']: 'controls',
    });
    this.el.controls = controls;
    this.el.mainContainer.appendChild(controls);

    const renderDifficulty = (type) => {
      const difficultyType = type || 'easy';
      const pad = this.el.controls;
      const dict = ['Easy', 'Medium', 'Hard'];

      for (const key of dict) {
        const difficulty = this.#createElement(
          'div',
          {
            class: 'difficulty',
            id: `${key.toLowerCase()} `,
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

    // KEYBOARD
    const keyboard = this.#createElement('div', {
      class: 'keyboard',
      id: 'keyboard',
      ['data-id']: 'keyboard',
    });
    this.el.keyboard = keyboard;
    this.el.mainContainer.appendChild(keyboard);

    const renderLayout = (type) => {
      const layoutType = type;
      const pad = this.el.keyboard;
      const dict = {
        abc: 'QWERTYUIOPASDFGHJKLZXCVBNM',
        num: '1234567890',
      };
      for (const key of dict.abc) {
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
    };
    renderLayout();

    // HELP
    const helpBtn = this.#createElement(
      'button',
      {
        class: 'help-btn',
        id: 'help-btn',
        ['data-id']: 'help-btn',
      },
      'REPEAT',
    );
    this.el.helpBtn = helpBtn;
    // helpBtn.classList.add('hidden');
    this.el.mainContainer.appendChild(helpBtn);
  }

  // register event listeners

  bindGameDifficultyEvent(handler) {
    this.el.controls.addEventListener('click', handler);
  }

  bindStartOrResetGameEvent(handler) {
    this.el.startBtn.addEventListener('click', handler);
  }

  bindRepeatSequenceEvent(handler) {
    this.el.helpBtn.addEventListener('click', handler);
  }

  bindVirtualKeyboardEvent(handler) {
    this.el.keyboard.addEventListener('click', handler);
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
