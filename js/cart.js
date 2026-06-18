// Shopping Cart State & Toast Management

// State
let cart = {}; // { [productId]: { ...product, qty } }

// Functions to implement
function loadCart() {
  const stored = localStorage.getItem("airpods_cart");
  if (stored) {
    try {
      cart = JSON.parse(stored);
    } catch (e) {
      cart = {};
    }
  }
  updateCartBadge();
  renderCart();
}

function saveCart() {
  localStorage.setItem("airpods_cart", JSON.stringify(cart));
}

function addToCart(id) {
  // Find product in global PRODUCTS catalog
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = {
      name: product.name,
      price: product.price,
      svg: product.svg,
      qty: 1
    };
  }

  saveCart();
  updateCartBadge();
  renderCart();
  showToast(`Added ${product.name} to your bag`);
}

function updateQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;

  if (cart[id].qty <= 0) {
    removeItem(id);
    return;
  }

  saveCart();
  updateCartBadge();
  renderCart();

  // Sync standalone cart page if it exists
  if (window.renderFullCart) {
    window.renderFullCart();
  }
}

function removeItem(id) {
  if (!cart[id]) return;
  const name = cart[id].name;
  delete cart[id];

  saveCart();
  updateCartBadge();
  renderCart();
  showToast(`Removed ${name} from your bag`);

  // Sync standalone cart page if it exists
  if (window.renderFullCart) {
    window.renderFullCart();
  }
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge-count");
  if (!badge) return;

  let count = 0;
  for (const id in cart) {
    count += cart[id].qty;
  }

  badge.textContent = count;
  if (count > 0) {
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function renderCart() {
  const container = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("cart-subtotal-val");
  if (!container) return;

  const itemKeys = Object.keys(cart);

  if (itemKeys.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-message">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <p>Your shopping bag is empty</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    return;
  }

  let subtotal = 0;
  container.innerHTML = itemKeys.map(id => {
    const item = cart[id];
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    return `
      <div class="cart-item" data-id="${id}">
        <div class="cart-item-visual">
          ${item.svg}
        </div>
        <div class="cart-item-details">
          <div class="cart-item-meta">
            <h4 class="cart-item-name">${item.name}</h4>
            <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
          </div>
          <div class="cart-item-controls">
            <div class="qty-controls">
              <button class="qty-btn" onclick="updateQty('${id}', -1)">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="updateQty('${id}', 1)">+</button>
            </div>
            <span class="remove-item-btn" onclick="removeItem('${id}')">Remove</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (subtotalEl) {
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }
}

function showToast(msg) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-accent"></div>
    <span>${msg}</span>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Auto dismiss after 2.8 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, 2800);
}

function toggleCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer || !overlay) return;

  drawer.classList.toggle("open");
  overlay.classList.toggle("active");
}

// Bind navbar and cart toggle actions
document.addEventListener("DOMContentLoaded", () => {
  const navCartBtn = document.getElementById("nav-cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartOverlay = document.getElementById("cart-overlay");
  const checkoutBtn = document.getElementById("cart-checkout-btn");

  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  if (navCartBtn) navCartBtn.addEventListener("click", toggleCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener("click", toggleCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener("click", toggleCartDrawer);

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const itemKeys = Object.keys(cart);
      if (itemKeys.length === 0) {
        showToast("Your bag is empty");
        return;
      }
      showToast("Order placed successfully! Thank you.");
      cart = {};
      saveCart();
      updateCartBadge();
      renderCart();
      setTimeout(toggleCartDrawer, 800);
    });
  }

  // Load initial cart
  loadCart();
});
