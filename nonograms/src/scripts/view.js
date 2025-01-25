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
  #qs(selector, parent) {
    const element = (parent || document).querySelector(selector);
    return element
      ? element
      : (() => {
          throw new Error('No such element');
        })();
  }

  #qsAll(selector) {
    const elementList = document.querySelectorAll(selector);
    return elementList.length > 0
      ? elementList
      : (() => {
          throw new Error('Node list is empty');
        })();
  }

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
}
