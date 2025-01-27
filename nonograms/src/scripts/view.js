export default class View {
  el = {};

  constructor() {
    this.el.root = this.#qs('body');
    this.el.main = null;
    this.el.wrapper = null;
    this.el.content = null;
    this.el.inner = null;
    this.el.board = null;
    this.el.game = null;
    this.el.hintTop = null;
    this.el.hintLeft = null;
  }

  mount() {
    this.#addElement('main', 'main', 'MAIN', this.el.root);
    this.#addElement('div', 'wrapper', 'wrapperTEXT', this.el.main);
    this.#addElement('div', 'content', 'content', this.el.wrapper);
    this.#addElement('div', 'inner', 'inner', this.el.content);
    this.#addElement('div', 'game', '', this.el.content);
    this.#addElement('div', 'hintTop', 'hint top', this.el.game);
    this.#addElement('div', 'hintLeft', 'hint left', this.el.game);
    this.#addElement('div', 'board', '', this.el.game);

    // debug
    this.renderGameLayout(15);
  }

  /**
   * Render game field dinamically
   * @param {number} size - Game field size where x = y
   */
  renderGameLayout(size) {
    for (let row = 0; row < size; row += 1) {
      let options = {
        tag: 'div',
        attributes: { class: 'row', id: row, ['data-id']: row },
        textContent: '',
      };
      if ((row + 1) % 5 === 0 && row + 1 !== size) {
        options = {
          ...options,
          attributes: { ...options.attributes, class: 'row row-divider' },
        };
      }
      const currRow = this.#createEl(options, this.el.board);
      for (let col = 0; col < size; col += 1) {
        let options = {
          tag: 'div',
          attributes: {
            class: 'cell cell-effect',
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
              class: `${options.attributes.class} cell-divider `,
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

  updateDifficulty(value) {
    console.log('view updated, changing difficulty to', value);
  }

  updateCell(id) {
    // const targetCell = this.#qs(`[data-id="${id}"]`);
    const selectById = CSS.escape(id);
    const targetCell = this.#qs(`#${selectById}`);
    console.log(targetCell);
    targetCell.classList.toggle('cell-effect');
    targetCell.classList.toggle('cell-filled');
  }

  bindGameBoard(handler) {
    this.el.board.addEventListener('click', handler);
  }

  bindGameReset(handler) {
    this.el.inner.addEventListener('click', handler);
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
      if (Array.isArray(attrValue)) element.classList.add(...attrValue);
      else element.setAttribute(attribute, attrValue);
    }
    element.textContent = textContent;
    if (parent) parent.appendChild(element);
    return element;
  }

  #addElement(tag, context, text = '', parent) {
    this.el[context] = this.#createEl(
      {
        tag,
        attributes: { class: [context], id: context },
        textContent: text ? text : '',
      },
      parent,
    );
    return this.el[context];
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
