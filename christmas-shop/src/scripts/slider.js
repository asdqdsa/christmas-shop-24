const page = document.querySelector('.page');

// TODO Slider
const slider = document.querySelector('#slider');
const sliderControls = document.querySelector('#slider-controls');
const sliderNext = document.querySelector('#slider-next');
const sliderPrev = document.querySelector('#slider-prev');
const sliderFrame = document.querySelector('#slider-frame');
const sliderArrowNext = document.querySelector('#control-arrow-left');
const sliderArrowPrev = document.querySelector('#control-arrow-right');

sliderControls.addEventListener('click', onSliderAction);

function onSliderAction(e) {
  const sliderWidth = slider.offsetWidth;
  const frameWidth = sliderFrame.offsetWidth;
  let steps = 3;
  let direction = 1;
  if (e.target.closest('#slider-next')) direction = 1;
  else if (e.target.closest('#slider-prev')) direction = -1;
  if (page.clientWidth > 768) steps = 3;
  else steps = 6;
  sliderTransition(sliderWidth, frameWidth, steps, direction);
}
function sliderTransition(width, frame, steps, direction) {
  const offset = width - frame;
  let distance = Math.ceil(offset / steps) * direction;
  let inset = parseFloat(
    window.getComputedStyle(slider).getPropertyValue('inset-inline-end'),
  );
  inset += distance;
  inset = Math.max(Math.min(inset, offset), 0);
  slider.style.insetInlineEnd = `${inset}px`;
  toggleControls(inset, offset);
}

function toggleControls(inset, offset) {
  if (inset <= 0) {
    sliderPrev.classList.add('slider__controls-right_inactive');
    sliderPrev.classList.remove('slider__controls-right');
    sliderArrowPrev.classList.add('control-arrows-svg_inactive');
    sliderArrowPrev.classList.remove('control-arrows-svg');
  } else {
    sliderPrev.classList.remove('slider__controls-right_inactive');
    sliderPrev.classList.add('slider__controls-right');
    sliderArrowPrev.classList.remove('control-arrows-svg_inactive');
    sliderArrowPrev.classList.add('control-arrows-svg');
  }
  if (inset >= offset) {
    sliderNext.classList.add('slider__controls_inactive');
    sliderNext.classList.remove('slider__controls-left');
    sliderArrowNext.classList.add('control-arrows-svg_inactive');
    sliderArrowNext.classList.remove('control-arrows-svg');
  } else {
    sliderNext.classList.remove('slider__controls_inactive');
    sliderNext.classList.add('slider__controls-left');
    sliderArrowNext.classList.remove('control-arrows-svg_inactive');
    sliderArrowNext.classList.add('control-arrows-svg');
  }
}

window.addEventListener('resize', () => {
  slider.style.insetInlineEnd = `${0}px`;
  sliderPrev.classList.add('slider__controls-right_inactive');
  sliderPrev.classList.remove('slider__controls-right');
  sliderArrowPrev.classList.add('control-arrows-svg_inactive');
  sliderArrowPrev.classList.remove('control-arrows-svg');
  sliderNext.classList.remove('slider__controls_inactive');
  sliderNext.classList.add('slider__controls-left');
  sliderArrowNext.classList.remove('control-arrows-svg_inactive');
  sliderArrowNext.classList.add('control-arrows-svg');
});
