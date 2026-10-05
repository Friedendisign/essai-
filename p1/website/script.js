/**
 * Alex Morin — Portfolio Vidéaste
 * script.js — All interactive behaviour
 */

/* ============================================================
   CINEMATIC LOADER SEQUENCE
   ============================================================ */
(function initLoader() {
  const loader      = document.getElementById('loader');
  const countdown   = document.getElementById('countdown');
  const loaderSub   = document.getElementById('loaderSub');
  const clapperTop  = document.getElementById('clapperTop');
  const unlockHint  = document.getElementById('unlockHint');
  const heroContent = document.getElementById('heroContent');
  const scrollIndi  = document.getElementById('scrollIndicator');

  let count = 3;

  /**
   * Step 1: Clap the clapperboard once at the start
   */
  setTimeout(() => {
    clapperTop.classList.add('clap');
    loaderSub.textContent = 'ACTION';
  }, 500);

  /**
   * Step 2: Countdown 3 → 2 → 1 → GO
   */
  const tick = setInterval(() => {
    count--;
    if (count > 0) {
      countdown.textContent = count;
    } else {
      clearInterval(tick);
      countdown.textContent = 'GO';
      loaderSub.textContent = 'ALEX MORIN';
    }
  }, 800);

  /**
   * Step 3: Fade out loader, reveal hero
   */
  setTimeout(() => {
    // Show unlock hint briefly
    unlockHint.classList.add('show');

    setTimeout(() => {
      // Fade out loader
      loader.classList.add('fade-out');

      setTimeout(() => {
        loader.style.display = 'none';
        // Unlock scroll
        document.body.classList.remove('locked');
        document.body.classList.add('hero-revealed');
        unlockHint.style.display = 'none';

        // Reveal hero content
        heroContent.classList.add('visible');
        scrollIndi.classList.add('visible');
      }, 850);
    }, 700);
  }, 3200);
})();

/* ============================================================
   NAVIGATION — Scroll behaviour + Hamburger
   ============================================================ */
const nav        = document.getElementById('nav');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Sticky nav shadow on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close mobile menu on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    if (modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  }
});

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   SHOWREEL — Play interaction
   ============================================================ */
const videoWrapper  = document.getElementById('videoWrapper');
const playOverlay   = document.getElementById('playOverlay');

let isPlaying = false;

function togglePlay() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    videoWrapper.classList.add('playing');
    // Simulate playing state — pulse the background
    startFilmPulse();
  } else {
    videoWrapper.classList.remove('playing');
    stopFilmPulse();
  }
}

let filmInterval = null;
const filmStrip   = videoWrapper.querySelector('.film-strip');
const filmWords   = ['ALEX MORIN', 'MUSIC VIDEO', 'DIRECTOR', '2024', 'PARIS'];
let filmIdx = 0;

function startFilmPulse() {
  filmInterval = setInterval(() => {
    filmIdx = (filmIdx + 1) % filmWords.length;
    filmStrip.textContent = filmWords[filmIdx];
  }, 1800);
}

function stopFilmPulse() {
  clearInterval(filmInterval);
  filmStrip.textContent = 'ALEX MORIN';
}

videoWrapper.addEventListener('click', togglePlay);
videoWrapper.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePlay(); }
});

/* ============================================================
   SCRAPBOOK — Duplicate cards for seamless marquee
   ============================================================ */
(function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  // Clone the existing children and append for seamless loop
  const items = Array.from(track.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
})();

/* ============================================================
   PROJECT GRID — Filter + Modal
   ============================================================ */
