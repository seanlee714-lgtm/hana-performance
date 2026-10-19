(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  // Home intro: type the northstar line, hold, then fade to the site. Click or any key skips.
  const intro = document.querySelector('.intro');
  if (intro && document.documentElement.classList.contains('intro-on')) {
    const line = intro.dataset.text;
    const out = intro.querySelector('.intro__text');
    let i = 0;
    let done = false;
    document.body.style.overflow = 'hidden';
    const finish = () => {
      if (done) return;
      done = true;
      out.textContent = line;
      intro.classList.add('is-done');
      document.body.style.overflow = '';
      setTimeout(() => intro.remove(), 900);
    };
    const type = () => {
      if (done) return;
      out.textContent = line.slice(0, ++i);
      if (i < line.length) setTimeout(type, line[i - 1] === ',' ? 380 : 75);  // beat after the comma
      else setTimeout(finish, 1500);
    };
    setTimeout(type, 600);
    intro.addEventListener('click', finish);
    window.addEventListener('keydown', finish, { once: true });
  }

  // Full-bleed text sections (brand, join) on narrow screens: make the section tall enough
  // that all the text ends in the top part of the frame (data-text-fits, default 55%),
  // keeping the runner at the bottom of the footage clear
  document.querySelectorAll('.about').forEach((section) => {
    const body = section.querySelector('.about__body');
    const fits = parseFloat(section.dataset.textFits) || 0.55;
    const size = () => {
      if (window.innerWidth > 1024) { section.style.removeProperty('--about-h'); return; }
      const textBottom = body.offsetTop + body.offsetHeight;
      const h = Math.max(window.innerHeight, textBottom / fits);
      section.style.setProperty('--about-h', `${Math.ceil(h)}px`);
    };
    size();
    window.addEventListener('resize', size);
    document.fonts?.ready.then(size);
  });

  // Arriving from another page with a #section link (e.g. index.html#join): jump there
  // once the layout has settled, since the browser's own jump can land before videos size
  const target = location.hash && document.querySelector(location.hash);
  if (target) {
    window.addEventListener('load', () => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }

  // Reveal on scroll
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revealer.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

  // Videos: load lazily, play only while on screen
  const videos = document.querySelectorAll('video');
  const player = new IntersectionObserver((entries) => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (v.hasAttribute('data-lazy')) { v.preload = 'auto'; v.removeAttribute('data-lazy'); }
        if (!reduceMotion) v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px' });
  videos.forEach((v) => {
    v.muted = true;
    if (reduceMotion) v.removeAttribute('autoplay');
    player.observe(v);
  });

  // Email signup
  const form = document.getElementById('signup');
  if (!form) return;
  const input = document.getElementById('email');
  const msg = document.getElementById('signup-msg');
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    msg.classList.remove('is-error');

    if (!isEmail(email)) {
      input.setAttribute('aria-invalid', 'true');
      msg.classList.add('is-error');
      msg.textContent = 'Enter a valid email address.';
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');

    const endpoint = form.dataset.endpoint;
    const button = form.querySelector('button');
    button.disabled = true;
    msg.textContent = 'Sending…';

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email, _subject: 'New HANA signup' }),
        });
        if (!res.ok) throw new Error(res.status);
      } else {
        console.warn('[HANA] No data-endpoint set on #signup — email was not stored.');
      }
      // Keep the field open so the next person can sign up too
      form.reset();
      msg.textContent = 'Thanks — you’re signed up. 多謝';
    } catch {
      msg.classList.add('is-error');
      msg.textContent = 'Something went wrong. Try again.';
    } finally {
      button.disabled = false;
    }
  });
})();
