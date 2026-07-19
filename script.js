const pages = ['home', 'katalog', 'testimoni', 'login', 'admin'];
const modal = document.getElementById('accountModal');
const modalDetail = document.getElementById('modalDetail');
const modalForm = document.getElementById('modalForm');
const modalSuccess = document.getElementById('modalSuccess');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalImg = document.getElementById('modalImg');
const modalSpecs = document.getElementById('modalSpecs');

const loginFormArea = document.getElementById('loginFormArea');
const registerFormArea = document.getElementById('registerFormArea');
const loginSuccess = document.getElementById('loginSuccess');
const mainNav = document.getElementById('mainNav');
const authBtn = document.getElementById('authBtn');
const adminBtn = document.getElementById('adminBtn');

function isUserLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

function isAdmin() {
  return localStorage.getItem('currentUserRole') === 'admin';
}

function showPage(page) {
  if (!pages.includes(page)) return;

  if (!isUserLoggedIn() && page !== 'login') {
    alert('Maaf, Anda harus login/membuat akun terlebih dahulu!');
    page = 'login';
    toggleAuthForm('login');
  }

  if (page === 'admin' && !isAdmin()) {
    alert('Akses Ditolak! Halaman ini khusus untuk manajemen Admin Panel.');
    page = 'home';
  }

  document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));

  const targetSection = document.getElementById(page);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  if (page === 'admin') {
    renderAdminTable();
  }

  document.querySelectorAll('[data-page]').forEach(button => {
    const isActive = button.getAttribute('data-page') === page;
    button.classList.toggle('text-orange-500', isActive);
  });

  window.history.replaceState(null, '', '#' + page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleAuthForm(type) {
  if (type === 'register') {
    loginFormArea.classList.add('hidden');
    registerFormArea.classList.remove('hidden');
    loginSuccess.classList.add('hidden');
  } else if (type === 'login') {
    loginFormArea.classList.remove('hidden');
    registerFormArea.classList.add('hidden');
    loginSuccess.classList.add('hidden');
  }
}

function handleAuthAction() {
  if (isUserLoggedIn()) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserRole');
    alert('Berhasil Logout.');
    updateUIForAuth();
    showPage('login');
  } else {
    showPage('login');
  }
}

function updateUIForAuth() {
  if (isUserLoggedIn()) {
    mainNav.classList.remove('hidden');
    authBtn.textContent = 'LOGOUT';
    authBtn.classList.replace('btn-fire', 'bg-zinc-800');
    
    if (isAdmin()) {
      adminBtn.classList.remove('hidden');
    } else {
      adminBtn.classList.add('hidden');
    }
  } else {
    mainNav.classList.add('hidden');
    adminBtn.classList.add('hidden');
    authBtn.textContent = 'LOGIN';
    authBtn.className = 'btn-fire px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition';
  }
}

function handleRegister(event) {
  event.preventDefault();
  const user = document.getElementById('regUser').value.trim().toLowerCase();
  const pass = document.getElementById('regPass').value.trim();

  if (!user || !pass) return;

  if (localStorage.getItem('user_' + user)) {
    alert('Username sudah terdaftar!');
    return;
  }

  localStorage.setItem('user_' + user, pass);
  alert('Akun berhasil dibuat! Silakan login.');
  
  document.getElementById('regUser').value = '';
  document.getElementById('regPass').value = '';
  toggleAuthForm('login');
}

function handleLogin(event) {
  event.preventDefault();
  const user = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value.trim();
  const savedPassword = localStorage.getItem('user_' + user);

  if (user === 'admin' && pass === 'admin123') {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUserRole', 'admin');
    loginFormArea.classList.add('hidden');
    registerFormArea.classList.add('hidden');
    loginSuccess.classList.remove('hidden');
    updateUIForAuth();
    return;
  }

  if (savedPassword && savedPassword === pass) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUserRole', 'buyer');
    loginFormArea.classList.add('hidden');
    registerFormArea.classList.add('hidden');
    loginSuccess.classList.remove('hidden');
    updateUIForAuth();
  } else {
    alert('Username atau Password salah!');
  }
}

