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
