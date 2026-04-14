// ============================================================
// G FUEL LANDER — CONFIG
// ============================================================

var CONFIG = {
  saleEndDate: window.GFUEL_SALE_END || '2026-05-01T23:59:59',
  basePrice: window.GFUEL_BASE_PRICE || 35.99,
  tiers: [
    { count: 1, discount: 0.00, perUnit: 35.99 },
    { count: 2, discount: 0.30, perUnit: 25.19 },
    { count: 3, discount: 0.35, perUnit: 23.39 },
    { count: 4, discount: 0.40, perUnit: 21.59 },
  ],
  gifts: [
    { minQty: 2, name: 'Sampler Sticks', value: '$9.95', unlockText: '2+ Tubs' },
    { minQty: 3, name: 'Shaker Cup',     value: '$14.95', unlockText: '3+ Tubs' },
    { minQty: 2, name: 'Free Shipping',  value: '$5.95',  unlockText: '2+ Tubs' },
  ],
};

// ============================================================
// PRODUCTS
// ============================================================

var PRODUCTS = window.GFUEL_PRODUCTS || [
  { id: 1, title: 'Placeholder Flavor 1', desc: 'Delicious energy tub with premium flavor blend', image: '', badge: 'new',         price: 35.99, rating: 4.8, stock: 24 },
  { id: 2, title: 'Placeholder Flavor 2', desc: 'Rich and bold, a fan favorite for years',        image: '', badge: 'bestseller', price: 35.99, rating: 4.9, stock: 8  },
  { id: 3, title: 'Placeholder Flavor 3', desc: 'Sweet and smooth with a refreshing finish',      image: '', badge: '',           price: 35.99, rating: 4.7, stock: 31 },
  { id: 4, title: 'Placeholder Flavor 4', desc: 'Limited batch, unique seasonal flavor',          image: '', badge: 'backinstock',price: 35.99, rating: 4.8, stock: 5  },
  { id: 5, title: 'Placeholder Flavor 5', desc: 'Tropical twist with a citrus kick',             image: '', badge: 'new',         price: 35.99, rating: 4.6, stock: 18 },
  { id: 6, title: 'Placeholder Flavor 6', desc: 'Classic flavor, always a crowd pleaser',        image: '', badge: 'bestseller', price: 35.99, rating: 4.9, stock: 12 },
  { id: 7, title: 'Placeholder Flavor 7', desc: 'Cool and minty, a winter classic',              image: '', badge: 'gone',        price: 35.99, rating: 4.5, stock: 0  },
];

// ============================================================
// STATE
// ============================================================

var quantities = {};
PRODUCTS.forEach(function(p) { quantities[p.id] = 0; });

// Palette for image placeholder backgrounds (cycles)
var PLACEHOLDER_COLORS = ['#EAE6FF', '#E6F0FF', '#E6FFE6', '#FFF6E6', '#FFE6F0', '#E6FAFA', '#F0E6FF'];

// ============================================================
// HELPERS
// ============================================================

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getTotalQty() {
  var total = 0;
  var keys = Object.keys(quantities);
  for (var i = 0; i < keys.length; i++) {
    total += quantities[keys[i]];
  }
  return total;
}

function getCurrentTier(count) {
  var tier = CONFIG.tiers[0];
  for (var i = 0; i < CONFIG.tiers.length; i++) {
    if (count >= CONFIG.tiers[i].count) {
      tier = CONFIG.tiers[i];
    }
  }
  return tier;
}

// ============================================================
// PRODUCT LIST RENDERING
// ============================================================

function getBadgeHTML(badge) {
  if (!badge) return '';
  var map = {
    new:         ['NEW',          'product-row__badge--new'],
    bestseller:  ['BEST SELLER',  'product-row__badge--bestseller'],
    lowstock:    ['LOW STOCK',    'product-row__badge--lowstock'],
    backinstock: ['BACK IN STOCK','product-row__badge--backinstock'],
    gone:        ['GONE FOREVER', 'product-row__badge--gone'],
  };
  var entry = map[badge];
  if (!entry) return '';
  return '<span class="product-row__badge ' + entry[1] + '">' + entry[0] + '</span>';
}

function renderProductRow(product, index) {
  var qty = quantities[product.id];
  var bgColor = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];
  var imageHTML;
  if (product.image) {
    imageHTML = '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.title) + '" loading="lazy">';
  } else {
    imageHTML = '<div class="product-row__image-placeholder" style="background:' + bgColor + '"></div>';
  }

  var actionHTML;
  if (qty === 0) {
    actionHTML =
      '<button class="product-row__add-btn" ' +
        'data-action="quick-add" ' +
        'data-id="' + product.id + '" ' +
        'aria-label="Add ' + escapeHTML(product.title) + '">' +
        'Add +' +
      '</button>';
  } else {
    actionHTML =
      '<div class="product-row__stepper">' +
        '<button class="product-row__stepper-btn" ' +
          'data-action="decrease" ' +
          'data-id="' + product.id + '" ' +
          'aria-label="Remove one ' + escapeHTML(product.title) + '">' +
          '&#8722;' +
        '</button>' +
        '<span class="product-row__stepper-qty">' + qty + '</span>' +
        '<button class="product-row__stepper-btn" ' +
          'data-action="increase" ' +
          'data-id="' + product.id + '" ' +
          'aria-label="Add one more ' + escapeHTML(product.title) + '">' +
          '+' +
        '</button>' +
      '</div>';
  }

  var selectedClass = qty > 0 ? ' is-selected' : '';

  return (
    '<div class="product-row' + selectedClass + '" data-product-id="' + product.id + '">' +
      '<div class="product-row__image">' + imageHTML + '</div>' +
      '<div class="product-row__info">' +
        '<div class="product-row__name">' + escapeHTML(product.title) + '</div>' +
        (product.desc ? '<div class="product-row__desc">' + escapeHTML(product.desc) + '</div>' : '') +
      '</div>' +
      '<div class="product-row__right">' +
        getBadgeHTML(product.badge) +
        actionHTML +
      '</div>' +
    '</div>'
  );
}

