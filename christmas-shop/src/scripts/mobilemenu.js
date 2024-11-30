// TODO Menu
const page = document.querySelector('.page');
const mobileNav = document.querySelector('#mobile-menu');
const mobileMenu = document.querySelector('#mobile');

mobileMenu.addEventListener('click', handleMobileMenu);
function handleMobileMenu(e) {
  const element = e.currentTarget;
  element.dataset.active = !(element.dataset.active === 'true');
  console.log(element);
  toggleMobileMenu();
  // console.log(element.dataset.active);
  resetOnView(element.dataset.active === 'true');
}

function toggleMobileMenu() {
  mobileMenu.classList.toggle('header__nav-hamburger_animation');
  mobileNav.classList.toggle('header__nav-mobile-open');
  page.classList.toggle('scroll-disable');
  window.removeEventListener('resize', onResize);
  console.log('resize removed on toggle');
}

const onResize = () => {
  toggleMobileMenu();
  mobileMenu.dataset.active = !(mobileMenu.dataset.active === 'true');
  console.log('mobileMenu changed back to ', mobileMenu.dataset.active);
  window.removeEventListener('resize', onResize);
  console.log('resize removed');
};
function resetOnView(isOpened) {
  console.log(isOpened, 'isOpened');
  if (isOpened) {
    console.log('resize added');
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
