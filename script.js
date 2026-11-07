const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const status = document.getElementById("status");
const productList = document.getElementById("productList");
const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

let products = [];

function renderProducts(list) {
  productList.innerHTML = list
    .map(p => `
      <div class="card">
        <img src="${p.thumbnail}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.category}</p>
        <p>$${p.price}</p>
        <button data-id="${p.id}">Tambah</button>
      </div>
    `)
    .join("");
}

function setupCategories() {
    const categories = [...new Set(products.map(p => p.category))];

    categorySelect.innerHTML += categories
      .map(c => `<option value="${c}">${c}</option>`)
      .join("");
    }

function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();
    const category = categorySelect.value;

    const filtered = products.filter(p => {
    const matchName = p.title.toLowerCase().includes(keyword);
    const matchCategory = category === "all" || p.category === category;
    return matchName && matchCategory;
    });

    renderProducts(filtered);

    status.textContent =
      filtered.length === 0
        ? "Produk tidak ditemukan."
        : `${filtered.length} produk ditampilkan.`;
    }


async function loadProducts() {
  status.textContent = "Memuat produk...";

  try {
    const res = await fetch("https://dummyjson.com/products?limit=100");

    if (!res.ok) {
      throw new Error("Respons server bermasalah");
    }

    const data = await res.json();
    products = data.products;

    status.textContent = `${products.length} produk dimuat.`;
    renderProducts(products);
    setupCategories();


  } catch (error) {
    status.textContent = "Gagal memuat produk. Cek koneksi internet.";
  }
}

loadProducts();
searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);