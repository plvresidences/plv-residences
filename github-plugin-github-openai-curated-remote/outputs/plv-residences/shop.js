const shopSources = ['shop-resort.js', 'shop-fitness.js', 'shop-interiors.js', 'brand-equipment.js'];
const loadScript = src => new Promise((resolve, reject) => {
  const script = document.createElement('script'); script.src = src; script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
});

Promise.all(shopSources.map(loadScript)).then(() => {
  document.querySelector('[data-shop-content]').innerHTML = PLV_SHOP_RESORT + PLV_SHOP_FITNESS + PLV_SHOP_INTERIORS;
  document.querySelector('[data-shop-content]').insertAdjacentHTML('afterend', PLV_BRANDS);
  initialiseShop();
});

function initialiseShop() {
  const bag = [];
  const drawer = document.querySelector('[data-bag]');
  const backdrop = document.querySelector('[data-bag-backdrop]');
  const itemArea = document.querySelector('[data-bag-items]');
  const count = document.querySelector('[data-cart-count]');
  const total = document.querySelector('[data-bag-total]');
  const order = document.querySelector('[data-order-button]');
  const toast = document.querySelector('[data-toast]');

  const setDrawer = open => { drawer.classList.toggle('open', open); backdrop.classList.toggle('open', open); drawer.setAttribute('aria-hidden', String(!open)); };
  const render = () => {
    count.textContent = bag.length;
    total.textContent = `US$${bag.reduce((sum, item) => sum + item.price, 0).toLocaleString()}`;
    order.disabled = bag.length === 0;
    itemArea.innerHTML = bag.length ? bag.map((item, index) => `<div class="bag-line"><div><span>PLV Collection</span><h3>${item.name}</h3><strong>US$${item.price.toLocaleString()}</strong></div><button type="button" data-remove="${index}">Remove</button></div>`).join('') : '<p>Your bag is currently empty.</p>';
  };
  const showToast = message => { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); };

  document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => {
    bag.push({ name: button.dataset.add, price: Number(button.dataset.price) }); render(); showToast(`${button.dataset.add} added to your bag`);
  }));
  itemArea.addEventListener('click', event => { const remove = event.target.closest('[data-remove]'); if (remove) { bag.splice(Number(remove.dataset.remove), 1); render(); } });
  document.querySelector('[data-bag-button]').addEventListener('click', () => setDrawer(true));
  document.querySelector('[data-bag-close]').addEventListener('click', () => setDrawer(false));
  backdrop.addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setDrawer(false); });
  order.addEventListener('click', () => {
    const lines = bag.map(item => `${item.name} - US$${item.price.toLocaleString()}`).join('\n');
    location.href = `mailto:orders@plvresidences.com?subject=${encodeURIComponent('PLV Collection order request')}&body=${encodeURIComponent(`Please prepare secure checkout for:\n\n${lines}\n\nEstimated total: ${total.textContent}`)}`;
  });
  render();
}
