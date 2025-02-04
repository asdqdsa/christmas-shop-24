export default class View {
  el = {};

  constructor() {
    this.el.root = this.#qs('body');
    this.el.main = null;
    this.el.wrapper = null;
    this.el.content = null;
    this.el.display = null;
    this.el.board = null;
    this.el.game = null;
    this.el.hintTop = null;
    this.el.hintSide = null;
    this.el.controls = null;
    this.el.difficulty = null;
    this.el.difficultyBtn = null;
    this.el.presets = null;
    this.el.restart = null;
    this.el.continue = null;
    this.el.matchCtrl = null;
    this.el.random = null;
    this.el.save = null;
    this.el.clue = null;
    this.el.timer = null;
    this.el.settings = null;
  }

  mount(params) {
    const { difficulty } = params;
    this.#mountElement('main', 'main', '', this.el.root);
    this.#mountElement('div', 'wrapper', '', this.el.main);
    this.#mountElement('div', 'settings', '', this.el.wrapper);
    this.#mountElement('button', 'theme', 'Switch theme', this.el.settings);
    this.#mountElement('button', 'sound', 'Volume is ON', this.el.settings);
    this.#mountElement('p', 'display', '', this.el.wrapper);
    this.#mountElement('div', 'content', '', this.el.wrapper);
    this.#mountElement('div', 'controls', '', this.el.content);
    this.#mountElement('button', 'continue', 'LOAD', this.el.controls);
    this.#mountElement('button', 'random', 'RANDOM', this.el.controls);
    this.#mountElement('div', 'difficulty', '', this.el.controls);
    this.#mountElement('div', 'presets', '', this.el.controls);
    this.#mountElement('div', 'game', '', this.el.content);
    this.#mountElement('div', 'hintTop', '', this.el.game);
    this.#mountElement('div', 'hintSide', '', this.el.game);
    this.#mountElement('div', 'board', '', this.el.game);
    this.#mountElement('div', 'timer', '00:00', this.el.game);
    this.#mountElement('div', 'matchCtrl', '', this.el.content);
    this.#mountDifficulty(difficulty);
    this.#mountElement('button', 'clue', 'solution', this.el.matchCtrl);
    this.#mountElement('button', 'save', 'save', this.el.matchCtrl);
    this.#mountElement('button', 'restart', 'reset', this.el.matchCtrl);
  }

  initView(params) {
    const { isSaveExist, presetName } = params;
    console.log(isSaveExist, presetName);
    this.el.matchCtrl.classList.add('visually-hidden');
    this.el.continue.classList.toggle('visually-hidden', !isSaveExist);
    this.el.continue.classList.add('visually-hidden');
  }

  updateStartView(isSaveExist) {
    this.el.matchCtrl.classList.remove('visually-hidden');
    this.clearDisplay();
    if (isSaveExist)
      this.el.continue.classList.toggle('visually-hidden', !isSaveExist);
  }

  udpatePreset(presetLayoutId) {
    const presets = this.#qsAll(`.preset`);
    Array.from(presets).forEach((el) => {
      el.classList.remove('presets-higlight');
    });
    const currentPreset = this.#qs(`.${presetLayoutId}`, this.el.presets);
    console.log(currentPreset);
    currentPreset.classList.add('presets-higlight');
  }

  #mountDifficulty(difficulty) {
    difficulty.forEach((difficultyType) => {
      this.#mountElement(
        'button',
        ['level', `${difficultyType}`],
        difficultyType.toUpperCase(),
        this.el.difficulty,
      );
    });
  }

  /**
   * Render game field dinamically
   * @param {number} size - Game field size where x = y
   */
  renderBoardLayout(size) {
    this.el.board.replaceChildren();
    for (let row = 0; row < size; row += 1) {
      let options = {
        tag: 'div',
        attributes: { class: 'row', id: row, ['data-id']: row },
        textContent: '',
      };
      if ((row + 1) % 5 === 0 && row + 1 !== size) {
        options = {
          ...options,
          attributes: { ...options.attributes, class: ['row', 'row-divider'] },
        };
      }
      const currRow = this.#createEl(options, this.el.board);

      for (let col = 0; col < size; col += 1) {
        let options = {
          tag: 'div',
          attributes: {
            class: ['cell', 'cell-effect'],
            id: `${row}-${col}`,
            ['data-id']: `${row}-${col}`,
          },
          textContent: '',
        };
        if ((col + 1) % 5 === 0 && col + 1 !== size) {
          options = {
            ...options,
            attributes: {
              ...options.attributes,
              // class: [`${options.attributes.class} `, `cell-divider`],
              class: ['cell', 'cell-effect', `cell-divider`],
            },
          };
        }
        this.#createEl(options, currRow);
      }
    }
    // this.el.matchCtrl.classList.remove('visually-hidden');
  }

  revealGamePreset({ preset }) {
    this.#drawBoardLayount({ preset, isOnLoading: false });
  }

  #drawBoardLayount({ preset, isOnLoading }) {
    for (let i = 0; i < preset.length; i += 1) {
      for (let j = 0; j < preset[i].length; j += 1) {
        const id = CSS.escape(`${i}-${j}`);
        const cell = this.#qs(`#${id}`);
        const presetVal = +preset[i][j];
        if (presetVal === 1) cell.classList.add('cell-filled');
        if (isOnLoading && presetVal === -1) cell.classList.add('cell-crossed');
        if (!isOnLoading && presetVal !== 1) cell.classList.add('cell-crossed');
      }
    }
  }

  updateBoardLayout({ preset }) {
    this.#drawBoardLayount({ preset, isOnLoading: true });
  }

  updateScore(value) {
    console.log('view updated, changing score to', value);
  }

  updateDifficulty({ difficulty, presets }) {
    console.log('view updated, changing difficulty to', difficulty, presets);
    this.#renderPresetTypes(presets);
  }

  #renderPresetTypes(presets) {
    const isPresetsExist = document.querySelector('.preset');
    this.el.presets.replaceChildren();
    Object.keys(presets).forEach((preset) => {
      if (preset === 'amogus' && isPresetsExist == null) {
        this.#mountElement(
          'button',
          ['presets-higlight', 'preset', `preset-${preset}`],
          preset,
          this.el.presets,
        );
      } else {
        this.#mountElement(
          'button',
          ['preset', `preset-${preset}`],
          preset,
          this.el.presets,
        );
      }
    });
  }

  updateHints({ row, col }) {
    this.el.hintSide.replaceChildren();
    this.el.hintTop.replaceChildren();

    const drawDivider = (hintAxis, idx, arr, options) => {
      if ((idx + 1) % 5 === 0 && idx + 1 !== arr.length) {
        options.attributes.class = options.dividerClass;
      }
    };

    const renderHints = (hintVal, idx, i, parent) => {
      this.#createEl(
        {
          tag: 'div',
          attributes: { id: `hint-cell-${idx}-${i}`, class: `hint-cell` },
          textContent: `${hintVal}`,
        },
        parent,
      );
    };

    row.forEach((rowHint, idx, arr) => {
      let options = {
        tag: 'div',
        attributes: {
          class: ['hint', 'hint-row'],
          id: `hint-row-${idx}`,
        },
        dividerClass: ['hint', 'hint-row', `row-divider`, 'hint-divider'],
      };
      drawDivider(rowHint, idx, arr, options);
      const hintsList = this.#createEl(options, this.el.hintSide);
      rowHint.forEach((hintVal, i) => {
        renderHints(hintVal, idx, i, hintsList);
      });
    });

    col.forEach((colHint, idx, arr) => {
      let options = {
        tag: 'div',
        attributes: {
          class: ['hint', 'hint-col'],
          id: `hint-col-${idx}`,
        },
        dividerClass: ['hint', 'hint-col', `cell-divider`],
      };
      drawDivider(colHint, idx, arr, options);
      const hintsList = this.#createEl(options, this.el.hintTop);
      console.log(colHint);
      colHint.forEach((hintVal, i) => {
        renderHints(hintVal, idx, i, hintsList);
      });
    });
  }

  updateCell(id, { isLeftClick, isRightClick }) {
    // const targetCell = this.#qs(`[data-id="${id}"]`);
    const selectById = CSS.escape(id);
    const targetCell = this.#qs(`#${selectById}`);

    if (isLeftClick) {
      targetCell.classList.remove('cell-crossed');
      targetCell.classList.toggle('cell-filled');
    }
    if (isRightClick) {
      targetCell.classList.remove('cell-filled');
      targetCell.classList.toggle('cell-crossed');
    }
    if (
      targetCell.classList.contains('cell-filled') ||
      targetCell.classList.contains('cell-crossed')
    ) {
      targetCell.classList.remove('cell-effect');
    } else {
      targetCell.classList.add('cell-effect');
    }
  }

  updateTimer({ formatedTime, isCompleted }) {
    // console.log(formatedTime, isCompleted);
    // if (isCompleted) this.el.timer.textContent = formatedTime;
    this.el.timer.textContent = formatedTime;
  }

  clearTimer() {
    this.el.timer.textContent = '00:00';
  }

  showNotification(timerNotification) {
    const notificationWithTimer = `Great! You have solved the nonogram in ${timerNotification} seconds!`;
    const notificationText =
      'Great! You have solved the nonogram in ! Press "RANDOM" to play random game, or simply choose any game from the list';
    this.el.display.textContent = `${notificationWithTimer}`;
  }

  clearDisplay() {
    this.el.display.textContent = `${''}`;
  }

  updateVolume(isVolumeOn) {
    if (isVolumeOn) this.el.sound.textContent = `Volume is ON`;
    else this.el.sound.textContent = `Volume is OFF`;
  }

  updateTheme(themeType) {
    console.log(themeType);
    document.body.className = themeType;
  }

  // BINDS

  bindGameDifficulty(handler) {
    this.el.difficulty.addEventListener('click', (evt) => {
      const difficulty = evt.target.classList.contains('level');
      if (!difficulty) return;
      handler(evt.target.id);
    });
  }

  bindGamePresetType(handler) {
    this.el.presets.addEventListener('click', (evt) => {
      const presetType = evt.target.classList.contains('preset');
      if (!presetType) return;
      handler(evt.target.id);
    });
  }

  bindGameBoard(handler) {
    this.el.board.addEventListener('mousedown', (evt) => {
      const mouseBtnClick = evt.button;
      const cell = evt.target.classList.contains('cell');
      if (!cell) return;
      if (mouseBtnClick === 2) evt.preventDefault();

      handler({
        cellId: evt.target.id,
        isLeftClick: evt.button === 0,
        isRightClick: evt.button === 2,
      });
    });

    this.el.board.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
    });
  }

  bindGameClue(handler) {
    this.el.clue.addEventListener('click', handler);
  }

  bindGameReset(handler) {
    this.el.restart.addEventListener('click', handler);
  }

  bindGameSave(handler) {
    this.el.save.addEventListener('click', handler);
  }

  bindSaveLoad(handler) {
    this.el.continue.addEventListener('click', handler);
  }

  bindMuteSound(handler) {
    this.el.sound.addEventListener('click', handler);
  }

  bindSwichTheme(handler) {
    this.el.theme.addEventListener('click', handler);
  }

  // UTILS
  /**
   * Bind events to registered DOM elements
   * @param {string} context - Element name/key
   * @param {string} eventType - Event type
   * @param {Function} handler - Callback
   * @returns {void}
   */
  #bindEvents(context, eventType, handler) {
    this.el[context].addEventListener(eventType, handler);
  }
  /**
   *
   * @param {string} tag - Element tag
   * @param {string | Array} context - if Array, the last is always should stay unique
   * @param {string} text - Content text, deafaul is ''
   * @param {Element} parent - Parent Element
   * @returns {Element} - Created Element
   */
  #mountElement(tag, context, text, parent) {
    const elName = Array.isArray(context) ? context.at(-1) : context;
    const element = this.#createEl(
      {
        tag,
        attributes: { class: context, id: context },
        textContent: text ? text : '',
      },
      parent,
    );
    this.el[elName] = element;
    return element;
  }

  /**
   * Create Element and appends to parent/document
   * @param {Object} options - Configuration
   * @param {string} options.tag - HTML tag name
   * @param {Object} [options.attributes={}] - Element props
   * @param {string} [options.textContent=''] - Element text content
   * @param {Element} [parent] - Parent Element
   * @returns {Element} - Returns created Element
   */
  #createEl(options, parent) {
    const { tag, attributes = {}, textContent = '' } = options;
    const element = document.createElement(tag);
    for (const attribute in attributes) {
      const attrValue = attributes[attribute];
      if (attribute === 'class' && Array.isArray(attrValue)) {
        element.classList.add(...attrValue);
      }
      if (attribute === 'class' && !Array.isArray(attrValue)) {
        element.classList.add(attrValue.split(' '));
      }
      if (attribute === 'id' && Array.isArray(attrValue)) {
        element.setAttribute(attribute, attrValue.at(-1));
      }
      if (attribute === 'id' && !Array.isArray(attrValue)) {
        element.setAttribute(attribute, attrValue);
      }
    }
    element.textContent = textContent;
    if (parent) parent.appendChild(element);
    return element;
  }

  /**
   * Query selector helper with error handling
   * @param {string} selector - CSS selector
   * @param {HTMLElement | Document} [parent=document] - (optional)- Parent HTMLelement
   * @returns {HTMLElement} Found HTMLelement
   * @throws {Error} If element not found
   * private
   */
  #qs(selector, parent = document) {
    const element = parent.querySelector(selector);
    if (!(element instanceof HTMLElement))
      throw new Error(`No such element with selector ${selector}`);
    return element;
  }

  /**
   * Query selector helper with error handling
   * @param {string} selector - CSS selector
   * @returns {NodeList} - Found Node List
   * @throws {Error} - If Node List is empty
   * private
   */
  #qsAll(selector) {
    const elementList = document.querySelectorAll(selector);
    if (elementList.length === 0) throw new Error('Node list is empty');
    return elementList;
  }
}
