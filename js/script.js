const translations = {
  es: {
    'nav-home': 'Inicio',
    'nav-tour': 'Tour',
    'nav-bio': 'Biografía',
    'nav-contact': 'Contacto',
    'hero-title': 'DJ John',
    'hero-text': '¡Llevando los ritmos a Panamá y más allá!',
    'hero-cta': 'Ver Fechas de Tour',
    'tour-title': 'Próximos Eventos',
    'buy-ticket': 'Comprar Entradas',
    'notify-me': 'Notificarme',
    'guest-list': 'Lista de Invitados',
    'bio-title': 'Biografía',
    'bio-text': 'DJ John es un DJ y productor, nacido en la Ciudad de Panamá. Es conocido por su estilo único y su habilidad para mezclar diferentes géneros. Comenzó su carrera en la escena de la música electrónica a los 13 años, tocando en fiestas y eventos locales. Eventualmente, su talento y dedicación lo llevaron a presentarse en clubes de renombre nacional. Ha tocado en algunos de los festivales más grandes de Panamá como PARADISE 507 y PARADISE PESKITO (Carnavales).',
    'contact-title': 'Contacto',
    'contact-name': 'Tu nombre',
    'contact-email': 'Tu correo',
    'contact-message': '¿En qué puedo ayudarte?',
    'contact-submit': 'Enviar',
    'contact-bookings': 'Bookings: esquiveljohn2@gmail.com',
    'footer-follow': 'Sígueme en:',
    'footer-copyright': '© 2025 DJ John. Todos los derechos reservados.',
    'form-success': '¡Mensaje enviado con éxito!'
  },
  en: {
    'nav-home': 'Home',
    'nav-tour': 'Tour',
    'nav-bio': 'Biography',
    'nav-contact': 'Contact',
    'hero-title': 'DJ John',
    'hero-text': 'Bringing the beats to Panama and beyond!',
    'hero-cta': 'Check Tour Dates',
    'tour-title': 'Upcoming Events',
    'buy-ticket': 'Buy Tickets',
    'notify-me': 'Notify Me',
    'guest-list': 'Guest List',
    'bio-title': 'Biography',
    'bio-text': 'DJ John is a DJ and producer, born in Panama City. He is known for his unique style and ability to mix different genres. He began his career in the electronic music scene at age 13, playing at local parties and events. Eventually, his talent and dedication led him to play in nationally renowned clubs. He has played some of the biggest festivals in Panama like PARADISE 507 and PARADISE PESKITO (Carnivals).',
    'contact-title': 'Contact',
    'contact-name': 'Your name',
    'contact-email': 'Your email',
    'contact-message': 'How can I help you?',
    'contact-submit': 'Send',
    'contact-bookings': 'Bookings: esquiveljohn2@gmail.com',
    'footer-follow': 'Follow me on:',
    'footer-copyright': '© 2025 DJ John. All rights reserved.',
    'form-success': 'Message sent successfully!'
  }
};

function changeLanguage() {
  const lang = document.getElementById('language-select').value;
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    element.textContent = translations[lang][element.getAttribute('data-lang-key')];
  });
  document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
    element.placeholder = translations[lang][element.getAttribute('data-lang-placeholder')];
  });
  if (document.getElementById('event-list')) {
    loadEvents();
  }
}

