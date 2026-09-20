// Footer year — keeps the copyright line current automatically.
document.querySelectorAll('#year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Contact form — submits to Formspree (formspree.io) via fetch so the
// visitor stays on the page and sees an inline confirmation or error,
// instead of being redirected to Formspree's own confirmation page.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const formNote = document.getElementById('form-note');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    submitBtn.disabled = true;

    fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          formNote.textContent = "Thanks — your message has been sent. We'll get back to you soon.";
          formNote.style.color = 'var(--sage)';
          contactForm.reset();
        } else {
          formNote.textContent = "Something went wrong sending your message — please try again, or email us directly.";
          formNote.style.color = 'var(--rust)';
        }
        formNote.style.display = 'block';
      })
      .catch(() => {
        formNote.textContent = "Something went wrong sending your message — please try again, or email us directly.";
        formNote.style.color = 'var(--rust)';
        formNote.style.display = 'block';
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}

// Homepage slideshow — auto-advances through a set of photos, with
// prev/next buttons, dot navigation, pause-on-hover, and respects
// prefers-reduced-motion (no autoplay if the visitor has that set).
(function () {
  const slideshow = document.querySelector('[data-slideshow]');
  if (!slideshow) return;

  const slides = Array.from(slideshow.querySelectorAll('.slide'));
  const dotsWrap = slideshow.querySelector('.slide-dots');
  const prevBtn = slideshow.querySelector('.slide-nav.prev');
  const nextBtn = slideshow.querySelector('.slide-nav.next');
  if (!slides.length || !dotsWrap) return;

  let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
  let timer = null;
  const AUTOPLAY_MS = 5000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === index) dot.classList.add('is-active');
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('button'));

  function goTo(next) {
    const i = (next + slides.length) % slides.length;
    if (i === index) return;
    slides[index].classList.remove('is-active');
    dots[index].classList.remove('is-active');
    index = i;
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
  }

  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(index + 1); restart(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(index - 1); restart(); });
  slideshow.addEventListener('mouseenter', () => clearInterval(timer));
  slideshow.addEventListener('mouseleave', restart);

  restart();
})();

// Hero background slideshow — cross-fades through a set of background
// photos behind the homepage hero, each with a short caption, auto-
// advancing on a timer and respecting prefers-reduced-motion.
(function () {
  const hero = document.querySelector('[data-hero-slideshow]');
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll('.hero-bg-slide'));
  const captionEl = hero.querySelector('.hero-caption');
  if (!slides.length) return;

  let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
  const AUTOPLAY_MS = 3800;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateCaption() {
    if (captionEl) captionEl.textContent = slides[index].dataset.caption || '';
  }

  function goTo(next) {
    slides[index].classList.remove('is-active');
    index = (next + slides.length) % slides.length;
    slides[index].classList.add('is-active');
    updateCaption();
  }

  updateCaption();
  if (!reduceMotion) setInterval(() => goTo(index + 1), AUTOPLAY_MS);
})();

// Photo lightbox — click any photo inside a [data-lightbox-gallery]
// container (e.g. the "Life at READS" grid, or the Our Work photo
// gallery) to view it full-size, with prev/next through that same
// gallery, a close button, click-outside-to-close, and Escape to close.
(function () {
  const galleries = Array.from(document.querySelectorAll('[data-lightbox-gallery]'));
  if (!galleries.length) return;

  // Build the overlay once and reuse it for every gallery on the page.
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML =
    '<button type="button" class="lightbox-nav prev" aria-label="Previous photo">&#8249;</button>' +
    '<figure class="lightbox-figure">' +
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<img alt="">' +
      '<figcaption></figcaption>' +
    '</figure>' +
    '<button type="button" class="lightbox-nav next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('img');
  const captionEl = overlay.querySelector('figcaption');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn2 = overlay.querySelector('.lightbox-nav.prev');
  const nextBtn2 = overlay.querySelector('.lightbox-nav.next');

  let currentImages = [];
  let currentIndex = 0;

  function show(i) {
    currentIndex = (i + currentImages.length) % currentImages.length;
    const img = currentImages[currentIndex];
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt || '';
    captionEl.textContent = img.alt || '';
  }

  function open(images, startIndex) {
    currentImages = images;
    show(startIndex);
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  galleries.forEach((gallery) => {
    const images = Array.from(gallery.querySelectorAll('img'));
    images.forEach((img, i) => {
      img.addEventListener('click', () => open(images, i));
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn2.addEventListener('click', () => show(currentIndex - 1));
  nextBtn2.addEventListener('click', () => show(currentIndex + 1));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });
})();