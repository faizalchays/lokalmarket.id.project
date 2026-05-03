const products = [
  {
    id: 1,
    name: 'Akun Valorant Tier Radiant',
    category: 'Akun',
    price: 299000,
    rating: 4.9,
    description: 'Akun Valorant dengan rank Radiant dan koleksi skin eksklusif terbaru.',
    details: ['Rank Radiant', 'Skin eksklusif terbaru', 'Akun verifikasi premium'],
    image: 'https://images.unsplash.com/photo-1590608897129-79ab8a4ae3dc?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Voucher Steam Rp 250.000',
    category: 'Voucher',
    price: 245000,
    rating: 4.8,
    description: 'Top up Steam dengan harga terjangkau dan aktivasi otomatis langsung ke akun Anda.',
    details: ['Proses instan', 'Resmi & aman', 'Dukungan 24/7'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    badge: 'Cepat'
  },
  {
    id: 3,
    name: 'Paket VIP Mobile Legends',
    category: 'Paket',
    price: 199000,
    rating: 4.7,
    description: 'Bundle item premium Mobile Legends dengan hero, skin, dan diamond eksklusif.',
    details: ['Hero langka', 'Skin premium', 'Diamond siap pakai'],
    image: 'https://images.unsplash.com/photo-1511268551857-4d53a8b0fdf5?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular'
  },
  {
    id: 4,
    name: 'Akun Free Fire Diamond + Elite Pass',
    category: 'Akun',
    price: 179000,
    rating: 4.8,
    description: 'Akun Free Fire lengkap dengan diamond, survival pass, dan item karakter premium.',
    details: ['Diamond aktif', 'Elite pass saat ini', 'Akun terpercaya'],
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    badge: 'Instan'
  },
  {
    id: 5,
    name: 'Voucher Google Play Rp 150.000',
    category: 'Voucher',
    price: 145000,
    rating: 4.6,
    description: 'Voucher resmi Google Play untuk belanja aplikasi, game, dan langganan premium.',
    details: ['Resmi Google', 'Aktivasi cepat', 'Harga kompetitif'],
    image: 'https://images.unsplash.com/photo-1580238344734-7f086c95c6f1?auto=format&fit=crop&w=800&q=80',
    badge: 'Resmi'
  },
  {
    id: 6,
    name: 'Paket Langganan Netflix 3 Bulan',
    category: 'Paket',
    price: 129000,
    rating: 4.9,
    description: 'Akses Netflix Premium selama 3 bulan dengan akun bersama aman dan terverifikasi.',
    details: ['Akun premium', '3 bulan akses', 'Tersedia film & serial terbaru'],
    image: 'https://images.unsplash.com/photo-1519455953755-af066f52f1d7?auto=format&fit=crop&w=800&q=80',
    badge: 'Terbaru'
  }
];

const cart = {
  items: JSON.parse(localStorage.getItem('lokalCart') || '[]'),
  save() {
    localStorage.setItem('lokalCart', JSON.stringify(this.items));
  },
  count() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  },
  total() {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  add(productId) {
    const existing = this.items.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      const product = products.find((product) => product.id === productId);
      if (!product) return;
      this.items.push({ ...product, quantity: 1 });
    }
    this.save();
    renderCart();
  },
  remove(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.save();
    renderCart();
  },
  updateQuantity(productId, amount) {
    const existing = this.items.find((item) => item.id === productId);
    if (!existing) return;
    existing.quantity = Math.max(1, existing.quantity + amount);
    this.save();
    renderCart();
  }
};

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartCount = document.getElementById('cartCount');
const mobileCartCount = document.getElementById('mobileCartCount');
const cartPanel = document.getElementById('cartPanel');
const loginPanel = document.getElementById('loginPanel');
const productModal = document.getElementById('productModal');
const mobileMenuPanel = document.getElementById('mobileMenuPanel');
const cartToggle = document.getElementById('cartToggle');
const mobileCartToggle = document.getElementById('mobileCartToggle');
const loginToggle = document.getElementById('loginToggle');
const closeCart = document.getElementById('closeCart');
const closeLogin = document.getElementById('closeLogin');
const closeProductModal = document.getElementById('closeProductModal');
const mobileMenu = document.getElementById('mobileMenu');
const checkoutBtn = document.getElementById('checkoutBtn');
const registerBtn = document.getElementById('registerBtn');
const newsletterForm = document.getElementById('newsletterForm');
const loginForm = document.getElementById('loginForm');
const sectionButtons = document.querySelectorAll('[data-action]');

