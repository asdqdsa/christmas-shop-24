// MODAL
const page = document.querySelector('.page');
const modalTemplateContent = document.querySelector('#modal').content;
const modal = modalTemplateContent
  .querySelector('#modal-backdrop')
  .cloneNode(true);

function createModal(element, data, config) {
  const { category, name, img, imgSrc, base, categoryTag } = { ...config };
  element.querySelector('.modal-card__about-title').textContent = data.name;
  const tagElement = element.querySelector('.modal-card__about-tag');
  tagElement.textContent = data.category;
  element.querySelector('.modal-card__about-text').textContent =
    data.description;
  const tag = data.category.split(' ').at(-1).toLowerCase();

  tagElement.classList.forEach(
    (style) =>
      style.startsWith('card__info-tag_') && tagElement.classList.remove(style),
  );
  tagElement.classList.add(`card__info-tag_${tag}`);

  element.querySelector('.modal-card__container-img').style.backgroundImage =
    `url('/asdqdsa-JSFE2024Q4${imgSrc[tag]}')`;

  element.querySelector('#perk-live').textContent = data.superpowers.live;
  element.querySelector('#perk-create').textContent = data.superpowers.create;
  element.querySelector('#perk-love').textContent = data.superpowers.love;
  element.querySelector('#perk-dream').textContent = data.superpowers.dream;
  setPointsSuper(
    data.superpowers.live,
    element.querySelector('#snowflakes-live'),
  );
  setPointsSuper(
    data.superpowers.create,
    element.querySelector('#snowflakes-create'),
  );
  setPointsSuper(
    data.superpowers.love,
    element.querySelector('#snowflakes-love'),
  );
  setPointsSuper(
    data.superpowers.dream,
    element.querySelector('#snowflakes-dream'),
  );
  return element;
}

function setPointsSuper(pointStr, element) {
  const points = parseInt(pointStr) / 100;

  element.querySelectorAll('.modal-card__perk-svg').forEach((svg, idx) => {
    svg.classList.add('modal-card__perk-svg_inactive');
    if (idx < points) {
      svg.classList.remove('modal-card__perk-svg_inactive');
    }
  });
}

export function openModal(data, config) {
  const modalElement = createModal(modal, data, config);
  page.appendChild(modalElement);
  page.classList.toggle('scroll-disable');
  modalElement.addEventListener('click', closeModal);
}

export function closeModal(evt) {
  if (
    evt.target.closest('#modal-close') ||
    evt.target.id === 'modal-backdrop'
  ) {
    page.removeChild(modal);
    page.classList.toggle('scroll-disable');
  }
}
