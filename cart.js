// Global Shopping Cart & Toast Notification System
document.addEventListener("DOMContentLoaded", () => {
    // Inject Cart Drawer HTML and Toast Container into the DOM
    injectCartAndToasts();
    // Load initial cart and update UI components
    updateCartUI();
    
    // Auto-bind cart triggers in navbar
    const cartTriggers = document.querySelectorAll(".cart-trigger");
    cartTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            toggleCart();
        });
    });
});

let cart = JSON.parse(localStorage.getItem("soundguys_cart")) || [];

// Inject HTML structures dynamically to prevent code duplication across pages
function injectCartAndToasts() {
    // 1. Toast Notifications Container
    if (!document.getElementById("toast-container")) {
        const toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    }

    // 2. Cart Drawer & Overlay
    if (!document.getElementById("cartDrawer")) {
        const overlay = document.createElement("div");
        overlay.id = "cartOverlay";
        overlay.className = "cart-overlay";
        overlay.addEventListener("click", toggleCart);

        const drawer = document.createElement("div");
        drawer.id = "cartDrawer";
        drawer.className = "cart-drawer";
        drawer.innerHTML = `
            <div class="cart-header">
                <h3>Shopping Bag <span id="cartBadgeHeader" class="cart-count-badge">0</span></h3>
                <button class="cart-close-btn" id="closeCartBtn">&times;</button>
            </div>
            <div class="cart-body" id="cartItemsContainer">
                <div class="cart-empty-state">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <p>Your bag is empty.</p>
                    <a href="product.html" class="cart-shop-link">Shop AirPods</a>
                </div>
            </div>
            <div class="cart-footer">
                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span id="cartSubtotal">₹0</span>
                    </div>
                    <div class="summary-row">
                        <span>GST (18%)</span>
                        <span id="cartTax">₹0</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span id="cartTotal">₹0</span>
                    </div>
                </div>
                <button class="checkout-btn" id="cartCheckoutBtn">Checkout</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        // Bind events
        document.getElementById("closeCartBtn").addEventListener("click", toggleCart);
        document.getElementById("cartCheckoutBtn").addEventListener("click", checkoutCart);
    }
}

// Show animated toast messages
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === "error") {
        icon = '<i class="fa-solid fa-circle-xmark"></i>';
    } else if (type === "info") {
        icon = '<i class="fa-solid fa-circle-info"></i>';
    }

    toast.innerHTML = `
        <div class="toast-content">
            ${icon}
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Fade and slide in
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    // Auto-remove toast after 4 seconds
    const autoRemove = setTimeout(() => {
        removeToast(toast);
    }, 4000);

    // Manual close button
    toast.querySelector(".toast-close").addEventListener("click", () => {
        clearTimeout(autoRemove);
        removeToast(toast);
    });
}

function removeToast(toast) {
    toast.classList.remove("show");
    toast.classList.add("hide");
    toast.addEventListener("transitionend", () => {
        toast.remove();
    });
}

// Toggle Cart Open/Closed states
function toggleCart() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");
    
    if (drawer && overlay) {
        drawer.classList.toggle("open");
        overlay.classList.toggle("active");
    }
}

// Add Item to Cart
function addToCart(name, price, img, id = null) {
    // Generate simple ID if none provided
    const itemId = id || name.toLowerCase().replace(/\s+/g, "-");
    const parsedPrice = parseInt(String(price).replace(/[^0-9]/g, ""), 10);

    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: name,
            price: parsedPrice,
            img: img || "./imge/airpods-pro.webp",
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast(`Added ${name} to your bag!`);
    
    // Automatically slide drawer open to show addition
    setTimeout(() => {
        const drawer = document.getElementById("cartDrawer");
        if (drawer && !drawer.classList.contains("open")) {
            toggleCart();
        }
    }, 300);
}

// Remove Item from Cart
function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
        const name = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
        showToast(`Removed ${name} from bag`, "info");
    }
}

// Update quantity for a cart item
function updateQuantity(id, amount) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        saveCart();
        updateCartUI();
    }
}

// Save to LocalStorage
function saveCart() {
    localStorage.setItem("soundguys_cart", JSON.stringify(cart));
}

// Redraw Cart contents and badges
function updateCartUI() {
    const itemsContainer = document.getElementById("cartItemsContainer");
    if (!itemsContainer) return;

    // Calculate totals
    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
    });

    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    // Update general counts / badges
    const badgeHeaders = document.querySelectorAll(".cart-count-badge");
    badgeHeaders.forEach(badge => {
        badge.textContent = totalItems;
        if (totalItems > 0) {
            badge.style.display = "flex";
        } else {
            badge.style.display = "none";
        }
    });

    // Update drawer summaries
    const subtotalEl = document.getElementById("cartSubtotal");
    const taxEl = document.getElementById("cartTax");
    const totalEl = document.getElementById("cartTotal");

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    if (taxEl) taxEl.textContent = `₹${tax.toLocaleString("en-IN")}`;
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString("en-IN")}`;

    // Render items list
    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="cart-empty-state">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Your bag is empty.</p>
                <a href="product.html" class="cart-shop-link">Shop AirPods</a>
            </div>
        `;
        const checkoutBtn = document.getElementById("cartCheckoutBtn");
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        const checkoutBtn = document.getElementById("cartCheckoutBtn");
        if (checkoutBtn) checkoutBtn.disabled = false;

        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.img}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString("en-IN")}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                            <i class="fa-regular fa-trash-can"></i>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
    }
}

// Checkout action
function checkoutCart() {
    if (cart.length === 0) return;
    
    // Simulate successful checkout animation/flow
    showToast("Checkout successful! Processing your magical order... ⚡", "success");
    
    // Trigger celebratory visual effect if canvas-confetti was available, otherwise just complete
    cart = [];
    saveCart();
    updateCartUI();
    
    setTimeout(() => {
        toggleCart();
    }, 1500);
}
