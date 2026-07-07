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