function renderAllProducts() {
  var list = document.getElementById('product-list');
  if (!list) return;
  list.innerHTML = PRODUCTS.map(function(p, i) {
    return renderProductRow(p, i);
  }).join('');
}

// ============================================================
// PROGRESS BAR UPDATE
// ============================================================

function updateProgressBar(totalQty) {
  // Fill/unfill each segment
  var segments = document.querySelectorAll('[data-meter]');
  for (var i = 0; i < segments.length; i++) {
    var seg = segments[i];
    var n = parseInt(seg.getAttribute('data-meter'), 10);
    if (totalQty >= n) {
      seg.classList.add('is-filled');
    } else {
      seg.classList.remove('is-filled');
    }
  }

  // Active milestone dot
  var milestones = document.querySelectorAll('[data-milestone]');
  var activeMilestone = 0;
  for (var j = 0; j < CONFIG.tiers.length; j++) {
    if (totalQty >= CONFIG.tiers[j].count) {
      activeMilestone = CONFIG.tiers[j].count;
    }
  }
  for (var k = 0; k < milestones.length; k++) {
    var ms = milestones[k];
    var msN = parseInt(ms.getAttribute('data-milestone'), 10);
    if (msN === activeMilestone && totalQty > 0) {
      ms.classList.add('is-active');
    } else {
      ms.classList.remove('is-active');
    }
  }

  // Active price tier
  var priceEls = document.querySelectorAll('[data-price-tier]');
  var activeTier = getCurrentTier(totalQty);
  for (var m = 0; m < priceEls.length; m++) {
    var priceEl = priceEls[m];
    var pTier = parseInt(priceEl.getAttribute('data-price-tier'), 10);
    if (pTier === activeTier.count && totalQty > 0) {
      priceEl.classList.add('is-active');
    } else {
      priceEl.classList.remove('is-active');
    }
  }
}

// ============================================================
// GIFT UPDATE
// ============================================================

function updateGifts(totalQty) {
  for (var i = 0; i < CONFIG.gifts.length; i++) {
    var gift = CONFIG.gifts[i];
    var el = document.getElementById('gift-' + i);
    if (el) {
      if (totalQty >= gift.minQty) {
        el.classList.add('is-unlocked');
      } else {
        el.classList.remove('is-unlocked');
      }
    }
  }
}

// ============================================================
// CTA BUTTON UPDATE
// ============================================================

function updateCTA(totalQty) {
  var btn = document.getElementById('cta-btn');
  var textEl = document.getElementById('cta-text');
  if (!btn || !textEl) return;

  if (totalQty === 0) {
    textEl.textContent = 'Select at least 1 tub';
    btn.classList.remove('is-active');
    btn.disabled = true;
  } else {
    var tier = getCurrentTier(totalQty);
    var totalPrice = totalQty * tier.perUnit;
    var tubWord = totalQty === 1 ? 'tub' : 'tubs';
    textEl.textContent = 'Checkout \u2014 ' + totalQty + ' ' + tubWord + ' \u2014 $' + totalPrice.toFixed(2);
    btn.classList.add('is-active');
    btn.disabled = false;
  }
}

// ============================================================
// MASTER UPDATE
// ============================================================

function updateAll() {
  var total = getTotalQty();
  updateProgressBar(total);
  updateGifts(total);
  updateCTA(total);
}

// ============================================================
// EVENT HANDLING (click delegation)
// ============================================================

function setupClickListeners() {
  document.addEventListener('click', function(e) {
    // "Add +" quick-add
    var addBtn = e.target.closest('[data-action="quick-add"]');
    if (addBtn) {
      var addId = parseInt(addBtn.getAttribute('data-id'), 10);
      if (!isNaN(addId)) {
        quantities[addId] = 1;
        renderAllProducts();
        updateAll();
      }
      return;
    }

    // Stepper increase
    var incBtn = e.target.closest('[data-action="increase"]');
    if (incBtn) {
      var incId = parseInt(incBtn.getAttribute('data-id'), 10);
      if (!isNaN(incId)) {
        quantities[incId] = (quantities[incId] || 0) + 1;
        renderAllProducts();
        updateAll();
      }
      return;
    }

    // Stepper decrease
    var decBtn = e.target.closest('[data-action="decrease"]');
    if (decBtn) {
      var decId = parseInt(decBtn.getAttribute('data-id'), 10);
      if (!isNaN(decId) && quantities[decId] > 0) {
        quantities[decId]--;
        // Re-render switches back to "Add +" when qty hits 0
        renderAllProducts();
        updateAll();
      }
      return;
    }
  });
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================

function startCountdown() {
  var daysEl    = document.getElementById('countdown-days');
  var hoursEl   = document.getElementById('countdown-hours');
  var minutesEl = document.getElementById('countdown-minutes');
  var secondsEl = document.getElementById('countdown-seconds');
  if (!hoursEl || !minutesEl || !secondsEl) return;

  var endDate = new Date(CONFIG.saleEndDate).getTime();
  var intervalId;

  function tick() {
    var diff = endDate - Date.now();
    if (diff <= 0) {
      clearInterval(intervalId);
      if (daysEl)    daysEl.textContent    = '00';
      hoursEl.textContent   = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var mn = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent   = String(h).padStart(2, '0');
    minutesEl.textContent = String(mn).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  tick();
  intervalId = setInterval(tick, 1000);
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  renderAllProducts();
  startCountdown();
  setupClickListeners();
  updateAll();
});