function formatRp(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
}

function renderProducts(productsToRender) {
  productGrid.innerHTML = productsToRender
    .map(
      (product) => `
      <article class="product-card">
        <div class="product-badge">${product.badge}</div>
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta">
          <span class="product-price">${formatRp(product.price)}</span>
          <div class="product-actions">
            <button class="btn-outline product-detail" data-product="${product.id}">Detail</button>
            <button class="btn-fire product-action" data-product="${product.id}">Tambah ke Keranjang</button>
          </div>
        </div>
      </article>
    `
    )
    .join('');

  document.querySelectorAll('.product-action').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = Number(button.dataset.product);
      cart.add(productId);
      showCartPanel();
    });
  });

  document.querySelectorAll('.product-detail').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = Number(button.dataset.product);
      showProductModal(productId);
    });
  });
}

function getFilteredProducts() {
  let filtered = [...products];
  const searchTerm = searchInput.value.trim().toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active');
  const category = activeFilter?.dataset.filter;
  if (category && category !== 'all') {
    filtered = filtered.filter((product) => product.category === category);
  }
  if (searchTerm) {
    filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm));
  }
  const sortValue = sortSelect.value;
  if (sortValue === 'low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'high') {
    filtered.sort((a, b) => b.price - a.price);
  }
  return filtered;
}

