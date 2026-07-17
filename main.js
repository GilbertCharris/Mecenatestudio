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


/* =========================================================
   WHATSAPP POPUP
   Appears after 12 seconds or 45% scroll, once per session.
========================================================= */
(() => {
  const popup = document.querySelector(".whatsapp-popup");
  if (!popup || sessionStorage.getItem("mecenate-whatsapp-dismissed") === "1") return;

  const closeButton = popup.querySelector(".whatsapp-close");
  let shown = false;

  const showPopup = () => {
    if (shown) return;
    shown = true;
    popup.classList.add("is-visible");
    popup.setAttribute("aria-hidden", "false");
    window.removeEventListener("scroll", onScroll);
  };

  const hidePopup = () => {
    popup.classList.remove("is-visible");
    popup.setAttribute("aria-hidden", "true");
    sessionStorage.setItem("mecenate-whatsapp-dismissed", "1");
  };

  const onScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable > 0 && window.scrollY / scrollable >= 0.45) showPopup();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.setTimeout(showPopup, 12000);
  closeButton?.addEventListener("click", hidePopup);
})();


/* =========================================================
   LANGUAGE — IT / EN / ES
========================================================= */
(() => {
  const dictionaries = {
    it: {
      "nav.studio": "Studio",
      "nav.contacts": "Contatti",
      "nav.direction": "Direzione",
      "menu.footer": "Roma · Lavoriamo a livello internazionale",
      "home.eyebrow": "Studio creativo indipendente · Roma",
      "home.title": "Identità cinematografiche per progetti d’autore.",
      "home.description": "Film, spazi digitali e direzione creativa per architettura, design, artigianato e brand contemporanei.",
      "home.discover": "Scopri lo studio",
      "service.film": "Racconti visivi cinematografici.",
      "service.digital": "Siti web d’autore.",
      "service.direction": "Direzione creativa e identità digitale.",
      "service.explore": "Esplora l’approccio",
      "home.manifesto": "Non creiamo contenuti.<br>Costruiamo atmosfere."
    },
    en: {
      "nav.studio": "Studio",
      "nav.contacts": "Contact",
      "nav.direction": "Direction",
      "menu.footer": "Rome · Working internationally",
      "home.eyebrow": "Independent creative studio · Rome",
      "home.title": "Cinematic identities for author-led projects.",
      "home.description": "Film, digital spaces and creative direction for architecture, design, craft and contemporary brands.",
      "home.discover": "Discover the studio",
      "service.film": "Cinematic visual stories.",
      "service.digital": "Author-led websites.",
      "service.direction": "Creative direction and digital identity.",
      "service.explore": "Explore the approach",
      "home.manifesto": "We do not create content.<br>We build atmospheres."
    },
    es: {
      "nav.studio": "Estudio",
      "nav.contacts": "Contacto",
      "nav.direction": "Dirección",
      "menu.footer": "Roma · Trabajamos internacionalmente",
      "home.eyebrow": "Estudio creativo independiente · Roma",
      "home.title": "Identidades cinematográficas para proyectos de autor.",
      "home.description": "Film, espacios digitales y dirección creativa para arquitectura, diseño, artesanía y marcas contemporáneas.",
      "home.discover": "Descubre el estudio",
      "service.film": "Relatos visuales cinematográficos.",
      "service.digital": "Sitios web de autor.",
      "service.direction": "Dirección creativa e identidad digital.",
      "service.explore": "Explorar el enfoque",
      "home.manifesto": "No creamos contenido.<br>Construimos atmósferas."
    }
  };

  const buttons = [...document.querySelectorAll(".menu-language [data-lang]")];
  if (!buttons.length) return;

  const applyLanguage = (lang) => {
    const dictionary = dictionaries[lang] || dictionaries.it;
    document.documentElement.lang = lang;
    localStorage.setItem("mecenate-language", lang);

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = dictionary[node.dataset.i18n];
      if (value) node.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
      const value = dictionary[node.dataset.i18nHtml];
      if (value) node.innerHTML = value;
    });

    buttons.forEach((button) => {
      const active = button.dataset.lang === lang;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });

  applyLanguage(localStorage.getItem("mecenate-language") || "it");
})();