function openDetail(title, price, description, img) {
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex'); 
  document.body.style.overflow = 'hidden';

  modalTitle.textContent = title;
  modalPrice.textContent = price;
  modalImg.src = img;
  modalImg.alt = title;

  document.getElementById('orderItemTitle').value = title;
  document.getElementById('orderItemPrice').value = price;

  modalSpecs.innerHTML = `
    <div class="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-[10px] uppercase font-black tracking-widest text-white">
      <p class="mb-2">Deskripsi:</p>
      <p class="text-zinc-400 leading-relaxed">${description}</p>
    </div>
    <div class="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-[10px] uppercase font-black tracking-widest text-white">
      <p class="mb-2">Kondisi:</p>
      <p class="text-zinc-400">Akun siap pakai, aman, tanpa hackback.</p>
    </div>
  `;

  modalDetail.classList.remove('hidden');
  modalForm.classList.add('hidden');
  modalSuccess.classList.add('hidden');
}

function showPurchaseForm() {
  if (!modal) return;
  modalDetail.classList.add('hidden');
  modalForm.classList.remove('hidden');
}

function handleOrder(event) {
  event.preventDefault();
  if (!modal) return;

  const itemTitle = document.getElementById('orderItemTitle').value;
  const itemPrice = document.getElementById('orderItemPrice').value;
  const buyerName = document.getElementById('buyerName').value.trim();
  const buyerWa = document.getElementById('buyerWhatsapp').value.trim();

  const newOrder = {
    id: "TRX-" + Date.now(),
    tanggal: new Date().toLocaleString('id-ID'),
    namaProduk: itemTitle,
    hargaProduk: itemPrice,
    namaPembeli: buyerName,
    whatsapp: buyerWa
  };

  let databasePembelian = JSON.parse(localStorage.getItem('database_pembelian')) || [];
  databasePembelian.push(newOrder);
  localStorage.setItem('database_pembelian', JSON.stringify(databasePembelian));

  document.getElementById('buyerName').value = '';
  document.getElementById('buyerWhatsapp').value = '';

  modalForm.classList.add('hidden');
  modalSuccess.classList.remove('hidden');
}

// Diperbarui: Menampilkan tabel admin dengan penambahan tombol aksi chat otomatis
function renderAdminTable() {
  const tableBody = document.getElementById('adminOrderTable');
  const emptyState = document.getElementById('emptyState');
  const databasePembelian = JSON.parse(localStorage.getItem('database_pembelian')) || [];

  tableBody.innerHTML = '';

  if (databasePembelian.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  databasePembelian.forEach(order => {
    const row = document.createElement('tr');
    row.className = "hover:bg-zinc-800/40 transition-colors border-b border-zinc-800/30";
    row.innerHTML = `
      <td class="p-4 text-orange-500 font-mono">${order.id}</td>
      <td class="p-4 text-zinc-400 font-normal">${order.tanggal}</td>
      <td class="p-4 text-white">${order.namaProduk}</td>
      <td class="p-4 text-orange-500 font-mono">${order.hargaProduk}</td>
      <td class="p-4 text-white font-normal">${order.namaPembeli}</td>
      <td class="p-4 text-zinc-400 font-mono select-all">${order.whatsapp}</td>
      <td class="p-4 text-center">
         <button onclick="redirectToWhatsapp('${order.whatsapp}', '${order.namaPembeli}', '${order.namaProduk}', '${order.id}')" class="bg-green-600 hover:bg-green-500 text-white font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-xl transition shadow-lg">
            <i class="fab fa-whatsapp mr-1 text-xs"></i> Hubungi WA
         </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Fitur Baru: Otomatis memformat nomor telepon & menyusun teks template isi chat WA
function redirectToWhatsapp(phone, name, product, trxId) {
  let formattedPhone = phone.trim();
  
  // Deteksi dan konversi otomatis angka awal '0' menjadi kode internasional '62'
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.slice(1);
  }

  // Merangkai isi teks pesan (Enkripsi spasi dan baris baru menggunakan %0A)
  const message = `Halo ${name},%0A%0ASaya admin dari LOKALMARKET.ID.%0AMenindaklanjuti data booking akun game Anda:%0A*ID Transaksi:* ${trxId}%0A*Produk:* ${product}%0A%0AApakah pesanan Anda ingin segera diproses untuk serah terima data?`;

  // Buka URL tautan WhatsApp di tab browser baru
  window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
}

function closeModal() {
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

window.addEventListener('DOMContentLoaded', () => {
  updateUIForAuth();
  const hash = window.location.hash.replace('#', '');
  if (isUserLoggedIn()) {
    
showPage(pages.includes(hash) && hash !== 'login' ? hash : 'home');
  } else {
    showPage('login');
  }
});
