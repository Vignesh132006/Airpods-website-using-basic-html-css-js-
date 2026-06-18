// Category Filters Logic

document.addEventListener("DOMContentLoaded", () => {
  const filterChips = document.querySelectorAll(".filter-chip");
  if (filterChips.length === 0) return;

  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      // Toggle active states
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const category = chip.getAttribute("data-category");
      filterProducts(category);
    });
  });

  // Initial product render
  filterProducts("all");
});

// Expose filterProducts globally
window.filterProducts = function(cat) {
  let filtered = PRODUCTS;
  if (cat !== "all") {
    filtered = PRODUCTS.filter(product => product.category === cat);
  }
  renderProducts(filtered, "products-grid");
};
