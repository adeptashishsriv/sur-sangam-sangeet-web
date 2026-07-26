/* ============================================
   SUR SANGAM SANGEET KALA KENDRA — SCRIPTS
   ============================================ */

/* ============================================
   MUSICAL THEMES — definitions
   ============================================ */
const THEMES = {
  'raga-sunrise': {
    label: 'Raga Sunrise',
    icon: '🌅',
    // colours used for the falling symbols burst
    colors: ['#E8621A','#D4A017','#F0C040','#FFFFFF','#FFD700','#FF6B35'],
    symbols: ['♩','♪','♫','♬','𝄞','🎵','🎶','☀️','❖','✦'],
  },
  'raatri-raag': {
    label: 'Raatri Raag',
    icon: '🌙',
    colors: ['#7B9FFF','#B8CEFF','#D0E4FF','#FFFFFF','#4A90D9','#9DB8FF'],
    symbols: ['♩','♪','♫','♬','𝄞','🌙','⭐','✨','🌟','𝄢'],
  },
  'vrindavan': {
    label: 'Vrindavan',
    icon: '🪈',
    colors: ['#4CAF50','#8BC34A','#CCFF90','#FFFFFF','#A5D6A7','#69F0AE'],
    symbols: ['♩','♪','♫','♬','🍃','🌿','🌱','✿','❀','𝄞'],
  },
  'thumri-rose': {
    label: 'Thumri Rose',
    icon: '🌸',
    colors: ['#E91E8C','#FF80AB','#FFD6EC','#FFFFFF','#FF4081','#F48FB1'],
    symbols: ['♩','♪','♫','♬','🌸','🌺','✿','❁','❤','𝄞'],
  },
  'monsoon-malhar': {
    label: 'Monsoon Malhar',
    icon: '🌧️',
    colors: ['#B0BEC5','#ECEFF1','#78909C','#FFFFFF','#80CBC4','#CFD8DC'],
    symbols: ['♩','♪','♫','♬','💧','🌧','⛈','🌊','❄','𝄞'],
  },
};

/* ============================================
   FLOATING MUSICAL NOTES (hero background)
   ============================================ */
(function createFloatingNotes() {
  const container = document.getElementById('floatingNotes');
  if (!container) return;
  const notes = ['♩','♪','♫','♬','𝄞','𝄢','🎵','🎶'];
  for (let i = 0; i < 22; i++) {
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    note.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${0.9 + Math.random() * 1.4}rem;
      animation-duration: ${8 + Math.random() * 14}s;
      animation-delay: ${Math.random() * 10}s;
      color: rgba(212,160,23,0.55);
    `;
    container.appendChild(note);
  }
})();

/* ============================================
   FALLING SYMBOLS BURST — triggered on theme change
   ============================================ */
function triggerFallingSymbols(themeKey) {
  const overlay = document.getElementById('themeFallOverlay');
  if (!overlay) return;

  const theme = THEMES[themeKey];
  if (!theme) return;

  // Clear any leftover symbols from previous burst
  overlay.innerHTML = '';

  const COUNT = 55;
  const symbols = theme.symbols;
  const colors  = theme.colors;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'fall-sym';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const x        = Math.random() * 100;          // % from left
    const duration = 1.4 + Math.random() * 2.2;    // seconds
    const delay    = Math.random() * 1.0;           // seconds stagger
    const size     = 1.0 + Math.random() * 2.0;    // rem
    const color    = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      left: ${x}vw;
      font-size: ${size}rem;
      color: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      text-shadow: 0 0 12px ${color}88;
    `;

    overlay.appendChild(el);

    // Remove DOM node after animation finishes to keep it clean
    const totalMs = (duration + delay) * 1000 + 200;
    setTimeout(() => el.remove(), totalMs);
  }
}

/* ============================================
   THEME PICKER
   ============================================ */
const html         = document.documentElement;
const pickerBtn    = document.getElementById('themePickerBtn');
const pickerPanel  = document.getElementById('themePickerPanel');
const themeOptions = document.querySelectorAll('.theme-option');

function applyTheme(themeKey, burst = true) {
  if (!THEMES[themeKey]) themeKey = 'raga-sunrise';

  // 1. Set data-theme on <html>
  html.setAttribute('data-theme', themeKey);

  // 2. Update picker button icon
  if (pickerBtn) pickerBtn.textContent = THEMES[themeKey].icon;

  // 3. Mark active option
  themeOptions.forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === themeKey);
  });

  // 4. Re-tint hero floating notes to match new theme
  const heroNotes = document.querySelectorAll('#floatingNotes .note');
  const themeColors = THEMES[themeKey].colors;
  heroNotes.forEach(n => {
    const c = themeColors[Math.floor(Math.random() * themeColors.length)];
    n.style.color = c + 'AA';
  });

  // 5. Persist
  localStorage.setItem('ss-theme', themeKey);

  // 6. Burst
  if (burst) triggerFallingSymbols(themeKey);
}

// Open / close panel
if (pickerBtn) {
  pickerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    pickerPanel.classList.toggle('open');
  });
}

// Select a theme
themeOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const chosen = opt.dataset.theme;
    pickerPanel.classList.remove('open');
    applyTheme(chosen, true);
  });
});

// Close panel on outside click
document.addEventListener('click', (e) => {
  if (pickerPanel && !pickerPanel.contains(e.target) && e.target !== pickerBtn) {
    pickerPanel.classList.remove('open');
  }
});

// Keyboard: close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') pickerPanel && pickerPanel.classList.remove('open');
});

// Boot: load saved theme (no burst on page load)
const savedTheme = localStorage.getItem('ss-theme') || 'raga-sunrise';
applyTheme(savedTheme, false);

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  updateScrollProgress();
}, { passive: true });

/* ============================================
   HAMBURGER MENU
   ============================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ============================================
   BACK TO TOP
   ============================================ */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   STATS COUNTER ANIMATION
   ============================================ */
function animateCounter(el, target, duration) {
  let start = 0;
  const step  = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-number').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target), 1800);
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots   = document.querySelectorAll('.dot');

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
});
setInterval(() => goToSlide(currentSlide + 1), 5000);

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.course-card, .prayag-card, .perf-card, .instrument-item, .gallery-item, .highlight-item'
).forEach(el => revealObserver.observe(el));

/* ============================================
   CONTACT FORM — Formspree success watch
   ============================================ */
(function watchFormspreeSuccess() {
  const successBanner = document.querySelector('[data-fs-success]');
  const form = document.getElementById('contactForm');
  if (!successBanner || !form) return;

  const observer = new MutationObserver(() => {
    const isVisible = !successBanner.hasAttribute('hidden') &&
                      successBanner.style.display !== 'none';
    if (isVisible) {
      setTimeout(() => {
        successBanner.setAttribute('hidden', '');
        successBanner.style.display = 'none';
        form.reset();
        const btn = form.querySelector('[data-fs-submit-btn]');
        if (btn) btn.disabled = false;
      }, 5000);
    }
  });

  observer.observe(successBanner, { attributes: true, childList: true, subtree: true });
})();

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
const sections      = document.querySelectorAll('section[id]');
const navAnchorLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchorLinks.forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });
