'use strict';

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const operationsContentActive = document.querySelector(
  '.operations__content--active'
);
const operationsContent = document.querySelector('.operations__content');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('img[data-src]');
const header = document.querySelector('.header');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slider = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');

// Modal window
const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach((button) => {
  button.addEventListener('click', openModalWindow);
});
btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

// Smooth page button
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// 1. Adding an event handler for a common parent.
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const href = e.target.getAttribute('href');

  // 2. Identify the "target" element.
  if (e.target.classList.contains('nav__link')) {
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabs
tabContainer.addEventListener('click', function (e) {
  const clickedButton = e.target.closest('.operations__tab');

  // Guard clause
  if (!clickedButton) return;

  // Active tab
  tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
  clickedButton.classList.add('operations__tab--active');

  // Active content
  tabContents.forEach((content) =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clickedButton.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Fade animation on the navigation bar
const navLinksHoverAnimation = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const linkOver = e.target;
    const siblingLinks = linkOver
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('img');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach((el) => {
      if (el !== linkOver) el.style.opacity = this;
    });
    logo.style.opacity = this;
    logoText.style.opacity = this;
  }
};

// Sticky navigation - Intersection Observer API
const navHeight = Math.trunc(nav.getBoundingClientRect().height);
const getStickyNav = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  trashold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Smooth appearance of section of the site
const appearanceSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(appearanceSection, {
  root: null,
  threshold: 0.2,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Implementation of "lazy-loading" for images
const loadImages = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;

  // Changing the image to a higher quality
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.7,
  // Appearances beforehand
  // rootMargin: '300px',
});
lazyImages.forEach((image) => lazyImagesObserver.observe(image));

// Slides
let currentSlide = 0;
const slidesNumber = slides.length;
const createDots = function () {
  slides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};
createDots();

const activeCurrentDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach((dot) => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
};
activeCurrentDot(0);

const moveToSlide = function (slide) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
};
moveToSlide(0);

const nextSlide = function () {
  if (currentSlide === slidesNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  activeCurrentDot(currentSlide);
};
const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = slidesNumber - 1;
  } else {
    currentSlide--;
  }
  moveToSlide(currentSlide);
  activeCurrentDot(currentSlide);
};
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    previousSlide();
  }
});
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activeCurrentDot(slide);
  }
});
