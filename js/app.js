/* ════════════════════════════════════════════════════════════
   AMANTRAN DHABA — app.js
   Clean, professional JS — no gimmicks, no bad UX
════════════════════════════════════════════════════════════ */

/* ── Init Lucide Icons ──────────────────── */
lucide.createIcons();

/* ════════════ PRELOADER ════════════ */
(function(){
  const loader = document.getElementById('preloader');
  if(!loader) return;
  window.addEventListener('load', ()=>{
    setTimeout(()=>{
      loader.style.opacity = '0';
      loader.style.transition = 'opacity .5s ease';
      setTimeout(()=>{ loader.style.display='none'; initAll(); }, 500);
    }, 1200);
  });
  // fallback
  setTimeout(()=>{
    if(loader.style.display!=='none'){
      loader.style.opacity='0';
      loader.style.transition='opacity .5s ease';
      setTimeout(()=>{ loader.style.display='none'; initAll(); },500);
    }
  },3500);
})();

function initAll(){
  initSmoothScroll();
  initNavbar();
  initMobileMenu();
  initNavHighlight();
  initMenuTabs();
  initReviewsSwiper();
  initScrollAnimations();
  initRatingBars();
  initBookingForm();
  initTypewriter();
}

/* ════════════ SMOOTH SCROLL ════════════ */
function initSmoothScroll(){
  const NAV_H = 70; // match navbar height

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click', e=>{
      const id = link.getAttribute('href');
      if(!id || id==='#') return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior:'smooth' });
    });
  });
}

/* ════════════ NAVBAR ════════════ */
function initNavbar(){
  const nav = document.getElementById('navbar');
  if(!nav) return;
  const onScroll = ()=>{
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* ════════════ MOBILE MENU ════════════ */
function initMobileMenu(){
  const burger  = document.getElementById('burger');
  const menu    = document.getElementById('navMenu');
  const overlay = document.getElementById('mobOverlay');
  const closeBtn= document.getElementById('mobClose');
  if(!burger||!menu) return;

  function openMenu(){
    menu.classList.add('open');
    overlay?.classList.add('open');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden';
    lucide.createIcons(); // re-init icons for close btn
  }
  function closeMenu(){
    menu.classList.remove('open');
    overlay?.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', ()=>{
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  menu.querySelectorAll('.nav-link').forEach(link=>{
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e=>{
    if(e.key==='Escape') closeMenu();
  });
}

/* ════════════ NAV HIGHLIGHT ════════════ */
function initNavHighlight(){
  const sections = document.querySelectorAll('section[id], header[id]');
  const links    = document.querySelectorAll('.nav-link[data-nav]');
  if(!sections.length||!links.length) return;

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        links.forEach(l=>l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if(active) active.classList.add('active');
      }
    });
  }, {rootMargin:'-40% 0px -55% 0px'});

  sections.forEach(s=>io.observe(s));
}

/* ════════════ MENU TABS ════════════ */
function initMenuTabs(){
  const tabs   = document.querySelectorAll('.mtab');
  const cards  = document.querySelectorAll('.mcard');
  const scroll = document.getElementById('mtScroll');
  const btnL   = document.getElementById('mtL');
  const btnR   = document.getElementById('mtR');

  if(!tabs.length) return;

  function filterMenu(cat){
    cards.forEach(c=>{
      const show = cat==='all' || c.dataset.cat===cat;
      if(show){
        c.style.display='';
        c.style.animation='mfadeUp .35s ease forwards';
      } else {
        c.style.display='none';
      }
    });
  }

  tabs.forEach(tab=>{
    tab.addEventListener('click', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      filterMenu(tab.dataset.cat);
      if(scroll){
        const scrollLeft = tab.offsetLeft - scroll.offsetWidth/2 + tab.offsetWidth/2;
        scroll.scrollTo({left:scrollLeft,behavior:'smooth'});
      }
    });
  });

  if(btnL && scroll) btnL.addEventListener('click',()=>scroll.scrollBy({left:-160,behavior:'smooth'}));
  if(btnR && scroll) btnR.addEventListener('click',()=>scroll.scrollBy({left:160,behavior:'smooth'}));

  if(scroll && btnL && btnR){
    const checkOverflow = ()=>{
      const over = scroll.scrollWidth > scroll.clientWidth + 4;
      btnL.style.display = over ? 'flex' : 'none';
      btnR.style.display = over ? 'flex' : 'none';
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow, {passive:true});
  }
}

/* ════════════ REVIEWS SWIPER ════════════ */
function initReviewsSwiper(){
  if(typeof Swiper === 'undefined') return;
  new Swiper('.rev-swiper', {
    slidesPerView: 1,
    spaceBetween: 18,
    loop: true,
    autoplay:{ delay:4500, disableOnInteraction:false, pauseOnMouseEnter:true },
    pagination:{ el:'.rev-dots', clickable:true },
    navigation:{ prevEl:'.rev-prev', nextEl:'.rev-next' },
    breakpoints:{
      640:{ slidesPerView:2 },
      1024:{ slidesPerView:3 }
    }
  });
}

