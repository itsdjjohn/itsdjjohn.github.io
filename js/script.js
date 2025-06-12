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
    'buy-ticket': 'Adquirir Entradas',
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
    'form-success': '¡Mensaje enviado con éxito!',
    'form-error': 'Error al enviar el mensaje. Por favor, intenta de nuevo.',
    'form-invalid-email': 'Correo inválido.',
    'form-invalid-name': 'El nombre es requerido.',
    'form-invalid-message': 'El mensaje es requerido.'
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
    'form-success': 'Message sent successfully!',
    'form-error': 'Error sending message. Please try again.',
    'form-invalid-email': 'Invalid email.',
    'form-invalid-name': 'Name is required.',
    'form-invalid-message': 'Message is required.'
  }
};

function changeLanguage() {
  const lang = document.getElementById('language-select')?.value || 'es';
  localStorage.setItem('language', lang);
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    element.textContent = translations[lang][element.getAttribute('data-lang-key')];
  });
  document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
    element.placeholder = translations[lang][element.getAttribute('data-lang-placeholder')];
  });
  if (document.getElementById('hero-text')) {
    typeWriter(translations[lang]['hero-text'], 'hero-text', 50);
  }
  if (document.getElementById('tour-js')) {
    loadEvents();
  }
}

async function loadEvents() {
  const eventList = document.getElementById('event-list');
  if (!eventList) return;
  const lang = document.getElementById('language-select')?.value || 'es';
  eventList.innerHTML = '<div class="event-info">Loading...</div>';

  try {
    const response = await fetch('https://rest.bandsintown.com/artists/id_868569/events?app_id=6bb274c027f79a0d57321c284def39a1b357');
    if (!response.ok) throw new Error('Network response was not ok');
    const events = await response.json();
    const now = new Date();
    const futureEvents = events.filter(event => new Date(event.datetime) >= now);

    eventList.innerHTML = '';
    if (futureEvents.length === 0) {
      eventList.innerHTML = `<p class="event-error">${lang === 'es' ? 'No hay eventos próximos.' : 'No upcoming events.'}</p>`;
      return;
    }

    futureEvents.forEach((event, index) => {
      const date = new Date(event.datetime);
      const formattedDate = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date).replace(/^./, str => str.toUpperCase());

      const eventItem = document.createElement('div');
      eventItem.className = 'event-item';
      eventItem.style.animationDelay = `${index * 0.1}s`;
      let buttonsHTML = '';

      const hasTicketUrl = event.ticket_url && event.ticket_url.trim() !== '';
      const offers = event.offers || [];
      const validOffers = offers.filter(offer => offer.url && offer.url.trim() !== '');
      const hasTwoOffers = validOffers.length === 2;

      if (hasTicketUrl) {
        buttonsHTML += `
          <a href="${event.ticket_url}" class="btn-primary" target="_blank" data-lang-key="buy-ticket" aria-label="${translations[lang]['buy-ticket']}">
            ${translations[lang]['buy-ticket']}
          </a>
        `;
      } else if (validOffers.length > 0) {
        buttonsHTML += `
          <a href="${validOffers[0].url}" class="btn-primary" target="_blank" data-lang-key="buy-ticket" aria-label="${translations[lang]['buy-ticket']}">
            ${translations[lang]['buy-ticket']}
          </a>
        `;
      } else {
        buttonsHTML += `
          <a href="${event.url}" class="btn-primary" target="_blank" data-lang-key="notify-me" aria-label="${translations[lang]['notify-me']}">
            ${translations[lang]['notify-me']}
          </a>
        `;
      }

      if (hasTwoOffers) {
        buttonsHTML += `
          <a href="${validOffers[1].url}" class="btn-primary" target="_blank" data-lang-key="guest-list" aria-label="${translations[lang]['guest-list']}">
            ${translations[lang]['guest-list']}
          </a>
        `;
      }

      eventItem.innerHTML = `
        <div class="event-info">
          <strong>📅 ${formattedDate}</strong>
          <h3>${event.title || 'Evento sin título'}</h3>
          <span>📍 ${event.venue.city}, ${event.venue.country}</span>
        </div>
        <div class="event-buttons">
          ${buttonsHTML}
        </div>
      `;
      eventList.appendChild(eventItem);
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    eventList.innerHTML = `<p class="event-error">${lang === 'es' ? 'Error al cargar los eventos.' : 'Error loading events.'}</p>`;
  }
}

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
    } else {
      setTimeout(() => typeWriter(text, elementId, speed), 3000);
    }
  }
  type();
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('language') || 'es';
  if (document.getElementById('language-select')) {
    document.getElementById('language-select').value = savedLang;
  }
  changeLanguage();

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('nav-active');
      menuToggle.setAttribute('aria-expanded', isActive.toString());
    });
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) {
        navLinks.classList.remove('nav-active');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  if (document.getElementById('language-select')) {
    document.getElementById('language-select').addEventListener('change', () => {
      if (navLinks) {
        navLinks.classList.remove('nav-active');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
      changeLanguage();
    });
  }

  const contactForm = document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.classList.add('loading');
      submitButton.disabled = true;

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const lang = document.getElementById('language-select')?.value || 'es';

      if (!name) {
        contactForm.insertAdjacentHTML('beforeend', `<p class="form-error">${translations[lang]['form-invalid-name']}</p>`);
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        setTimeout(() => contactForm.querySelector('.form-error')?.remove(), 3000);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        contactForm.insertAdjacentHTML('beforeend', `<p class="form-error">${translations[lang]['form-invalid-email']}</p>`);
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        setTimeout(() => contactForm.querySelector('.form-error')?.remove(), 3000);
        return;
      }
      if (!message) {
        contactForm.insertAdjacentHTML('beforeend', `<p class="form-error">${translations[lang]['form-invalid-message']}</p>`);
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        setTimeout(() => contactForm.querySelector('.form-error')?.remove(), 3000);
        return;
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(contactForm)
        });
        if (response.ok) {
          contactForm.reset();
          contactForm.insertAdjacentHTML('beforeend', `<p class="form-success">${translations[lang]['form-success']}</p>`);
          setTimeout(() => contactForm.querySelector('.form-success')?.remove(), 3000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        contactForm.insertAdjacentHTML('beforeend', `<p class="form-error">${translations[lang]['form-error']}</p>`);
        setTimeout(() => contactForm.querySelector('.form-error')?.remove(), 3000);
      } finally {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
      }
    });
  }

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

  const preloader = document.getElementById('preloader');
  const content = document.getElementById('content');
  if (preloader && content) {
    const hidePreloader = () => {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
        content.style.display = 'block';
      }, 500);
      if (document.getElementById('event-list')) {
        loadEvents();
      }
    };
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 5000);
  }
});