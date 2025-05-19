export function updateButtons(activeSlide) {
  const block = activeSlide.closest('.block');
  const buttons = block.closest('.carousel-wrapper').querySelector('.carousel-buttons');

  const nthSlide = activeSlide.offsetLeft / activeSlide.parentNode.clientWidth;
  const button = block.parentElement.querySelector(`.carousel-buttons > button:nth-child(${nthSlide + 1})`);
  [...buttons.children].forEach((r) => r.classList.remove('selected'));
  button.classList.add('selected');
}

export default function decorate(block) {
  const buttons = document.createElement('div');
  const isTypeA = block.closest('.carousel-type-a');
  const slides = [...block.children];
  [...block.children].forEach((row, i) => {
    const classes = ['image', 'text', 'tag'];
    classes.forEach((e, j) => {
      row.children[j].classList.add(`carousel-${e}`);
    });
    const carouselText = row.querySelector('.carousel-text');
    if (!carouselText.innerText.trim()) carouselText.remove();
    /* buttons */
    const button = document.createElement('button');
    button.title = 'Carousel Nav';
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
      [...buttons.children].forEach((r) => r.classList.remove('selected'));
      button.classList.add('selected');
    });
    buttons.append(button);
  });
  if (block.nextElementSibling) block.nextElementSibling.replaceWith(buttons);
  else block.parentElement.append(buttons);

  block.querySelectorAll(':scope > div').forEach((slide) => slide.classList.add('slide'));

  block.addEventListener('scrollend', () => {
    const activeElement = Math.round(block.scrollLeft / block.children[0].clientWidth);
    const slide = block.children[activeElement];
    updateButtons(slide);
  }, { passive: true });

  if (isTypeA) {
    // Add prev/next buttons if not already present
    const wrapper = block.closest('.carousel-wrapper');
    // Ensure buttons are only added once
    if (!isTypeA.querySelector('.carousel-nav-btn.prev')) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-nav-btn prev';
      prevBtn.setAttribute('aria-label', 'Previous');
      prevBtn.innerHTML = '&#x2039;'; // ‹
      isTypeA.insertBefore(prevBtn, wrapper);
      prevBtn.addEventListener('click', () => {
        const slideWidth = slides[0].clientWidth;
        block.scrollBy({ left: -3 * slideWidth, behavior: 'smooth' });
      });
    }
    if (!isTypeA.querySelector('.carousel-nav-btn.next')) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'carousel-nav-btn next';
      nextBtn.setAttribute('aria-label', 'Next');
      nextBtn.innerHTML = '&#x203A;'; // ›
      isTypeA.appendChild(nextBtn);
      nextBtn.addEventListener('click', () => {
        const slideWidth = slides[0].clientWidth;
        block.scrollBy({ left: 3 * slideWidth, behavior: 'smooth' });
      });
    }
  }
}
