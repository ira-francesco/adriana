// ─── Gallery config ────────────────────────────────────────────────────────────
// Fallback for file:// or servers without directory listing.
// Populated by media/gallery/manifest.js when loaded as <script> in index.html.
const GALLERY_FALLBACK = [
  'media/gallery/0af08155-6bb5-4f4a-8037-2dcc902884b0.jfif',
  'media/gallery/0e48fb11-d00b-4bf3-b94d-2c46eb717947.jfif',
  'media/gallery/33a09445-1e6d-45a3-8de4-d53aa84dd37e.jfif',
  'media/gallery/50ef620a-4e70-4a96-a43c-ff52c81e7ca3.jfif',
  'media/gallery/bimbo.jfif',
  'media/gallery/777780be-4e8f-4669-9716-b60920e6f57a.jfif',
  'media/gallery/9b40b5b4-46d4-46ea-8d0f-7039eaa811da.jfif',
  'media/gallery/aa725312-4823-421d-a09f-fbe3c00f7228.jfif',
  'media/gallery/e626d753-f3f0-4c80-aed7-39ae7eee4e2b.jfif',
  'media/gallery/ffd8036d-cf73-4f9c-9e17-740a5feddf0b.jfif',
  'media/gallery/corvina.jpg',
  'media/gallery/io capelli.jpg',
];

async function fetchGalleryImages() {
  if (window.GALLERY_MANIFEST?.length) return window.GALLERY_MANIFEST;
  try {
    const res = await fetch('media/gallery/');
    const html = await res.text();
    const doc  = new DOMParser().parseFromString(html, 'text/html');
    const imgs = Array.from(doc.querySelectorAll('a[href]'))
      .map(a => decodeURIComponent(a.getAttribute('href')).split('/').pop())
      .filter(name => /\.(jpe?g|jfif|png|webp|gif|avif)$/i.test(name));
    return imgs.length ? imgs.map(name => `media/gallery/${name}`) : GALLERY_FALLBACK;
  } catch {
    return GALLERY_FALLBACK;
  }
}