/* ════════════ SCROLL ANIMATIONS ════════════ */
function initScrollAnimations(){
  if(typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const tl = gsap.timeline({delay:.1});
  tl.from('.hero-tag',     {y:18,opacity:0,duration:.6,ease:'power2.out'})
    .from('.hero-bengali', {y:32,opacity:0,duration:.8,ease:'power3.out'},'-=.3')
    .from('.hero-eng',     {y:16,opacity:0,duration:.6,ease:'power2.out'},'-=.4')
    .from('.hero-p',       {y:14,opacity:0,duration:.6,ease:'power2.out'},'-=.35')
    .from('.hero-pills .pill',{y:10,opacity:0,duration:.5,stagger:.08,ease:'power2.out'},'-=.35')
    .from('.hero-btns .btn',  {y:10,opacity:0,duration:.5,stagger:.1, ease:'power2.out'},'-=.35');

  // Section reveals
  const revealGroups = [
    '.act-card','.about-left','.about-right',
    '.spec-card','.why-card','.mcard',
    '.gal-card','.ci','.form-card'
  ];

  revealGroups.forEach(sel=>{
    gsap.utils.toArray(sel).forEach((el,i)=>{
      gsap.from(el,{
        scrollTrigger:{ trigger:el, start:'top 88%', once:true },
        y:28, opacity:0, duration:.55, delay:i*0.05, ease:'power2.out'
      });
    });
  });

  // Headings + labels
  document.querySelectorAll('.sec-h2,.tag-line,.sec-sub,.about-stats,.about-tags').forEach(el=>{
    gsap.from(el,{
      scrollTrigger:{ trigger:el, start:'top 90%', once:true },
      y:20, opacity:0, duration:.6, ease:'power2.out'
    });
  });

  // Rating box
  const ratingBox = document.querySelector('.rating-box');
  if(ratingBox){
    gsap.from(ratingBox,{
      scrollTrigger:{ trigger:ratingBox, start:'top 85%', once:true },
      y:24, opacity:0, duration:.7, ease:'power2.out'
    });
  }
}

/* ════════════ RATING BARS ════════════ */
function initRatingBars(){
  const tracks = document.querySelectorAll('.bar-track');
  if(!tracks.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const fill = entry.target.querySelector('.bar-fill');
        if(fill) fill.classList.add('on');
        io.unobserve(entry.target);
      }
    });
  },{threshold:0.1});
  tracks.forEach(t=>io.observe(t));
}

/* ════════════ BOOKING FORM ════════════ */
function initBookingForm(){
  const form   = document.getElementById('bookingForm');
  const formOk = document.getElementById('formOk');
  if(!form) return;

  // Set min date to today
  const dateInput = document.getElementById('fd');
  if(dateInput){
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const nameEl  = document.getElementById('fn');
    const phoneEl = document.getElementById('fp');
    let valid = true;

    [nameEl, phoneEl].forEach(f=>{
      if(!f) return;
      if(!f.value.trim()){
        f.style.borderColor = 'var(--terra)';
        f.style.boxShadow   = '0 0 0 3px rgba(176,74,26,.1)';
        valid = false;
        f.addEventListener('input',()=>{
          f.style.borderColor='';
          f.style.boxShadow='';
        },{once:true});
      }
    });
    if(!valid) return;

    const nm = nameEl.value.trim();
    const ph = phoneEl.value.trim();
    const dt = document.getElementById('fd')?.value || '';
    const gs = document.getElementById('fg')?.value || '';
    const ms = document.getElementById('fm')?.value?.trim() || '';

    const msg = encodeURIComponent(
      `Hi, I'd like to book a table at Amantran Dhaba!\n\nName: ${nm}\nPhone: ${ph}`
      + (dt ? `\nDate: ${dt}` : '')
      + (gs ? `\nGuests: ${gs}` : '')
      + (ms ? `\nRequest: ${ms}` : '')
    );

    form.style.display = 'none';
    if(formOk){
      formOk.classList.add('show');
      lucide.createIcons();
    }

    setTimeout(()=>{
      window.open(`https://wa.me/919830365136?text=${msg}`, '_blank');
    }, 800);
  });
}

/* ════════════ TYPEWRITER ════════════ */
function initTypewriter(){
  const el = document.getElementById('htwText');
  if(!el) return;

  const items = [
    'Bengali Thali  ·  ₹350',
    'Chicken Biryani  ·  ₹220',
    'Fish Tikka Kabab  ·  ₹380',
    'Malai Cha  ·  ₹30',
    'Chicken Tikka Kabab  ·  ₹220',
    'Mutton Biryani  ·  ₹320',
    'Chilly Paneer  ·  ₹200',
  ];

  let itemIdx = 0, charIdx = 0, deleting = false;
  const PAUSE_END   = 1800;  // pause after full word
  const PAUSE_START = 380;   // pause before typing next
  const TYPE_SPEED  = 68;
  const DEL_SPEED   = 32;

  function tick(){
    const current = items[itemIdx];
    if(!deleting){
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if(charIdx === current.length){
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if(charIdx === 0){
        deleting = false;
        itemIdx = (itemIdx + 1) % items.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DEL_SPEED);
    }
  }
  setTimeout(tick, 900);
}

/* ════════════ Menu filter keyframe ════════════ */
const _s = document.createElement('style');
_s.textContent = `@keyframes mfadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(_s);