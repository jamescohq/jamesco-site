const menu=document.getElementById('menu'), nav=document.getElementById('nav');menu?.addEventListener('click',()=>{let open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});let filter='All';const input=document.getElementById('search'), cards=[...document.querySelectorAll('.exp-card[data-category]')], empty=document.getElementById('empty');function applyFilter(){if(!input)return;let term=input.value.trim().toLowerCase(),count=0;cards.forEach(card=>{let show=(filter==='All'||card.dataset.category===filter)&&card.textContent.toLowerCase().includes(term);card.hidden=!show;if(show)count++});empty.hidden=count!==0}document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===button));applyFilter()}));input?.addEventListener('input',applyFilter);

// ---- Interaction and motion layer (2026-11-26) ----
(() => {
  const root = document.documentElement;
  const header = document.querySelector('header');
  const main = document.querySelector('main');

  // Skip link for keyboard and screen-reader users.
  if (main) {
    if (!main.id) main.id = 'main';
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#' + main.id;
    skip.textContent = 'Skip to content';
    document.body.prepend(skip);
  }

  // Mark the current page in the navigation.
  const here = location.pathname.replace(/\/$/, '/index.html');
  document.querySelectorAll('#nav a').forEach(a => {
    const path = new URL(a.href, location.href).pathname;
    const section = path.split('/')[1];
    if (path === here || (section && section !== 'index.html' && !section.endsWith('.html') && here.startsWith('/' + section + '/'))) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // Mobile menu: swap icon, label, and close on link, Escape or outside tap.
  if (menu && nav) {
    const sync = () => {
      const open = nav.classList.contains('open');
      menu.textContent = open ? '✕' : '☰';
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    const close = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); sync(); };
    menu.addEventListener('click', sync);
    nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); menu.focus(); } });
    document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target) && !menu.contains(e.target)) close(); });
  }

  // Header depth and back-to-top button.
  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.textContent = '↑';
  toTop.addEventListener('click', () => window.scrollTo({ top: 0 }));
  document.body.append(toTop);
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal sections as they scroll into view.
  if (!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll(
    '.intro>div, .section-heading, .card-grid>.exp-card, .property-feature>div, .owner-grid>div, ' +
    '.detail-body>*, .guide-layout>*, .guide-card, .service-grid>article, .notice, .filter-head, .foot>div'
  );
  root.classList.add('js');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      io.unobserve(el);
      // Clear the stagger so later hover effects respond instantly.
      setTimeout(() => { el.style.transitionDelay = ''; }, 1300);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach(el => {
    // Stagger siblings inside grids so cards cascade in.
    const siblings = el.parentElement ? [...el.parentElement.children] : [];
    const index = Math.min(siblings.indexOf(el), 5);
    if (index > 0) el.style.transitionDelay = (index * 80) + 'ms';
    el.classList.add('reveal');
    io.observe(el);
  });
})();
