// CONFIG + PRODUCT DATA

const CONFIG = {
  saleEndDate: '2026-05-01T23:59:59',
  basePrice: 35.99,
  tiers: [
    { min: 4, discount: 0.40, label: '40% OFF — BEST DEAL' },
    { min: 3, discount: 0.35, label: '35% OFF' },
    { min: 2, discount: 0.30, label: '30% OFF' },
  ],
  gifts: [
    { min: 2, title: '4x Mystery Sampler Sticks', value: '$9.95 value' },
    { min: 3, title: 'Free 24oz Shaker Cup', value: '$14.95 value' },
  ],
};

const PRODUCTS = [
  { id: 1, title: 'Placeholder Flavor 1', image: '', badge: 'new', price: 35.99, rating: 4.8, stock: 24 },
  { id: 2, title: 'Placeholder Flavor 2', image: '', badge: 'bestseller', price: 35.99, rating: 4.9, stock: 8 },
  { id: 3, title: 'Placeholder Flavor 3', image: '', badge: '', price: 35.99, rating: 4.7, stock: 31 },
  { id: 4, title: 'Placeholder Flavor 4', image: '', badge: 'lowstock', price: 35.99, rating: 4.8, stock: 5 },
  { id: 5, title: 'Placeholder Flavor 5', image: '', badge: 'new', price: 35.99, rating: 4.6, stock: 18 },
  { id: 6, title: 'Placeholder Flavor 6', image: '', badge: 'bestseller', price: 35.99, rating: 4.9, stock: 12 },
];

const quantities = {};
PRODUCTS.forEach(p => { quantities[p.id] = 0; });

// PRODUCT CARD RENDERING

function getBadgeHTML(badge) {
  if (!badge) return '';
  const labels = { new: 'NEW', bestseller: 'BEST SELLER', lowstock: 'LOW STOCK' };
  const label = labels[badge] || badge.toUpperCase();
  return '<span class="product-card__badge product-card__badge--' + badge + '">' + label + '</span>';
}

function renderStars(rating) {
  return '&#9733;'.repeat(5) + '<span>' + rating + '/5</span>';
}

function renderProductCard(product) {
  var qty = quantities[product.id];
  var imageContent = product.image
    ? '<img class="product-card__image" src="' + product.image + '" alt="' + product.title + '">'
    : '<span class="product-card__image-placeholder">[Product Image]</span>';

  return '<div class="product-card" data-product-id="' + product.id + '">' +
    '<div class="product-card__image-wrap">' +
      getBadgeHTML(product.badge) +
      imageContent +
    '</div>' +
    '<div class="product-card__title">' + product.title + '</div>' +
    '<div class="product-card__rating">' + renderStars(product.rating) + '</div>' +
    '<div class="product-card__price">' +
      '<span class="product-card__price-original">$' + product.price.toFixed(2) + '</span>' +
      '<span class="product-card__price-sale" data-base-price="' + product.price + '">$' + product.price.toFixed(2) + '</span>' +
    '</div>' +
    (product.badge === 'lowstock' ? '<div class="product-card__stock">Low Stock: ' + product.stock + ' LEFT</div>' : '') +
    '<div class="product-card__actions">' +
      '<div class="product-card__qty">' +
        '<button class="product-card__qty-btn" data-action="minus" data-id="' + product.id + '">&#8722;</button>' +
        '<span class="product-card__qty-count" id="qty-' + product.id + '">' + qty + '</span>' +
        '<button class="product-card__qty-btn" data-action="plus" data-id="' + product.id + '">+</button>' +
      '</div>' +
      '<button class="product-card__add-btn" data-id="' + product.id + '">Add to Bundle</button>' +
    '</div>' +
  '</div>';
}

function renderAllProducts() {
  var grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(renderProductCard).join('');
}

// COUNTDOWN TIMER

