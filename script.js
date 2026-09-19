(() => {
  /* =========================
     FEZOJ — MOBILE NAVIGATION
     ========================= */
  const drawer = document.querySelector('.mobile-drawer');
  const menuButtons = document.querySelectorAll('.hamburger');
  const closeButton = document.querySelector('.drawer-close');
  const backdrop = document.querySelector('.drawer-backdrop');

  const setMenu = (open) => {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    menuButtons.forEach(btn => btn.setAttribute('aria-expanded', String(open)));
  };

  menuButtons.forEach(btn => btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    setMenu(!open);
  }));
  closeButton?.addEventListener('click', () => setMenu(false));
  backdrop?.addEventListener('click', () => setMenu(false));
  drawer?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });

  /* =========================
     FEZOJ — REVEAL ON SCROLL
     ========================= */
  const revealItems = document.querySelectorAll('.reveal');
  const reducedMotionForReveal = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotionForReveal.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  }

  /* =========================
     FEZOJ — GLOBAL CURSOR TRAIL
     A restrained trail of tiny four-point sparkles follows the pointer
     across every page. It is canvas-based so it stays lightweight.
     ========================= */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-spark-layer';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let mouse = { x: -100, y: -100, active: false };
  let lastX = -100;
  let lastY = -100;
  let lastSpawn = 0;
  const particles = [];

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const spawn = (x, y, intensity = 1) => {
    const count = intensity > 1 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 7 + Math.random() * 13;
      particles.push({
        x: x + (Math.random() - .5) * 7,
        y: y + (Math.random() - .5) * 7,
        vx: Math.cos(angle) * (0.18 + Math.random() * .35),
        vy: Math.sin(angle) * (0.18 + Math.random() * .35),
        driftX: Math.cos(angle) * distance,
        driftY: Math.sin(angle) * distance,
        size: 1.1 + Math.random() * 1.9,
        life: 0,
        maxLife: 34 + Math.random() * 24,
        rotation: Math.random() * Math.PI,
        color: Math.random() > .35 ? '255,116,24' : '7,26,41'
      });
    }
  };

  const onPointerMove = event => {
    const x = event.clientX;
    const y = event.clientY;
    mouse.x = x;
    mouse.y = y;
    mouse.active = true;

    const dx = x - lastX;
    const dy = y - lastY;
    const distance = Math.hypot(dx, dy);
    const now = performance.now();

    // More movement creates a slightly denser, still restrained trail.
    if (distance > 3 && now - lastSpawn > 24) {
      spawn(x, y, distance > 18 ? 1.25 : 1);
      lastSpawn = now;
    }

    lastX = x;
    lastY = y;
  };

  const onPointerLeave = () => { mouse.active = false; };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', onPointerLeave, { passive: true });

  const drawSpark = p => {
    const progress = p.life / p.maxLife;
    const opacity = progress < .15 ? progress / .15 : 1 - ((progress - .15) / .85);
    const alpha = Math.max(0, opacity) * .62;
    const arm = p.size * (1.8 - progress * .55);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation + progress * .6);
    ctx.beginPath();
    ctx.moveTo(0, -arm * 2.2);
    ctx.lineTo(arm * .55, -arm * .55);
    ctx.lineTo(arm * 2.2, 0);
    ctx.lineTo(arm * .55, arm * .55);
    ctx.lineTo(0, arm * 2.2);
    ctx.lineTo(-arm * .55, arm * .55);
    ctx.lineTo(-arm * 2.2, 0);
    ctx.lineTo(-arm * .55, -arm * .55);
    ctx.closePath();
    ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
    ctx.fill();
    ctx.restore();
  };

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += 1;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= .985;
      p.vy *= .985;
      drawSpark(p);
      if (p.life >= p.maxLife) particles.splice(i, 1);
    }

    requestAnimationFrame(animate);
  };

  animate();

  /* Keep the original logo interaction: a slightly brighter micro-burst
     when the pointer enters the FEZOJ mark. */
  document.querySelectorAll('.logo-brand').forEach(logo => {
    logo.addEventListener('pointerenter', event => {
      const rect = logo.getBoundingClientRect();
      const x = event.clientX || rect.left + rect.width * .65;
      const y = event.clientY || rect.top + rect.height * .5;
      for (let i = 0; i < 5; i++) spawn(x + (Math.random() - .5) * 16, y + (Math.random() - .5) * 10, 1.5);
    }, { passive: true });
  });
})();
