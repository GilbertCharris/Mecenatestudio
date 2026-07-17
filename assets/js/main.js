(() => {
  const body = document.body;
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-menu-panel]');

  const setMenu = (open) => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    panel.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
  };

  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  panel?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(node => observer.observe(node));

  const note = document.querySelector('[data-conversation-note]');
  const noteClose = document.querySelector('[data-note-close]');
  if (note && !sessionStorage.getItem('mecenate-note-closed')) {
    const showNote = () => { note.classList.add('is-visible'); note.setAttribute('aria-hidden', 'false'); };
    const timer = window.setTimeout(showNote, 14000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max > 0 && scrollY / max > .48) { clearTimeout(timer); showNote(); removeEventListener('scroll', onScroll); }
    };
    addEventListener('scroll', onScroll, { passive: true });
    noteClose?.addEventListener('click', () => {
      note.classList.remove('is-visible'); note.setAttribute('aria-hidden', 'true'); sessionStorage.setItem('mecenate-note-closed', '1');
    });
  }
})();
