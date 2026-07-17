const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.site-menu');
let lastY = 0;

function closeMenu() {
  if (!toggle || !menu) return;
  toggle.classList.remove('is-open');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
}

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (header) header.classList.remove('is-hidden');
  });

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

window.addEventListener('scroll', () => {
  if (!header || document.body.classList.contains('menu-open')) return;
  const y = window.scrollY;
  if (y > lastY && y > 90) header.classList.add('is-hidden');
  else header.classList.remove('is-hidden');
  lastY = Math.max(y, 0);
}, { passive: true });
/* =========================================================
   FILM FRAME SCROLL — 5 FRAME
========================================================= */
(() => {
  const story = document.querySelector('.frame-story');
  const image = document.getElementById('frame-image');
  const current = document.getElementById('frame-current');
  const dots = [...document.querySelectorAll('.frame-dots span')];
  const loading = document.getElementById('frame-loading');

  if (!story || !image) return;

  const totalFrames = 6;
  const frames = Array.from(
    { length: totalFrames },
    (_, index) => `frame-${String(index + 1).padStart(2, '0')}.jpg`
  );

  let activeIndex = 0;
  let ticking = false;
  let loadedCount = 0;
  const fallback = image.dataset.fallback || 'foto1.jpg';

  const preloaded = frames.map((source) => {
    const preload = new Image();

    preload.onload = () => {
      loadedCount += 1;
      if (loadedCount === totalFrames && loading) {
        loading.classList.add('is-hidden');
      }
    };

    preload.onerror = () => {
      loadedCount += 1;
      if (loadedCount === totalFrames && loading) {
        loading.classList.add('is-hidden');
      }
    };

    preload.src = source;
    return preload;
  });

  image.addEventListener('error', () => {
    if (!image.src.endsWith(fallback)) image.src = fallback;
  });

  function setFrame(index) {
    if (index === activeIndex) return;

    activeIndex = index;
    const stage = image.closest('.frame-stage');
    stage?.classList.add('is-changing');

    window.setTimeout(() => {
      image.src = frames[index];
      image.alt = `Sequenza cinematografica Mecenate Studio, fotogramma ${index + 1}`;
      if (current) current.textContent = String(index + 1).padStart(2, '0');

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
      });

      stage?.classList.remove('is-changing');
    }, 90);
  }

  function updateFrame() {
    const rect = story.getBoundingClientRect();
    const scrollableDistance = story.offsetHeight - window.innerHeight;
    const progress = Math.min(
      1,
      Math.max(0, -rect.top / Math.max(scrollableDistance, 1))
    );

    const nextIndex = Math.min(
      totalFrames - 1,
      Math.floor(progress * totalFrames)
    );

    setFrame(nextIndex);
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateFrame);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  requestUpdate();

  // Hide loader after a safe timeout even while placeholders are being used.
  window.setTimeout(() => loading?.classList.add('is-hidden'), 1600);
})();
