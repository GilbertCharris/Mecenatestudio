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
   LANGUAGE SYSTEM — IT / EN / ES
========================================================= */
(() => {
  const translations = {
    it: {
      "nav.studio": "Studio",
      "nav.film": "Film",
      "nav.digital": "Digital",
      "nav.direction": "Direzione",
      "nav.contacts": "Contatti",
      "menu.footer": "Roma · Lavoriamo a livello internazionale",
      "home.eyebrow": "Studio creativo indipendente · Roma",
      "home.hero_title": "Identità cinematografiche per progetti d’autore.",
      "home.hero_description": "Film, spazi digitali e direzione creativa per architettura, design, artigianato e brand contemporanei.",
      "home.discover": "Scopri lo studio",
      "service.film_title": "Racconti visivi cinematografici.",
      "service.digital_title": "Siti web d’autore.",
      "service.strategy_title": "Direzione creativa e identità digitale.",
      "service.explore": "Esplora l’approccio",
      "home.manifesto": "Non creiamo contenuti.<br>Costruiamo atmosfere.",
      "about.role": "Creative Director · Designer · Filmmaker",
      "about.intro": "Designer e filmmaker con base a Roma. Lavora tra cinema, identità visiva e progettazione digitale, trasformando architetture, oggetti e brand in esperienze coerenti e memorabili.",
      "about.award": "Premio Atelier Arte Bellezza Cultura — Regione Lazio",
      "about.degree": "Design per l’Industria Sostenibile e il Territorio",
      "about.marketing": "Marketing culturale",
      "footer.title": "Lo studio",
      "footer.copy": "Mecenate Studio è una pratica creativa indipendente che lavora tra film, design e spazi digitali. Collabora con architetti, artigiani e brand contemporanei per costruire identità riconoscibili e durature.",
      "footer.base_label": "Base",
      "footer.base": "Roma · Italia",
      "footer.fields_label": "Ambiti",
      "footer.write": "Scrivici",
      "footer.call": "Chiamaci",
      "film.hero": "La materia<br>diventa racconto.",
      "film.label": "Direzione cinematografica",
      "film.intro": "In un mondo saturo di immagini, non basta mostrare un progetto. Bisogna renderne percepibili il tempo, la materia e il carattere.",
      "film.secondary": "Costruiamo racconti visivi per architettura, design, artigianato, hospitality e brand contemporanei.",
      "film.statement": "Ogni fotogramma<br>è una scelta.",
      "film.method_title": "Dal primo gesto<br>all’ultima luce.",
      "film.cta_label": "Un progetto da raccontare?",
      "film.cta": "Costruiamo insieme<br>la sua presenza.",
      "digital.intro": "Un sito non è un catalogo, ma il luogo digitale in cui un progetto prende forma. Spazio, tipografia e ritmo diventano parte della sua identità.",
      "strategy.intro": "Una presenza digitale autorevole non nasce dall’accumulo, ma dalla selezione. Ogni immagine, testo e pubblicazione deve appartenere allo stesso racconto.",
      "common.approach": "Il nostro approccio",
      "common.start": "Avvia un progetto"
    },
    en: {
      "nav.studio": "Studio",
      "nav.film": "Film",
      "nav.digital": "Digital",
      "nav.direction": "Direction",
      "nav.contacts": "Contact",
      "menu.footer": "Rome · Working internationally",
      "home.eyebrow": "Independent creative studio · Rome",
      "home.hero_title": "Cinematic identities for author-led projects.",
      "home.hero_description": "Film, digital spaces and creative direction for architecture, design, craft, hospitality and contemporary brands.",
      "home.discover": "Discover the studio",
      "service.film_title": "Cinematic visual stories.",
      "service.digital_title": "Author-led websites.",
      "service.strategy_title": "Creative direction and digital identity.",
      "service.explore": "Explore the approach",
      "home.manifesto": "We do not create content.<br>We build atmospheres.",
      "about.role": "Creative Director · Designer · Filmmaker",
      "about.intro": "Rome-based designer and filmmaker working across cinema, visual identity and digital design, transforming architecture, objects and brands into coherent, memorable experiences.",
      "about.award": "Atelier Arte Bellezza Cultura Award — Lazio Region",
      "about.degree": "Design for Sustainable Industry and Territory",
      "about.marketing": "Cultural Marketing",
      "footer.title": "The studio",
      "footer.copy": "Mecenate Studio is an independent creative practice working across film, design and digital spaces. It collaborates with architects, makers and contemporary brands to build distinctive, enduring identities.",
      "footer.base_label": "Base",
      "footer.base": "Rome · Italy",
      "footer.fields_label": "Fields",
      "footer.write": "Write to us",
      "footer.call": "Call us",
      "film.hero": "Matter becomes<br>narrative.",
      "film.label": "Film direction",
      "film.intro": "In a world saturated with images, showing a project is not enough. Its time, material and character must become perceptible.",
      "film.secondary": "We create visual narratives for architecture, design, craft, hospitality and contemporary brands.",
      "film.statement": "Every frame<br>is a choice.",
      "film.method_title": "From the first gesture<br>to the final light.",
      "film.cta_label": "A project to tell?",
      "film.cta": "Let us build<br>its presence.",
      "digital.intro": "A website is not a catalogue, but the digital place where a project takes form. Space, typography and rhythm become part of its identity.",
      "strategy.intro": "An authoritative digital presence does not come from accumulation, but from selection. Every image, text and publication must belong to the same narrative.",
      "common.approach": "Our approach",
      "common.start": "Start a project"
    },
    es: {
      "nav.studio": "Estudio",
      "nav.film": "Film",
      "nav.digital": "Digital",
      "nav.direction": "Dirección",
      "nav.contacts": "Contacto",
      "menu.footer": "Roma · Trabajamos internacionalmente",
      "home.eyebrow": "Estudio creativo independiente · Roma",
      "home.hero_title": "Identidades cinematográficas para proyectos de autor.",
      "home.hero_description": "Film, espacios digitales y dirección creativa para arquitectura, diseño, artesanía, hospitality y marcas contemporáneas.",
      "home.discover": "Descubre el estudio",
      "service.film_title": "Relatos visuales cinematográficos.",
      "service.digital_title": "Sitios web de autor.",
      "service.strategy_title": "Dirección creativa e identidad digital.",
      "service.explore": "Explorar el enfoque",
      "home.manifesto": "No creamos contenido.<br>Construimos atmósferas.",
      "about.role": "Director creativo · Diseñador · Filmmaker",
      "about.intro": "Diseñador y filmmaker con base en Roma. Trabaja entre cine, identidad visual y diseño digital, transformando arquitecturas, objetos y marcas en experiencias coherentes y memorables.",
      "about.award": "Premio Atelier Arte Bellezza Cultura — Región del Lazio",
      "about.degree": "Diseño para la Industria Sostenible y el Territorio",
      "about.marketing": "Marketing cultural",
      "footer.title": "El estudio",
      "footer.copy": "Mecenate Studio es una práctica creativa independiente que trabaja entre el cine, el diseño y los espacios digitales. Colabora con arquitectos, artesanos y marcas contemporáneas para construir identidades reconocibles y duraderas.",
      "footer.base_label": "Base",
      "footer.base": "Roma · Italia",
      "footer.fields_label": "Ámbitos",
      "footer.write": "Escríbenos",
      "footer.call": "Llámanos",
      "film.hero": "La materia<br>se convierte en relato.",
      "film.label": "Dirección cinematográfica",
      "film.intro": "En un mundo saturado de imágenes, no basta con mostrar un proyecto. Hay que hacer perceptibles su tiempo, su materia y su carácter.",
      "film.secondary": "Construimos relatos visuales para arquitectura, diseño, artesanía, hospitality y marcas contemporáneas.",
      "film.statement": "Cada fotograma<br>es una elección.",
      "film.method_title": "Del primer gesto<br>a la última luz.",
      "film.cta_label": "¿Un proyecto que contar?",
      "film.cta": "Construyamos juntos<br>su presencia.",
      "digital.intro": "Un sitio web no es un catálogo, sino el lugar digital donde un proyecto toma forma. El espacio, la tipografía y el ritmo se convierten en parte de su identidad.",
      "strategy.intro": "Una presencia digital sólida no nace de la acumulación, sino de la selección. Cada imagen, texto y publicación debe pertenecer al mismo relato.",
      "common.approach": "Nuestro enfoque",
      "common.start": "Iniciar un proyecto"
    }
  };

  const buttons = [...document.querySelectorAll(".language-switcher [data-lang]")];

  function applyLanguage(lang) {
    const dictionary = translations[lang] || translations.it;
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
      button.classList.toggle("is-active", button.dataset.lang === lang);
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });

  applyLanguage(localStorage.getItem("mecenate-language") || "it");
})();
