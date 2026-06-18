// Product Catalog Data & Interaction Logic

const PRODUCTS = [
    {
        id: "airpods-pro",
        name: "AirPods Pro (2nd Gen)",
        price: 26900,
        img: "./imge/airpods-pro.webp",
        category: "airpods",
        tag: "hot",
        desc: "Designed to deliver up to 2x more Active Noise Cancellation. Adaptive Audio tailors noise control to your surroundings.",
        specs: [
            "Apple H2 Headphone Chip",
            "Up to 2x more Active Noise Cancellation",
            "Adaptive Audio & Transparency Mode",
            "Personalized Spatial Audio",
            "IP54 Dust, Sweat, and Water Resistant",
            "Up to 30 Hours total listening time with case"
        ]
    },
    {
        id: "airpods-3rd-gen",
        name: "AirPods (3rd Gen)",
        price: 19900,
        img: "./imge/AirPods-3rd-Gen_4.jpg",
        category: "airpods",
        tag: "new",
        desc: "Featuring personalized Spatial Audio, longer battery life, and sweat- and water-resistant design.",
        specs: [
            "Apple H1 Headphone Chip",
            "Personalized Spatial Audio with dynamic head tracking",
            "Adaptive EQ tunes music to your ears",
            "IPX4 Sweat and Water Resistant",
            "Up to 6 Hours of listening on one charge",
            "Up to 30 Hours total listening time with case"
        ]
    },
    {
        id: "airpods-2nd-gen",
        name: "AirPods (2nd Gen)",
        price: 12900,
        img: "./imge/AirPods-2-Review-9to5Mac.webp",
        category: "airpods",
        tag: null,
        desc: "Delivers the wireless headphone experience, re-imagined. Just pull them out of the charging case and they’re ready.",
        specs: [
            "Apple H1 Headphone Chip",
            "Automatic setup for all your Apple devices",
            "Easy access to Siri by saying 'Hey Siri'",
            "Double-tap to play or skip forward",
            "Up to 5 Hours of listening on one charge",
            "Up to 18 Hours total listening time with case"
        ]
    },
    {
        id: "airpods-max",
        name: "AirPods Max",
        price: 59900,
        img: "./imge/AirPods-Max-2.webp",
        category: "airpods",
        tag: "best-seller",
        desc: "A perfect balance of exhilarating high-fidelity audio and the effortless magic of AirPods.",
        specs: [
            "Apple H1 Headphone Chip (each ear cup)",
            "Apple-designed dynamic driver for high-fidelity audio",
            "Active Noise Cancellation & Transparency Mode",
            "Knit-mesh canopy and memory foam ear cushions",
            "Up to 20 Hours of listening on a single charge",
            "Smart Case preserves battery in ultra-low-power state"
        ]
    },
    {
        id: "magsafe-case",
        name: "MagSafe Charging Case",
        price: 2500,
        img: "./imge/magsafe-charging-case-.webp",
        category: "cases",
        tag: null,
        desc: "Fast and easy charging on a MagSafe charger, Apple Watch charger, or Qi-certified charger.",
        specs: [
            "U1 Chip for Precision Finding with Find My",
            "Built-in speaker plays sound to help locate it",
            "Lanyard loop for easy carrying attach",
            "Provides multiple full charges for AirPods Pro"
        ]
    },
    {
        id: "lightning-cable",
        name: "USB-C to Lightning Cable",
        price: 1800,
        img: "./imge/lightningcables.webp",
        category: "cables",
        tag: "sale",
        desc: "Connect your AirPods case with Lightning connector to your USB-C enabled device for charging and syncing.",
        specs: [
            "Heavy duty braided construction",
            "Fast-charging capability",
            "1-Meter length",
            "Apple MFi Certified"
        ]
    }
];

let activeCategory = "all";
let searchFieldVal = "";
let currentSort = "featured";

