// PRELOADER
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const content = document.getElementById('content');
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      content.style.display = 'block';
    }, 800);
  }, 500);
});

// MENU
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
});

// TRADUCCIÓN
const translations = {
  es: { "nav-home": "Inicio", "nav-tour": "Tour", "nav-bio": "Bio", "nav-contact": "Contacto" },
  en: { "nav-home": "Home", "nav-tour": "Tour", "nav-bio": "Bio", "nav-contact": "Contact" }
};

function changeLanguage() {
  const lang = document.getElementById('language-select').value;
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
}
changeLanguage();