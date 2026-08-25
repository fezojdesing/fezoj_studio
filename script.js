const nav = document.getElementById('nav');
const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));
toggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
