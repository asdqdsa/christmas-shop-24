export default class View {
  el = {};

  constructor() {
    this.el.root = this.#qs('body');
    this.el.main = null;
    this.el.wrapper = null;
    this.el.content = null;
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
    this.el.random = null;
    this.el.save = null;
  }

  mount(diff) {
    this.#addElement('main', 'main', '', this.el.root);
    this.#addElement('div', 'wrapper', '', this.el.main);
    this.#addElement('div', 'content', '', this.el.wrapper);
    this.#addElement('div', 'controls', '', this.el.content);
    this.#addElement('button', 'cont', 'CONT.', this.el.controls);
    this.#addElement('button', 'random', 'RANDOM', this.el.controls);
    this.#addElement('div', 'difficulty', '', this.el.controls);
    this.#addElement('div', 'presets', '', this.el.controls);
    this.#addElement('div', 'game', '', this.el.content);
    this.#addElement('div', 'hintTop', '', this.el.game);
    this.#addElement('div', 'hintSide', '', this.el.game);
    this.#addElement('div', 'board', '', this.el.game);

    // debug
    this.renderDifficulty(diff);
    // this.renderBoardLayout(5);

    this.#addElement('button', 'clue', 'clue', this.el.content);
    this.#addElement('button', 'save', 'save game', this.el.content);
    this.#addElement('button', 'restart', 'restart', this.el.content);
  }

  renderDifficulty(difficulty) {
    difficulty.forEach((difficultyType) => {
      this.#addElement(
        'button',
        ['level', `${difficultyType}`],
        difficultyType.toUpperCase(),
        this.el.difficulty,
      );
    });
  }

  renderPresetTypes(presets) {
    this.el.presets.replaceChildren();
    Object.keys(presets).forEach((preset) => {
      this.#addElement(
        'button',
        ['preset', `preset-${preset}`],
        preset,
        this.el.presets,
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
  }

  updateScore(value) {
    console.log('view updated, changing score to', value);
  }

  updateDifficulty({ difficulty, presets }) {
    console.log('view updated, changing difficulty to', difficulty, presets);
    this.renderPresetTypes(presets);
  }

  updateHints({ row, col }) {
    this.el.hintSide.replaceChildren();
    this.el.hintTop.replaceChildren();
    row.forEach((rowHint, idx, arr) => {
      let options = {
        tag: 'div',
        attributes: {
          class: ['hint', 'hint-row'],
          id: `hint-${idx}`,
          ['data-id']: `hint-${idx}`,
        },
        textContent: `${rowHint}`,
      };

      if ((idx + 1) % 5 === 0 && idx + 1 !== arr.length) {
        options = {
          ...options,
          attributes: {
            ...options.attributes,
            class: ['hint', 'hint-row', `row-divider`],
          },
        };
      }
      this.#createEl(options, this.el.hintSide);
    });

    col.forEach((colHint, idx, arr) => {
      let options = {
        tag: 'div',
        attributes: {
          class: ['hint', 'hint-col'],
          id: `hint-${idx}`,
          ['data-id']: `hint-${idx}`,
        },
        textContent: `${colHint}`,
      };
      if ((idx + 1) % 5 === 0 && idx + 1 !== arr.length) {
        options = {
          ...options,
          attributes: {
            ...options.attributes,
            class: ['hint', 'hint-col', `cell-divider`],
          },
        };
      }
      this.#createEl(options, this.el.hintTop);
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

  bindGameReset(handler) {
    this.el.restart.addEventListener('click', handler);
  }

  bindGamePresetType(handler) {
    this.el.presets.addEventListener('click', (evt) => {
      const presetType = evt.target.classList.contains('preset');
      if (!presetType) return;
      handler(evt.target.id);
    });
  }

  bindGameDifficulty(handler) {
    this.el.difficulty.addEventListener('click', (evt) => {
      const difficulty = evt.target.classList.contains('level');
      if (!difficulty) return;
      handler(evt.target.id);
    });
  }

  // utils

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
   * @returns
   */
  #addElement(tag, context, text, parent) {
    const elName = Array.isArray(context) ? context.at(-1) : context;
    this.el[elName] = this.#createEl(
      {
        tag,
        attributes: { class: context, id: context },
        textContent: text ? text : '',
      },
      parent,
    );
    return this.el[elName];
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
      // if (attribute === 'class') {
      //   if (Array.isArray(attrValue)) element.classList.add(...attrValue);
      //   else element.classList.add(attrValue.split(' '));
      // } else if (attribute === 'id' && Array.isArray(attrValue)) {
      //   element.setAttribute(attribute, attrValue.at(-1));
      // } else {
      //   element.setAttribute(attribute, attrValue);
      // }
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
