// AirPods Product Catalog Data & Render Logic

const PRODUCTS = [
  {
    id: "airpods-pro-2",
    name: "AirPods Pro (2nd Gen)",
    category: "airpods-pro",
    price: 249.00,
    isFeatured: true,
    badge: "Best seller",
    description: "Up to 2x more Active Noise Cancellation. Adaptive Audio tailors sound to your environment.",
    specs: [
      "Apple H2 chip",
      "Adaptive Audio and Transparency mode",
      "Personalized Spatial Audio",
      "Up to 6 hours listening time on single charge",
      "MagSafe Charging Case (USB-C) with speaker"
    ],
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(15, 10)">
        <rect x="30" y="40" width="10" height="45" rx="5" fill="#FFFFFF" stroke="#111110" stroke-width="2.5"/>
        <rect x="30" y="80" width="10" height="5" rx="1" fill="#999994" stroke="#111110" stroke-width="2.5"/>
        <path d="M15 35C15 20 28 15 40 22C50 28 47 42 40 47C35 50 30 45 30 40" fill="#FFFFFF" stroke="#111110" stroke-width="2.5"/>
        <path d="M10 28C10 23 15 23 15 30C15 37 10 37 10 32Z" fill="#00E5CC" stroke="#111110" stroke-width="2"/>
        <circle cx="38" cy="28" r="3" fill="#111110"/>
      </g>
    </svg>`
  },
  {
    id: "airpods-3",
    name: "AirPods (3rd Gen)",
    category: "airpods",
    price: 169.00,
    isFeatured: false,
    badge: "Popular",
    description: "Personalized Spatial Audio with dynamic head tracking. Sweat and water resistant.",
    specs: [
      "Apple H1 chip",
      "Personalized Spatial Audio",
      "Adaptive EQ",
      "Up to 6 hours listening time",
      "Lightning or MagSafe Charging Case"
    ],
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(20, 10)">
        <rect x="30" y="40" width="9" height="40" rx="4.5" fill="#FFFFFF" stroke="#111110" stroke-width="2.5"/>
        <rect x="30" y="75" width="9" height="5" rx="1" fill="#999994" stroke="#111110" stroke-width="2.5"/>
        <path d="M18 35C18 20 30 15 42 22C52 28 49 42 42 47C37 50 30 45 30 40" fill="#FFFFFF" stroke="#111110" stroke-width="2.5"/>
        <circle cx="38" cy="28" r="3" fill="#111110"/>
      </g>
    </svg>`
  },
  {
    id: "airpods-2",
    name: "AirPods (2nd Gen)",
    category: "airpods",
    price: 129.00,
    isFeatured: false,
    badge: "Classic",
    description: "Simple setup. Voice-activated Siri. More than 24 hours of listening with charging case.",
    specs: [
      "Apple H1 chip",
      "Automatic setup & connection",
      "Easy switching between Apple devices",
      "Up to 5 hours listening time",
      "Charging Case (Lightning)"
    ],
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(20, 5)">
        <rect x="30" y="35" width="8" height="52" rx="4" fill="#FFFFFF" stroke="#111110" stroke-width="2.5"/>
        <rect x="30" y="82" width="8" height="5" rx="1" fill="#999994" stroke="#111110" stroke-width="2.5"/>
        <path d="M18 30C18 16 29 11 40 18C50 24 47 37 40 42C35 45 30 40 30 35" fill="#FFFFFF" stroke="#111110" stroke-width="2.5"/>
        <circle cx="37" cy="24" r="3" fill="#111110"/>
      </g>
    </svg>`
  },
  {
    id: "airpods-max",
    name: "AirPods Max",
    category: "airpods-max",
    price: 549.00,
    isFeatured: false,
    badge: "Pro sound",
    description: "Ultimate over-ear listening experience. High-fidelity audio and Active Noise Cancellation.",
    specs: [
      "Apple H1 headphone chip (each ear cup)",
      "High-fidelity sound & Active Noise Cancellation",
      "Transparency mode & Spatial Audio",
      "Knit-mesh canopy and memory foam ear cushions",
      "Up to 20 hours listening time on single charge"
    ],
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(15, 10)">
        <path d="M15 45C15 20 65 20 65 45" stroke="#111110" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M15 45C15 20 65 20 65 45" stroke="#00E5CC" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <rect x="6" y="40" width="14" height="26" rx="7" fill="#FFFFFF" stroke="#111110" stroke-width="2.5"/>
        <rect x="60" y="40" width="14" height="26" rx="7" fill="#FFFFFF" stroke="#111110" stroke-width="2.5"/>
        <rect x="18" y="43" width="4" height="20" rx="2" fill="#00E5CC" stroke="#111110" stroke-width="2"/>
        <rect x="58" y="43" width="4" height="20" rx="2" fill="#00E5CC" stroke="#111110" stroke-width="2"/>
      </g>
    </svg>`
  }
];

// Reusable render function
function renderProducts(productsToRender, targetGridId = "products-grid") {
  const grid = document.getElementById(targetGridId);
  if (!grid) return;

  if (productsToRender.length === 0) {
    grid.innerHTML = `<p class="no-products">No AirPods found in this category.</p>`;
    return;
  }

  grid.innerHTML = productsToRender.map(product => {
    // Check if product is featured for border styling
    // Featured card gets 2px solid var(--accent) border only
    const cardClass = product.isFeatured ? "product-card featured" : "product-card";
    
    return `
      <article class="${cardClass}" id="card-${product.id}">
        <span class="product-badge eyebrow">${product.badge}</span>
        <a href="product-detail.html?id=${product.id}" class="product-visual">
          ${product.svg}
        </a>
        <div class="product-info">
          <a href="product-detail.html?id=${product.id}">
            <h3 class="product-title">${product.name}</h3>
          </a>
          <p class="product-desc">${product.description}</p>
          <div class="product-price-row">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <button class="btn btn-accent btn-sm add-to-cart-btn" onclick="addToCart('${product.id}')">
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}
