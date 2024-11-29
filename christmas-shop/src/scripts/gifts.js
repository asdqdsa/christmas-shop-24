console.log('gifts is set');

// Scroll to Top
const scrollUpArrow = document.querySelector('#scroll-up');
scrollUpArrow.addEventListener('click', handleScrollToTop);

function handleScrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollUpArrow.classList.remove('scroll-up-arrow_inactive');
  } else scrollUpArrow.classList.add('scroll-up-arrow_inactive');
});
