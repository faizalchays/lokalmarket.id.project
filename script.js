function showPage(p) {
document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
document.getElementById(p).classList.add('active');
window.scrollTo(0,0);
}