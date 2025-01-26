export default class View {
  el = {};

  constructor() {
    this.el.root = this.#qs('body');
    this.el.main = null;
    this.el.wrapper = null;
    this.el.content = null;
    this.el.inner = null;
    this.el.game = null;
  }

  mount() {
    this.#addElement('main', 'main', 'MAIN', this.el.root);
    this.#addElement('div', 'wrapper', 'wrapperTEXT', this.el.main);
    this.#addElement('div', 'content', 'content', this.el.wrapper);
    this.#addElement('div', 'inner', 'inner', this.el.content);
    this.#addElement('div', 'game', 'game', this.el.content);
  }

  updateScore(value) {
    console.log('view triggered, changing score to', value);
  }

  bindGameBoard(handler) {
    this.el.game.addEventListener('click', handler);
  }

  bindGameReset(handler) {
    this.el.inner.addEventListener('click', handler);
  }

  // util

  /**
   *
   * Binds events to registered DOM elements
   */

  #bindEvents() {}

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
    if (!(element instanceof HTMLElement)) throw new Error('No such element');
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