function buildGallery(images) {
  const grid = document.querySelector('.gallery-grid');
  images.forEach((src, i) => {
    const num  = String(i + 1).padStart(2, '0');
    const item = document.createElement('div');
    item.className = 'photo-item reveal-gallery';
    item.tabIndex  = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Apri foto ${num}`);
    item.innerHTML =
      `<img src="${src}" alt="Un momento insieme" loading="lazy">` +
      `<span class="photo-label" aria-hidden="true">No. ${num}</span>`;
    grid.appendChild(item);
  });
}


// ─── Map ──────────────────────────────────────────────────────────────────────
const map = L.map('hero-map', {
  center: [38.185457, 15.561022],
  zoom: 16,
  scrollWheelZoom: false,
  dragging: false,
  zoomControl: false,
  attributionControl: false,
  doubleClickZoom: false,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
}).addTo(map);

const pinIcon = L.divIcon({
  className: 'map-pin',
  html: '<div class="pin-dot"></div><div class="pin-stem"></div>',
  iconSize:   [13, 23],
  iconAnchor: [6, 23],
  tooltipAnchor: [0, -26],
});

L.marker([38.185457, 15.561022], { icon: pinIcon })
  .addTo(map)
  .bindTooltip('dove ci siamo dichiarati', {
    permanent:  true,
    direction:  'top',
    className:  'map-label',
  })
  .openTooltip();


// ─── Timer ────────────────────────────────────────────────────────────────────
const DATA_INIZIO = new Date("2025-08-30T22:04:00").getTime();

const $days    = document.getElementById("days");
const $hours   = document.getElementById("hours");
const $minutes = document.getElementById("minutes");
const $seconds = document.getElementById("seconds");

function updateDigit(el, value, pad) {
  const formatted = pad ? String(value).padStart(2, '0') : String(value);
  if (el.dataset.val === formatted) return;
  el.dataset.val = formatted;
  el.textContent = formatted;
  el.classList.remove('digit-anim');
  void el.offsetWidth;
  el.classList.add('digit-anim');
}

function aggiornaTimer() {
  const diff         = Date.now() - DATA_INIZIO;
  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours   = Math.floor(totalMinutes / 60);
  const giorni       = Math.floor(totalHours / 24);

  updateDigit($days,    giorni,              false);
  updateDigit($hours,   totalHours   % 24,   true);
  updateDigit($minutes, totalMinutes % 60,   true);
  updateDigit($seconds, totalSeconds % 60,   true);
}

aggiornaTimer();
setInterval(aggiornaTimer, 1000);


// ─── Quote carousel ───────────────────────────────────────────────────────────
const QUOTES = [
  { text: "Verrà la morte e avrà i tuoi occhi.",                                                        author: "Cesare Pavese"             },
  { text: "In mezzo all'inverno, scoprii che dentro di me c'era un'estate invincibile.",                 author: "Albert Camus"              },
  { text: "Voglio fare con te quello che la primavera fa con i ciliegi.",                                author: "Pablo Neruda"              },
  { text: "Tu sei il coltello con cui frugo dentro di me.",                                              author: "Franz Kafka"               },
  { text: "Amare è questo: due solitudini che si proteggono e si salutano.",                             author: "Rainer Maria Rilke"        },
  { text: "Un intero minuto di felicità! Non è forse abbastanza per tutta la vita di un uomo?",         author: "Fëdor Dostoevskij"         },
  { text: "Non c'è medicina che curi ciò che non può guarire la felicità.",                              author: "Gabriel García Márquez"    },
  { text: "Amare non significa guardarsi l'un l'altro, ma guardare insieme nella stessa direzione.",     author: "Antoine de Saint-Exupéry"  },
  { text: "Ho sceso, dandoti il braccio, almeno un milione di scale.",                                   author: "Eugenio Montale"           },
  { text: "La cosa più bella è ciò che si ama.",                                                         author: "Saffo"                     },
];

const quoteText   = document.querySelector('.quote-text');
const quoteAuthor = document.querySelector('.quote-author');
const quoteBlock  = document.querySelector('.quote-block');

let qi = Math.floor(Math.random() * QUOTES.length);

function setQuote(q) {
  quoteText.textContent   = q.text;
  quoteAuthor.textContent = q.author;
}

function nextQuote() {
  quoteBlock.style.opacity   = '0';
  quoteBlock.style.transform = 'translateY(-10px)';
  setTimeout(() => {
    qi = (qi + 1) % QUOTES.length;
    setQuote(QUOTES[qi]);
    quoteBlock.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      quoteBlock.style.opacity   = '1';
      quoteBlock.style.transform = 'translateY(0)';
    }));
  }, 700);
}

setQuote(QUOTES[qi]);
setInterval(nextQuote, 7000);


// ─── Init (gallery → reveal → lightbox) ───────────────────────────────────────
(async () => {
  const images = await fetchGalleryImages();
  buildGallery(images);

  // Scroll Reveal — set up after gallery DOM is ready
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .reveal-gallery').forEach(el => {
    revealObserver.observe(el);
  });

  // Lightbox — set up after gallery DOM is ready
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxCount = document.querySelector('.lightbox-counter');
  const photos        = Array.from(document.querySelectorAll('.photo-item img'));
  let currentIndex    = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.style.opacity = '0';
    lightboxImg.src = photos[index].src;
    lightboxImg.alt = photos[index].alt;
    lightboxImg.onload = () => { lightboxImg.style.opacity = '1'; };
    if (lightboxImg.complete) lightboxImg.style.opacity = '1';
    lightboxCount.textContent =
      `${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    document.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + photos.length) % photos.length;
    openLightbox(currentIndex);
  }

  document.querySelectorAll('.photo-item').forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
  document.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) navigate(delta < 0 ? 1 : -1);
  });
})();