function startCountdown() {
  var hoursEl = document.getElementById('countdown-hours');
  var minutesEl = document.getElementById('countdown-minutes');
  var secondsEl = document.getElementById('countdown-seconds');
  if (!hoursEl || !minutesEl || !secondsEl) return;

  var endDate = new Date(CONFIG.saleEndDate).getTime();

  function update() {
    var now = Date.now();
    var diff = endDate - now;

    if (diff <= 0) {
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      var badge = document.querySelector('.hero__badge');
      if (badge) badge.textContent = 'SALE ENDED';
      return;
    }

    var hours = Math.floor(diff / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// STICKY FOOTER CONTENT (defined before updateBundle since updateBundle calls it)

function updateStickyFooterContent(total, tier, discount) {
  var itemsEl = document.getElementById('footer-items');
  var originalEl = document.getElementById('footer-original');
  var discountedEl = document.getElementById('footer-discounted');
  var savingsEl = document.getElementById('footer-savings');
  var tierEl = document.getElementById('footer-tier');
  var giftsEl = document.getElementById('footer-gifts');

  if (!itemsEl) return;

  var originalTotal = total * CONFIG.basePrice;
  var discountedTotal = originalTotal * (1 - discount);
  var savings = originalTotal - discountedTotal;

  itemsEl.textContent = total + (total === 1 ? ' item' : ' items');
  originalEl.textContent = '$' + originalTotal.toFixed(2);
  discountedEl.textContent = '$' + discountedTotal.toFixed(2);

  if (savings > 0) {
    savingsEl.textContent = 'You save $' + savings.toFixed(2);
  } else {
    savingsEl.textContent = '';
  }

  if (tier) {
    tierEl.textContent = tier.label;
    tierEl.style.display = '';
  } else {
    tierEl.style.display = 'none';
  }

  var unlockedGifts = CONFIG.gifts
    .filter(function(g) { return total >= g.min; })
    .map(function(g) { return g.title; });
  giftsEl.textContent = unlockedGifts.length > 0
    ? '+ ' + unlockedGifts.join(', ')
    : '';
}

// BUNDLE CALCULATOR

function getTotalQty() {
  return Object.values(quantities).reduce(function(sum, q) { return sum + q; }, 0);
}

function getActiveTier() {
  var total = getTotalQty();
  for (var i = 0; i < CONFIG.tiers.length; i++) {
    if (total >= CONFIG.tiers[i].min) return CONFIG.tiers[i];
  }
  return null;
}

function updateBundle() {
  var total = getTotalQty();
  var tier = getActiveTier();
  var discount = tier ? tier.discount : 0;

  // Update sale prices on all cards
  var saleEls = document.querySelectorAll('.product-card__price-sale');
  saleEls.forEach(function(el) {
    var base = parseFloat(el.dataset.basePrice);
    var sale = base * (1 - discount);
    el.textContent = '$' + sale.toFixed(2);
  });

  // Highlight active tier card
  document.querySelectorAll('.tier-card').forEach(function(card) {
    var min = parseInt(card.dataset.tierMin, 10);
    card.classList.toggle('tier-card--active', tier && min === tier.min);
  });

  // Update gift ladder
  CONFIG.gifts.forEach(function(gift, i) {
    var giftEl = document.getElementById('gift-' + i);
    if (giftEl) {
      giftEl.classList.toggle('gift-card--unlocked', total >= gift.min);
    }
  });

  // Update sticky footer
  updateStickyFooterContent(total, tier, discount);
}

// QUANTITY SELECTORS

function handleQuantityChange(productId, action) {
  if (action === 'plus') {
    quantities[productId]++;
  } else if (action === 'minus' && quantities[productId] > 0) {
    quantities[productId]--;
  }

  var countEl = document.getElementById('qty-' + productId);
  if (countEl) countEl.textContent = quantities[productId];

  updateBundle();
}

function setupQuantityListeners() {
  document.addEventListener('click', function(e) {
    var qtyBtn = e.target.closest('.product-card__qty-btn');
    if (qtyBtn) {
      var id = parseInt(qtyBtn.dataset.id, 10);
      handleQuantityChange(id, qtyBtn.dataset.action);
      return;
    }

    var addBtn = e.target.closest('.product-card__add-btn');
    if (addBtn) {
      var id = parseInt(addBtn.dataset.id, 10);
      quantities[id]++;
      var countEl = document.getElementById('qty-' + id);
      if (countEl) countEl.textContent = quantities[id];
      updateBundle();
    }
  });
}

// STICKY FOOTER VISIBILITY

function setupStickyFooter() {
  var footer = document.getElementById('sticky-footer');
  var hero = document.getElementById('hero');
  if (!footer || !hero) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var hasItems = getTotalQty() > 0;
      if (!entry.isIntersecting && hasItems) {
        footer.classList.add('sticky-footer--visible');
        document.body.classList.add('body--has-footer');
      } else {
        footer.classList.remove('sticky-footer--visible');
        document.body.classList.remove('body--has-footer');
      }
    });
  }, { threshold: 0 });

  observer.observe(hero);
}

// INITIALIZATION

document.addEventListener('DOMContentLoaded', function() {
  renderAllProducts();
  startCountdown();
  setupQuantityListeners();
  setupStickyFooter();
  updateBundle();
});