async function loadEvents() {
  const eventList = document.getElementById('event-list');
  if (!eventList) return;
  const lang = document.getElementById('language-select').value;
  eventList.innerHTML = '';

  try {
    const response = await fetch('https://rest.bandsintown.com/artists/id_86889/events?app_id=6ddc274027f79a574321428def39a357');
    const events = await response.json();
    const now = new Date();
    const futureEvents = events.filter(event => new Date(event.datetime) >= now);

    if (futureEvents.length === 0) {
      eventList.innerHTML = `<p class="event-error">${lang === 'es' ? 'No hay eventos próximos.' : 'No upcoming events.'}</p>`;
      return;
    }

    futureEvents.forEach(event => {
      const date = new Date(event.datetime);
      const formattedDate = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date).replace(/^./, str => str.toUpperCase());

      const imageUrl = event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342da8d948?q=80&w=1080&h=1080&fit=crop';

      // Botones
      let buttonsHTML = '';
      const hasTicketUrl = event.ticket_url && event.ticket_url.trim() !== '';
      const offers = event.offers || [];
      const validOffers = offers.filter(offer => offer.url && offer.url.trim() !== '');
      const hasTwoOffers = validOffers.length === 2;

      if (hasTicketUrl) {
        buttonsHTML += `
          <a href="${event.ticket_url}" class="btn-primary" target="_blank" data-lang-key="buy-ticket">
            ${translations[lang]['buy-ticket']}
          </a>
        `;
      } else if (validOffers.length > 0) {
        buttonsHTML += `
          <a href="${validOffers[0].url}" class="btn-primary" target="_blank" data-lang-key="buy-ticket">
            ${translations[lang]['buy-ticket']}
          </a>
        `;
      } else {
        buttonsHTML += `
          <a href="${event.url}" class="btn-primary" target="_blank" data-lang-key="notify-me">
            ${translations[lang]['notify-me']}
          </a>
        `;
      }

      if (hasTwoOffers) {
        buttonsHTML += `
          <a href="${validOffers[1].url}" class="btn-primary" target="_blank" data-lang-key="guest-list">
            ${translations[lang]['guest-list']}
          </a>
        `;
      }

      // Estructura cuadrada 1080x1080 con info abajo
      const eventItem = document.createElement('div');
      eventItem.className = 'event-square';
      eventItem.innerHTML = `
        <div class="event-square-img-container">
          <img src="${imageUrl}" alt="${event.title}" class="event-square-img">
        </div>
        <div class="event-square-info">
          <div class="event-square-date">${formattedDate}</div>
          <h3 class="event-square-title">${event.title}</h3>
          <div class="event-square-location">📍 ${event.venue.city}, ${event.venue.country}</div>
          <div class="event-buttons">
            ${buttonsHTML}
          </div>
        </div>
      `;
      eventList.appendChild(eventItem);
    });
  } catch (error) {
    console.error('Error al cargar eventos:', error);
    eventList.innerHTML = `<p class="event-error">${lang === 'es' ? 'Error al cargar los eventos.' : 'Error loading events.'}</p>`;
  }
}

// Menú responsive: toggle y cierre seguro
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-active');
    });
  });
}

// Cambio de idioma y cierre de menú en móvil
const languageSelect = document.getElementById('language-select');
if (languageSelect) {
  languageSelect.addEventListener('change', () => {
    if (navLinks) navLinks.classList.remove('nav-active');
    if (document.getElementById('hero-text')) {
      const lang = languageSelect.value;
      const heroText = translations[lang]['hero-text'];
      typeWriter(heroText, 'hero-text', 50);
    }
  });
}

document.getElementById('language-select').addEventListener('change', () => {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.remove('nav-active');
  if (document.getElementById('hero-text')) {
    const lang = document.getElementById('language-select').value;
    const heroText = translations[lang]['hero-text'];
    typeWriter(heroText, 'hero-text', 50);
  }
});

function typeWriter(text, elementId, speed = 50) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  const content = document.getElementById('content');
  preloader.classList.add('hidden');
  setTimeout(() => {
    preloader.style.display = 'none';
    content.style.display = 'block';
  }, 500);
}

window.addEventListener('load', () => {
  hidePreloader();
  if (document.getElementById('hero-text')) {
    const lang = document.getElementById('language-select').value;
    const heroText = translations[lang]['hero-text'];
    typeWriter(heroText, 'hero-text', 50);
  }
});

setTimeout(() => {
  hidePreloader();
}, 3000); // Reducido para mejor UX

// IntersectionObserver para animar secciones (solo si existen)
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
}

// Formspree success message
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const successMessage = form.nextElementSibling;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        form.reset();
        successMessage.style.display = 'block';
        successMessage.textContent = translations[document.getElementById('language-select').value]['form-success'];
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 3000);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  });
}