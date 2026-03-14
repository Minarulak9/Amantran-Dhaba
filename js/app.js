/* ═══════════════════════════════════════════════════════════════
   AMANTRAN DHABA — main.js
   GSAP + Swiper + Custom Animations
═══════════════════════════════════════════════════════════════ */

'use strict';

// ── GSAP Plugin Registration ─────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════ PRELOADER ═══════════════════════════════ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Minimum display time: 2.4s
  const minTime = 2400;
  const start = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minTime - elapsed);

    setTimeout(() => {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power3.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
          // Start hero animations after preloader leaves
          animateHeroEntrance();
        }
      });
    }, remaining);
  });

  // Lock scroll during preloader
  document.body.style.overflow = 'hidden';
})();

/* ═══════════════════ HERO ENTRANCE ══════════════════════════ */
function animateHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-eyebrow', { y: 30, opacity: 0, duration: 0.7 })
    .from('.hero-bengali', { y: 60, opacity: 0, duration: 0.9, clipPath: 'inset(100% 0 0 0)' }, '-=0.3')
    .from('.hero-sub-title', { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.badge', { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
    .from('.hero-ctas > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.3')
    .from('.hero-scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.1');

  // Parallax decorative blobs
  gsap.to('.hero-deco--1', {
    yPercent: -40,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });
  gsap.to('.hero-deco--2', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 }
  });
}

/* ═══════════════════ NAVBAR ══════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  navLinks.querySelectorAll('[data-close]').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  // Active link tracking
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const link = navLinks.querySelector(`[href="#${section.id}"]`);
      if (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
      }
    });
  }
})();

/* ═══════════════════ SCROLL REVEAL ══════════════════════════ */
(function initReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el, i) => {
    el.dataset.delay = i * 0.12;
    observer.observe(el);
  });
})();

/* ═══════════════════ ABOUT SECTION ══════════════════════════ */
(function initAboutAnimations() {
  gsap.from('.about-img-frame', {
    x: -60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%',
    }
  });
  gsap.from('.about-text > *', {
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 65%',
    }
  });
  gsap.from('.about-floating-card', {
    scale: 0.6,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
    delay: 0.4,
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%',
    }
  });
  gsap.from('.about-img-badge', {
    scale: 0.6,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
    delay: 0.6,
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%',
    }
  });

  // Stats count-up
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(el => {
    const txt = el.textContent.trim();
    // Only animate purely numeric values
    const num = parseFloat(txt.replace(/[^0-9.]/g, ''));
    const prefix = txt.match(/^[^0-9]*/)[0];
    const suffix = txt.match(/[^0-9.]*$/)[0];
    if (isNaN(num)) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo({ val: 0 }, { val: num }, {
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = prefix + (Number.isInteger(num)
              ? Math.round(this.targets()[0].val)
              : this.targets()[0].val.toFixed(0)) + suffix;
          }
        });
      }
    });
  });
})();

/* ═══════════════════ MENU FILTER ════════════════════════════ */
(function initMenuFilter() {
  const tabs = document.querySelectorAll('.menu-tab');
  const cards = document.querySelectorAll('.menu-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;
      let delay = 0;

      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        if (match) {
          card.style.display = '';
          gsap.fromTo(card,
            { opacity: 0, y: 20, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, delay: delay * 0.05, ease: 'power2.out' }
          );
          delay++;
        } else {
          gsap.to(card, {
            opacity: 0, y: -10, scale: 0.95, duration: 0.25,
            onComplete: () => { card.style.display = 'none'; }
          });
        }
      });
    });
  });

  // Entrance animation
  gsap.from('.menu-card', {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.06,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.menu-grid',
      start: 'top 80%',
    }
  });
})();

/* ═══════════════════ REVIEWS SWIPER ════════════════════════ */
(function initSwiper() {
  const swiperEl = document.querySelector('.reviews-swiper');
  if (!swiperEl) return;

  new Swiper('.reviews-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.reviews-pagination',
      clickable: true,
    },
    navigation: {
      prevEl: '.reviews-prev',
      nextEl: '.reviews-next',
    },
    breakpoints: {
      640: { slidesPerView: 2 },
      960: { slidesPerView: 3 },
    }
  });
})();