document.addEventListener("DOMContentLoaded", () => {
    // Initial Catalog Rendering
    renderProducts();

    // Bind Search Input Filter
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchFieldVal = e.target.value.toLowerCase().trim();
            renderProducts();
        });
    }

    // Bind Sorting Selection
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            renderProducts();
        });
    }

    // Bind Category Tabs
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeCategory = tab.getAttribute("data-category");
            renderProducts();
        });
    });

    // Bind Modal Close Events
    const closeModalBtn = document.getElementById("closeModalBtn");
    const overlay = document.getElementById("detailsOverlay");
    
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);
});

// Render dynamic products to the page
function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    // Filter logic
    let filtered = PRODUCTS.filter(product => {
        const matchesCategory = (activeCategory === "all" || product.category === activeCategory);
        const matchesSearch = (
            product.name.toLowerCase().includes(searchFieldVal) || 
            product.desc.toLowerCase().includes(searchFieldVal)
        );
        return matchesCategory && matchesSearch;
    });

    // Sorting logic
    if (currentSort === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    // Check for empty state
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="catalog-empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-hourglass-empty"></i>
                <h3>No Products Found</h3>
                <p>We couldn't find any AirPods or accessories matching "${searchFieldVal}". Try adjusting your keywords.</p>
            </div>
        `;
        return;
    }

    // Render cards HTML
    grid.innerHTML = filtered.map(product => {
        let tagHtml = "";
        if (product.tag) {
            const isHot = product.tag === "hot" ? "hot" : "";
            tagHtml = `<span class="product-tag ${isHot}">${product.tag.toUpperCase().replace("-", " ")}</span>`;
        }

        return `
            <div class="product-card glass-panel" data-id="${product.id}">
                ${tagHtml}
                <div class="product-card-image">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-card-details">
                    <div>
                        <h3>${product.name}</h3>
                        <p class="product-card-desc">${product.desc}</p>
                    </div>
                    <div class="product-card-price-row">
                        <span class="product-card-price">₹${product.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div class="product-card-actions">
                        <button class="btn-buy" onclick="addToCart('${product.name}', ${product.price}, '${product.img}', '${product.id}')">Buy</button>
                        <button class="btn-quick" onclick="openModal('${product.id}')">Specs</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    // GSAP Card entrance animations
    gsap.from(".product-card", {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out"
    });
}

// Modal Detail View Logic
function openModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Fill details
    document.getElementById("modalName").textContent = product.name;
    document.getElementById("modalPrice").textContent = `₹${product.price.toLocaleString("en-IN")}`;
    document.getElementById("modalImage").src = product.img;
    document.getElementById("modalDesc").textContent = product.desc;

    const specsList = document.getElementById("modalSpecs");
    specsList.innerHTML = product.specs.map(spec => `
        <li><i class="fa-solid fa-circle-check"></i> <span>${spec}</span></li>
    `).join("");

    // Bind Checkout Add Action in Modal
    const modalAddBtn = document.getElementById("modalAddBtn");
    modalAddBtn.onclick = () => {
        addToCart(product.name, product.price, product.img, product.id);
        closeModal();
    };

    // Show components
    const overlay = document.getElementById("detailsOverlay");
    const modal = document.getElementById("detailsModal");

    overlay.classList.add("active");
    modal.classList.add("active");

    // GSAP modal slide and pop
    gsap.fromTo(modal, 
        { scale: 0.85, opacity: 0, y: "-40%" },
        { scale: 1, opacity: 1, y: "-50%", duration: 0.4, ease: "back.out(1.1)" }
    );
}

function closeModal() {
    const overlay = document.getElementById("detailsOverlay");
    const modal = document.getElementById("detailsModal");

    if (modal && overlay) {
        gsap.to(modal, {
            scale: 0.85,
            opacity: 0,
            y: "-40%",
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                overlay.classList.remove("active");
                modal.classList.remove("active");
            }
        });
    }
}