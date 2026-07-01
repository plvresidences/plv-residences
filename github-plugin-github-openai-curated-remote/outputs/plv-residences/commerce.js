let commerceApplied = false;

function revealCommerce() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(item => item.classList.add('visible'));
}

function applyCommerce() {
  if (commerceApplied || !document.querySelector('.services') || !window.PLV_COMMERCE) return;
  commerceApplied = true;

  const cards = document.querySelector('.cards');
  cards.innerHTML = PLV_COMMERCE.services;
  document.querySelector('.services').insertAdjacentHTML('afterend', PLV_COMMERCE.collection);
  document.querySelector('.header').insertAdjacentHTML('beforeend', PLV_COMMERCE.mega);

  const trigger = document.querySelector('[data-services-link]');
  const mega = document.querySelector('[data-mega-menu]');
  const closeButton = mega.querySelector('.mega-close');
  const setMega = open => {
    trigger.setAttribute('aria-expanded', String(open));
    mega.setAttribute('aria-hidden', String(!open));
    mega.classList.toggle('open', open);
    document.body.classList.toggle('mega-open', open);
  };

  trigger.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); setMega(!mega.classList.contains('open')); });
  closeButton.addEventListener('click', () => setMega(false));
  mega.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMega(false)));
  document.addEventListener('click', event => { if (!mega.contains(event.target) && event.target !== trigger) setMega(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMega(false); });
  revealCommerce();
}

function loadCommerce() {
  if (window.PLV_COMMERCE) return applyCommerce();
  if (document.querySelector('script[data-commerce-content]')) return;
  const script = document.createElement('script');
  script.src = 'commerce-content.js';
  script.dataset.commerceContent = 'true';
  script.onload = applyCommerce;
  document.head.appendChild(script);
}

document.addEventListener('plv:content-ready', loadCommerce);
if (document.querySelector('.services')) loadCommerce();
