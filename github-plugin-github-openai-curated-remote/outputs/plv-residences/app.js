const inject = document.createElement('script');
inject.src = 'content.js';
inject.onload = () => {
  document.querySelector('[data-content]').innerHTML = window.PLV_CONTENT;
  document.dispatchEvent(new CustomEvent('plv:content-ready'));
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .1, rootMargin: '0px 0px -35px' });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('visible'));
};
document.head.appendChild(inject);

const header = document.querySelector('[data-header]');
const button = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
const setMenu = open => {
  button.setAttribute('aria-expanded', String(open));
  button.querySelector('.sr').textContent = open ? 'Close menu' : 'Open menu';
  nav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
};
button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a:not([data-services-link])').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 30), { passive: true });
