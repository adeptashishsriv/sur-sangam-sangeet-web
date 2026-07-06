/* ============================================
   SUR SANGAM SANGEET KALA KENDRA — SCRIPTS
   ============================================ */

// ---- Floating Musical Notes ----
(function createFloatingNotes() {
  const container = document.getElementById('floatingNotes');
  if (!container) return;
  const notes = ['♩', '♪', '♫', '♬', '𝄞', '𝄢', '🎵', '🎶'];
  for (let i = 0; i < 22; i++) {
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    note.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${0.9 + Math.random() * 1.4}rem;
      animation-duration: ${8 + Math.random() * 14}s;
      animation-delay: ${Math.random() * 10}s;
      color: ${Math.random() > 0.5 ? 'rgba(212,160,23,0.55)' : 'rgba(232,98,26,0.45)'};
    `;
    container.appendChild(note);
  }
})();

// ---- Navbar Scroll Effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// ---- Hamburger Menu ----
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

// ---- Back to Top ----
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Stats Counter Animation ----
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
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

// ---- Testimonials Slider ----
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

// Auto-advance slider
setInterval(() => goToSlide(currentSlide + 1), 5000);

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.course-card, .faculty-card, .perf-card, .instrument-item, .gallery-item, .highlight-item'
).forEach(el => revealObserver.observe(el));

// ---- Contact Form (handled by Formspree Ajax SDK) ----
// Auto-hide the success banner after 5 seconds and reset the form so it's
// ready for a new submission.
(function watchFormspreeSuccess() {
  const successBanner = document.querySelector('[data-fs-success]');
  const form = document.getElementById('contactForm');
  if (!successBanner || !form) return;

  // Use a MutationObserver to detect when Formspree shows the success banner
  const observer = new MutationObserver(() => {
    const isVisible = !successBanner.hasAttribute('hidden') &&
                      successBanner.style.display !== 'none';
    if (isVisible) {
      setTimeout(() => {
        // Hide the banner
        successBanner.setAttribute('hidden', '');
        successBanner.style.display = 'none';
        // Reset all form fields
        form.reset();
        // Re-enable the submit button in case Formspree left it disabled
        const btn = form.querySelector('[data-fs-submit-btn]');
        if (btn) { btn.disabled = false; }
      }, 5000); // hide after 5 seconds
    }
  });

  observer.observe(successBanner, { attributes: true, childList: true, subtree: true });
})();

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
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
