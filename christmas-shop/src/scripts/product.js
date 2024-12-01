import products from './products.json';

const storeShelf = document.querySelector('#store-showcase');

const cardConfig = {
  name: '.card__info-text',
  img: '.card__img',
  base: '/asdqdsa-JSFE2024Q4/',
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

function populateStore(data) {
  console.log(data);
  storeShelf.replaceChildren();
  data.forEach((dataItem) => {
    const cardElement = getLayoutItemClone();
    const card = createItem(cardElement, dataItem, cardConfig);
    storeShelf.appendChild(card);
  });
}
populateStore(products);

function getLayoutItemClone() {
  const cardTemplateContent = document.querySelector('#template-card').content;
  return cardTemplateContent.querySelector('#content-card').cloneNode(true);
}

function createItem(element, data, config) {
  const { category, name, img, imgSrc, base, categoryTag } = { ...config };
  element.querySelector(name).textContent = data.name;
  element.querySelector(category).textContent = data.category;
  const tag = data.category.split(' ').at(-1).toLowerCase();
  element.querySelector(img).src = base + imgSrc[tag];
  element.querySelector(category).classList.add(`${categoryTag + tag}`);
  return element;
}

// TABS
const tabs = document.querySelector('#store-tabs');
const tabsConfig = {
  tabAll: '#store-tab-all',
  tabWork: '#store-tab-work',
  tabHealth: '#store-tab-health',
  tabHarmony: '#store-tab-harmony',
};

const tabsState = {
  tabAll: true,
  tabWork: false,
  tabHealth: false,
  tabHarmony: false,
};

function getElements(config) {
  const map = new Map();
  for (let tab in config) {
    const el = document.querySelector(config[tab]);
    if (el) map.set(tab, el);
  }
  return map;
}

const tabMap = getElements(tabsConfig);

tabs.addEventListener('click', handleTabsState);

function handleTabsState(evt) {
  const activeTab = evt.currentTarget;
  const closestTab = getClosest(evt.target, tabsConfig);
  function getClosest(element, list) {
    for (let tab in list) {
      if (list[tab]) {
        if (element.closest(list[tab])) return element.closest(list[tab]);
      }
    }
  }

  tabMap.forEach((tab) => {
    tab.dataset.active = false;
    tab.classList.remove('store__tab_active');
  });
  if (closestTab) {
    closestTab.dataset.active = true;
    activeTab.dataset.activeTab = closestTab.dataset.tabName;
    closestTab.classList.add('store__tab_active');
  }
}

tabs.addEventListener('click', (e) => {
  const currentTab = e.currentTarget;
  const userCategory = currentTab.dataset.activeTab;
  if (userCategory === 'all') return populateStore(products);
  const filteredData = [...products].filter(
    (item) =>
      item.category ===
      `For ${userCategory[0].toUpperCase()}${userCategory.slice(1)}`,
  );
  populateStore(filteredData);
});