function updateFilterButtons(selectedButton) {
  filterButtons.forEach((button) => button.classList.toggle('active', button === selectedButton));
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalDisplay = document.getElementById('cartTotal');
  container.innerHTML = cart.items.length
    ? cart.items
        .map(
          (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <div class="cart-item-meta">
            <span>${formatRp(item.price)}</span>
            <button class="btn-outline" data-remove="${item.id}">Hapus</button>
          </div>
          <div class="qty-controls">
            <button data-decrease="${item.id}"><i class="fa-solid fa-minus"></i></button>
            <span>${item.quantity}</span>
            <button data-increase="${item.id}"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
      </div>
    `
        )
        .join('')
    : '<p class="text-slate-300">Keranjang Anda masih kosong. Tambahkan produk favorit sekarang.</p>';
  totalDisplay.textContent = formatRp(cart.total());
  cartCount.textContent = cart.count();
  mobileCartCount.textContent = cart.count();
  if (cartToggle) {
    const badge = cartToggle.querySelector('span.badge');
    if (badge) badge.textContent = cart.count();
  }

  container.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => cart.remove(Number(button.dataset.remove)));
  });
  container.querySelectorAll('[data-decrease]').forEach((button) => {
    button.addEventListener('click', () => cart.updateQuantity(Number(button.dataset.decrease), -1));
  });
  container.querySelectorAll('[data-increase]').forEach((button) => {
    button.addEventListener('click', () => cart.updateQuantity(Number(button.dataset.increase), 1));
  });
}

function renderProductModal(product) {
  if (!productModal) return;
  productModal.querySelector('.modal-image').src = product.image;
  productModal.querySelector('.modal-image').alt = product.name;
  productModal.querySelector('.modal-title').textContent = product.name;
  productModal.querySelector('.modal-category').textContent = product.category;
  productModal.querySelector('.modal-rating').textContent = `${product.rating} ★`;
  productModal.querySelector('.modal-price').textContent = formatRp(product.price);
  productModal.querySelector('.modal-description').textContent = product.description;
  const featuresList = productModal.querySelector('.modal-features');
  featuresList.innerHTML = product.details.map((detail) => `<li>${detail}</li>`).join('');
  productModal.querySelector('.modal-add').dataset.product = product.id;
}

function showProductModal(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || !productModal) return;
  renderProductModal(product);
  productModal.classList.add('show');
  productModal.classList.remove('hidden');
}

function hideProductModal() {
  if (!productModal) return;
  productModal.classList.remove('show');
  setTimeout(() => productModal.classList.add('hidden'), 250);
}

function showCartPanel() {
  cartPanel.classList.add('show');
  cartPanel.classList.remove('hidden');
}

function hideCartPanel() {
  cartPanel.classList.remove('show');
  setTimeout(() => cartPanel.classList.add('hidden'), 250);
}

function showLoginPanel() {
  loginPanel.classList.add('show');
  loginPanel.classList.remove('hidden');
}

function hideLoginPanel() {
  loginPanel.classList.remove('show');
  setTimeout(() => loginPanel.classList.add('hidden'), 250);
}

function toggleMobileMenu() {
  mobileMenuPanel.classList.toggle('hidden');
}

function closeMobileMenu() {
  if (!mobileMenuPanel.classList.contains('hidden')) mobileMenuPanel.classList.add('hidden');
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initTestimonials() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  let activeIndex = 0;
  const updateTestimonials = () => {
    testimonialCards.forEach((card, index) => card.classList.toggle('active', index === activeIndex));
    activeIndex = (activeIndex + 1) % testimonialCards.length;
  };
  setInterval(updateTestimonials, 4500);
}

function initEvents() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      updateFilterButtons(button);
      renderProducts(getFilteredProducts());
    });
  });

  searchInput.addEventListener('input', () => renderProducts(getFilteredProducts()));
  sortSelect.addEventListener('change', () => renderProducts(getFilteredProducts()));

  cartToggle?.addEventListener('click', showCartPanel);
  mobileCartToggle?.addEventListener('click', showCartPanel);
  closeCart?.addEventListener('click', hideCartPanel);
  closeLogin?.addEventListener('click', hideLoginPanel);
  closeProductModal?.addEventListener('click', hideProductModal);
  loginToggle?.addEventListener('click', showLoginPanel);
  mobileMenu?.addEventListener('click', toggleMobileMenu);

  sectionButtons.forEach((button) => {
    const target = button.dataset.action;
    if (!target) return;
    button.addEventListener('click', () => {
      scrollToSection(target);
      closeMobileMenu();
    });
  });

  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email) return;
    alert(`Terima kasih! Email ${email} berhasil didaftarkan untuk promo eksklusif.`);
    newsletterForm.reset();
  });

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('emailInput').value.trim();
    alert(`Selamat datang kembali, ${email.split('@')[0]}! Anda sekarang dapat mengakses fitur premium.`);
    loginForm.reset();
    hideLoginPanel();
  });

  registerBtn?.addEventListener('click', () => {
    alert('Terima kasih! Fitur pembuatan akun segera tersedia. Silakan hubungi customer service untuk pendaftaran prioritas.');
    hideLoginPanel();
  });

  productModal?.querySelector('.modal-add')?.addEventListener('click', (event) => {
    const productId = Number(event.target.dataset.product || event.target.closest('[data-product]')?.dataset.product);
    if (!productId) return;
    cart.add(productId);
    hideProductModal();
    showCartPanel();
  });

  checkoutBtn?.addEventListener('click', () => {
    if (!cart.items.length) {
      alert('Keranjang kosong. Silakan tambahkan produk terlebih dahulu.');
      return;
    }
    const total = formatRp(cart.total());
    alert(`Checkout berhasil! Total pembayaran ${total}. Tim kami akan segera menghubungi Anda untuk detail pembayaran.`);
    cart.items = [];
    cart.save();
    renderCart();
    hideCartPanel();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideCartPanel();
      hideLoginPanel();
      closeMobileMenu();
    }
  });
}

function init() {
  renderProducts(products);
  renderCart();
  initEvents();
  initTestimonials();
}

init();
