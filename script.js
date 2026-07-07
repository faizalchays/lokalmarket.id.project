const pages = ['home', 'katalog', 'testimoni', 'login'];
const modal = document.getElementById('accountModal');
const modalDetail = document.getElementById('modalDetail');
const modalForm = document.getElementById('modalForm');
const modalSuccess = document.getElementById('modalSuccess');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalImg = document.getElementById('modalImg');
const modalSpecs = document.getElementById('modalSpecs');
const loginFormArea = document.getElementById('loginFormArea');
const loginSuccess = document.getElementById('loginSuccess');

function showPage(page) {
  if (!pages.includes(page)) return;

  document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));

  const targetSection = document.getElementById(page) || document.getElementById('home');
  if (targetSection) {
    targetSection.classList.add('active');
  }

  document.querySelectorAll('[data-page]').forEach(button => {
    const isActive = button.getAttribute('data-page') === page;
    button.classList.toggle('text-orange-500', isActive);
    button.classList.toggle('nav-link-active', isActive);
  });

  window.history.replaceState(null, '', '#' + page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  if (pages.includes(hash)) {
    showPage(hash);
  } else {
    showPage('home');
  }
});

function openDetail(title, price, description, img) {
  if (!modal) return;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  modalTitle.textContent = title;
  modalPrice.textContent = price;
  modalImg.src = img;
  modalImg.alt = title;

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
  modalSuccess.classList.add('hidden');
}

function handleLogin(event) {
  event.preventDefault();
  if (!loginFormArea || !loginSuccess) return;

  loginFormArea.classList.add('hidden');
  loginSuccess.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleOrder(event) {
  event.preventDefault();
  if (!modal) return;

  modalForm.classList.add('hidden');
  modalSuccess.classList.remove('hidden');
}

function closeModal() {
  if (!modal) return;

  modal.classList.add('hidden');
  document.body.style.overflow = '';

  modalDetail.classList.remove('hidden');
  modalForm.classList.add('hidden');
  modalSuccess.classList.add('hidden');
}