/* ═══════════════════ RATING BARS ANIMATION ═════════════════ */
(function initRatingBars() {
  const fills = document.querySelectorAll('.ro-bar-fill');
  if (!fills.length) return;

  ScrollTrigger.create({
    trigger: '.rating-overview',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      fills.forEach((fill, i) => {
        setTimeout(() => fill.classList.add('animated'), i * 120);
      });
    }
  });
})();

/* ═══════════════════ CONTACT FORM ══════════════════════════ */
(function initForm() {
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = form.querySelector('#fname').value.trim();
    const phone = form.querySelector('#fphone').value.trim();

    if (!name || !phone) {
      shakeField(!name ? '#fname' : '#fphone');
      return;
    }

    // Build WhatsApp message
    const date = form.querySelector('#fdate').value;
    const guests = form.querySelector('#fguests').value;
    const msg = form.querySelector('#fmsg').value.trim();

    const waText = encodeURIComponent(
      `Hi! I'd like to book a table at Amantran Dhaba.\n\n` +
      `Name: ${name}\nPhone: ${phone}` +
      (date ? `\nDate: ${date}` : '') +
      (guests ? `\nGuests: ${guests}` : '') +
      (msg ? `\nNote: ${msg}` : '')
    );

    // Animate button
    const btn = form.querySelector('.btn-form-submit');
    gsap.to(btn, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });

    setTimeout(() => {
      // Show success
      gsap.to(form, {
        opacity: 0, y: -20, duration: 0.4,
        onComplete: () => {
          form.style.display = 'none';
          success.classList.add('show');
          gsap.from(success, { opacity: 0, y: 20, duration: 0.5 });
        }
      });

      // Open WhatsApp
      window.open(`https://wa.me/919830365136?text=${waText}`, '_blank');
    }, 400);
  });

  function shakeField(selector) {
    const el = form.querySelector(selector);
    if (!el) return;
    el.focus();
    gsap.fromTo(el, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
    el.style.borderColor = '#e55';
    setTimeout(() => { el.style.borderColor = ''; }, 1500);
  }
})();

/* ═══════════════════ SMOOTH ANCHOR ════════════════════════ */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ═══════════════════ SECTION ENTRANCE GSAP ════════════════ */
(function initSectionAnimations() {
  // Menu section heading
  gsap.from('.menu-section .section-label, .menu-section .section-heading', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.menu-section', start: 'top 75%' }
  });

  // Reviews section heading
  gsap.from('.reviews-section .section-label, .reviews-section .section-heading', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.reviews-section', start: 'top 75%' }
  });

  // Quick actions stagger
  gsap.from('.qa-card', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.quick-actions', start: 'top 85%' }
  });

  // Contact section
  gsap.from('.contact-info > *', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-section', start: 'top 70%' }
  });
  gsap.from('.contact-form-card', {
    x: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-section', start: 'top 70%' }
  });
})();

/* ═══════════════════ CURSOR DOT (desktop) ══════════════════ */
(function initCursorDot() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(201,148,58,0.8);
    transform: translate(-50%,-50%);
    transition: transform 0.1s, opacity 0.3s, background 0.2s;
    mix-blend-mode: difference;
  `;
  const ring = document.createElement('div');
  ring.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9997;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid rgba(201,148,58,0.5);
    transform: translate(-50%,-50%);
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s, height 0.25s, opacity 0.3s;
  `;
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    // Ring follows with slight lag via rAF
  });

  // Interactive elements scale ring up
  document.querySelectorAll('a, button, .menu-card, .review-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(196,98,45,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(201,148,58,0.5)';
    });
  });

  // Smooth ring follow
  function followRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(followRing);
  }
  followRing();
})();

/* ═══════════════════ PARALLAX HERO TEXT ════════════════════ */
(function initHeroParallax() {
  gsap.to('.hero-content', {
    yPercent: 35,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });
})();