const filterBtns    = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');
const modalBackdrop = document.getElementById('modalBackdrop');
const modal         = document.getElementById('modal');
const modalClose    = document.getElementById('modalClose');
const modalGenre    = document.getElementById('modalGenre');
const modalArtist   = document.getElementById('modalArtist');
const modalTrack    = document.getElementById('modalTrack');
const modalDesc     = document.getElementById('modalDesc');
const modalCredits  = document.getElementById('modalCredits');
const modalVideoBg  = document.getElementById('modalVideoBg');

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.genre === filter) {
        card.style.display = '';
        // Re-trigger reveal animation
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Open modal
function openModal(card) {
  const artist   = card.dataset.artist;
  const track    = card.dataset.track;
  const year     = card.dataset.year;
  const genre    = card.dataset.genreLabel;
  const desc     = card.dataset.desc;
  const credits  = JSON.parse(card.dataset.credits);

  // Populate modal
  modalGenre.textContent  = genre;
  modalArtist.textContent = artist;
  modalTrack.textContent  = `'${track}' — ${year}`;
  modalDesc.textContent   = desc;

  // Build credits grid
  modalCredits.innerHTML = credits.map(([role, name]) => `
    <div class="credit-item">
      <p class="credit-role">${role}</p>
      <p class="credit-name">${name}</p>
    </div>
  `).join('');

  // Set modal video background to match card color
  const thumbBg = getComputedStyle(card.querySelector('.project-thumb')).background;
  modalVideoBg.style.background = thumbBg;

  // Show backdrop
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalBackdrop.focus();
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

projectCards.forEach(card => {
  card.addEventListener('click', () => openModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
  });
});

modalClose.addEventListener('click', closeModal);

// Close on backdrop click (not on modal itself)
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

// Modal play button (just visual feedback)
const modalPlayBtn = document.getElementById('modalPlay');
modalPlayBtn.addEventListener('click', () => {
  modalPlayBtn.style.opacity = '0';
  modalPlayBtn.style.transform = 'scale(0.8)';
  // Show "playing" state in modal
  const playingMsg = document.createElement('p');
  playingMsg.style.cssText = 'color:rgba(255,255,255,0.5);font-size:0.7rem;letter-spacing:0.3em;text-transform:uppercase;';
  playingMsg.textContent = 'LECTURE EN COURS...';
  modalVideoBg.appendChild(playingMsg);
});

modalPlayBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); modalPlayBtn.click(); }
});

/* ============================================================
   CONTACT FORM — Validation + Success state
   ============================================================ */
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');

  let valid = true;

  // Clear previous errors
  [name, email, message].forEach(f => f.classList.remove('error'));

  // Validate name
  if (!name.value.trim()) {
    name.classList.add('error');
    valid = false;
  }

  // Validate email
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRx.test(email.value.trim())) {
    email.classList.add('error');
    valid = false;
  }

  // Validate message
  if (!message.value.trim()) {
    message.classList.add('error');
    valid = false;
  }

  if (!valid) {
    // Shake the button to indicate error
    const btn = contactForm.querySelector('.btn-submit');
    btn.style.transform = 'translateX(-6px)';
    setTimeout(() => { btn.style.transform = 'translateX(6px)'; }, 100);
    setTimeout(() => { btn.style.transform = ''; }, 200);
    return;
  }

  // Simulate async send
  const submitBtn = contactForm.querySelector('.btn-submit');
  submitBtn.textContent = 'Envoi en cours...';
  submitBtn.disabled = true;

  setTimeout(() => {
    // Hide all form rows
    contactForm.querySelectorAll('.form-group, .form-submit').forEach(row => {
      row.style.display = 'none';
    });

    // Show success
    formSuccess.classList.add('show');
  }, 1500);
});

// Real-time validation clear on input
['name','email','project','message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => el.classList.remove('error'));
  }
});

/* ============================================================
   SMOOTH SCROLL for nav links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   PILLAR HOVER — keyboard accessibility
   ============================================================ */
document.querySelectorAll('.pillar').forEach(pillar => {
  const link = pillar.querySelector('.pillar-link');
  pillar.addEventListener('click', () => {
    if (link) link.click();
  });
});

/* ============================================================
   PARALLAX — subtle hero depth on scroll
   ============================================================ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
  }
}, { passive: true });

/* ============================================================
   CURSOR — custom accent cursor dot (desktop only)
   ============================================================ */
if (window.matchMedia('(pointer:fine)').matches) {
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  dot.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: var(--accent, #FF4D00);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease, opacity 0.3s ease;
    mix-blend-mode: normal;
    opacity: 0;
  `;
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  ring.style.cssText = `
    position: fixed;
    width: 36px;
    height: 36px;
    border: 1px solid rgba(255,77,0,0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: transform 0.18s ease, width 0.25s ease, height 0.25s ease, opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(ring);

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .pillar, .video-wrapper');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '60px';
      ring.style.height = '60px';
      dot.style.width   = '4px';
      dot.style.height  = '4px';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      dot.style.width   = '8px';
      dot.style.height  = '8px';
    });
  });
}
