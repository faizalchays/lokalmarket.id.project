const pages = ['home', 'katalog', 'testimoni', 'login'];

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
