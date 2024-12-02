// Random gifts
import products from './products.json';
import { openModal } from './modal';

const storeShelf = document.querySelector('#gifts-shelf');
const cardConfig = {
  name: '.card__info-text',
  img: '.card__img',
  base: '/asdqdsa-JSFE2024Q4',
  imgSrc: {
    work: '/gift-for-work.png',
    health: '/gift-for-health.png',
    harmony: '/gift-for-harmony.png',
  },
  categoryTag: 'card__info-tag_',
  description: null,
  category: '.card__info-tag',
  superpowers: {
    live: '+500',
    create: '+500',
    love: '+200',
    dream: '+400',
  },
};

function getLayoutItemClone() {
  const cardTemplateContent = document.querySelector('#template-card').content;
  return cardTemplateContent.querySelector('#content-card').cloneNode(true);
}

function createItem(element, data, config, handlerOpenModal) {
  const { category, name, img, imgSrc, base, categoryTag } = { ...config };
  element.querySelector(name).textContent = data.name;
  element.querySelector(category).textContent = data.category;
  const tag = data.category.split(' ').at(-1).toLowerCase();
  element.querySelector(img).src = base + imgSrc[tag];
  element.querySelector(category).classList.add(`${categoryTag + tag}`);
  element.addEventListener('click', handlerOpenModal);

  return element;
}

function populateStore(data) {
  storeShelf.replaceChildren();
  data.forEach((dataItem) => {
    const cardElement = getLayoutItemClone();
    const card = createItem(cardElement, dataItem, cardConfig, () =>
      openModal(dataItem, cardConfig),
    );
    storeShelf.appendChild(card);
  });
}

function getRandomItems(products, quantity = 4) {
  const length = products.length;
  const list = [...products];
  list.forEach((_, idx, list) => {
    const randIdx = Math.floor(Math.random() * length);
    const swap = list[idx];
    list[idx] = list[randIdx];
    list[randIdx] = swap;
  });
  return list.slice(-1 * quantity);
}

const randomItems = getRandomItems(products);
populateStore(randomItems);
