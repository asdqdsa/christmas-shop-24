// Mobile menu
const page = document.querySelector('.page');
const mobileNav = document.querySelector('#mobile-menu');
const mobileMenu = document.querySelector('#mobile');

mobileMenu.addEventListener('click', handleMobileMenu);
function handleMobileMenu(e) {
  const element = e.currentTarget;
  element.dataset.active = !(element.dataset.active === 'true');
  toggleMobileMenu();
  resetOnView(element.dataset.active === 'true');
}

function toggleMobileMenu() {
  mobileMenu.classList.toggle('header__nav-hamburger_animation');
  mobileNav.classList.toggle('header__nav-mobile-open');
  page.classList.toggle('scroll-disable');
  window.removeEventListener('resize', onResize);
}

const onResize = () => {
  toggleMobileMenu();
  mobileMenu.dataset.active = !(mobileMenu.dataset.active === 'true');
  window.removeEventListener('resize', onResize);
};
function resetOnView(isOpened) {
  if (isOpened) {
    window.addEventListener('resize', onResize);
  }
}

const mobileList = document.querySelector('#mobile-list');
mobileList.addEventListener('click', (e) => {
  if (e.target.closest('.header__nav-item_mobile-animation')) {
    toggleMobileMenu();
    mobileMenu.dataset.active = !(mobileMenu.dataset.active === 'true');
  }
});
