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
    'bio-text': 'DJ John es un DJ y productor, nacido en la Ciudad de Panamá. Es conocido por su estilo único y su habilidad para mezclar diferentes géneros. Comenzó su carrera en la escena de los eventos a los 18 años, tocando en fiestas y eventos locales. Actualmente, su talento y dedicación lo han llevado a presentarse en eventos de renombre nacional. Ha participado en algunos de los eventos más grandes de Panamá como el Carnaval de Panamá.',
    'contact-title': 'Contacto',
    'contact-name': 'Tu Nombre',
    'contact-email': 'Tu Email',
    'contact-message': '¿En qué puedo ayudarte?',
    'contact-submit': 'Enviar',
    'contact-bookings': 'Bookings: contacto@itsdjjohn.com',
    'footer-follow': 'Sígueme en:',
    'footer-copyright': '© 2025 DJ John. Todos los derechos reservados.',
    'form-success': '¡Mensaje enviado con éxito!',
    'form-error': 'Error al enviar el mensaje. Por favor, intenta de nuevo.',
    'form-invalid-email': 'Correo inválido.',
    'form-invalid-name': 'El nombre es requerido.',
    'form-invalid-message': 'El mensaje es requerido.',
    'event-error': 'No se pudieron cargar los eventos. Verifica tu conexión o intenta de nuevo más tarde.'
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
    'bio-text': 'DJ John is a DJ and producer, born in Panama City. He is known for his unique style and ability to mix different genres. He began his career in the electronic music scene at age 18, performing at local parties and events. Eventually, his talent and charisma led him to perform at nationally renowned events. He has played at major Panama events like the Panama Carnival.',
    'contact-title': 'Contact',
    'contact-name': 'Your Name',
    'contact-email': 'Your Email',
    'contact-message': 'How can I assist you?',
    'contact-submit': 'Send',
    'contact-bookings': 'Bookings: contacto@itsdjjohn.com',
    'footer-follow': 'Follow me on:',
    'footer-copyright': '© 2025 DJ John. All rights reserved.',
    'form-success': 'Message sent successfully!',
    'form-error': 'Error sending message. Please try again.',
    'form-invalid-email': 'Invalid email.',
    'form-invalid-name': 'Name is required.',
    'form-invalid-message': 'Message is required.',
    'event-error': 'Could not load events. Check your connection or try again later.'
  }
};

function changeLanguage() {
  const lang = document.getElementById('language-select')?.value || 'es';
  localStorage.setItem('language', lang);
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    element.textContent = translations[lang][element.getAttribute('data-lang-key')];
  });
  document.querySelectorAll('[data-placeholder-key]').forEach(element => {
    element.placeholder = translations[lang][element.getAttribute('data-placeholder-key')];
  });
  if (document.getElementById('hero-text')) {
    typeWriter(translations[lang]['hero-text'], 'hero-text', 50);
  }
  if (document.getElementById('event-list')) {
    loadEvents();
  }
}

async function loadEvents() {
  const eventList = document.getElementById('event-list');
  if (!eventList) return;
  const lang = document.getElementById('language-select')?.value || 'es';
  eventList.innerHTML = '<p class="event-info">Cargando...</p>';

  const fallbackEvents = [
    {
      datetime: '2025-07-15T20:00:00',
      title: 'Carnaval de Panamá',
      venue: { city: 'Ciudad de Panamá', country: 'Panamá' },
      url: 'https://www.bandsintown.com'
    }
  ];

  try {
    const response = await fetch('https://rest.bandsintown.com/artists/id_86889/events?app_id=6ddc274027f79a574321428def39a357');
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error('Respuesta inválida de la API');
    }
    const now = new Date();
    const futureEvents = events.filter(event => event.datetime && new Date(event.datetime) >= now);

    eventList.innerHTML = '';
    const eventsToRender = futureEvents.length > 0 ? futureEvents : fallbackEvents;

    eventsToRender.forEach((event, i) => {
      const date = new Date(event.datetime);
      const formattedDate = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date).replace(/^./, str => str.toUpperCase());

      const eventItem = document.createElement('div');
      eventItem.className = 'event-item';
      eventItem.style.animationDelay = `${i * 0.2}s`;
      eventItem.innerHTML = `
        <div class="event-info">
          <strong>📅 ${formattedDate}</strong>
          <h3>${event.title || 'Evento sin título'}</h3>
          <span>📍 ${event.venue?.city || 'Ciudad no especificada'}, ${event.venue?.country || 'País no especificado'}</span>
        </div>
        <div class="event-buttons">
          <a href="${event.url || 'https://www.bandsintown.com'}" class="btn-primary" target="_blank" data-lang-key="buy-ticket" aria-label="${translations[lang]['buy-ticket']}">${translations[lang]['buy-ticket']}</a>
        </div>
      `;
      eventList.appendChild(eventItem);
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    eventList.innerHTML = `<p class="event-error">${translations[lang]['event-error']}</p>`;
    // Mostrar evento de respaldo
    fallbackEvents.forEach((event, i) => {
      const date = new Date(event.datetime);
      const formattedDate = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date).replace(/^./, str => str.toUpperCase());

      const eventItem = document.createElement('div');
      eventItem.className = 'event-item';
      eventItem.style.animationDelay = `${i * 0.2}s`;
      eventItem.innerHTML = `
        <div class="event-info">
          <strong>📅 ${formattedDate}</strong>
          <h3>${event.title}</h3>
          <span>📍 ${event.venue.city}, ${event.venue.country}</span>
        </div>
        <div class="event-buttons">
          <a href="${event.url}" class="btn-primary" target="_blank" data-lang-key="buy-ticket" aria-label="${translations[lang]['buy-ticket']}">${translations[lang]['buy-ticket']}</a>
        </div>
      `;
      eventList.appendChild(eventItem);
    });
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
      const lang = localStorage.getItem('language') || 'es';

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
        const response = await fetch('https://formspree.io/f/mgvkeyrd', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(contactForm)
        });
        if (response.ok) {
          contactForm.reset();
          contactForm.insertAdjacentHTML('beforeend', `<p class="form-success">${translations[lang]['form-success']}</p>`);
          setTimeout(() => contactForm.querySelector('.form-success')?.remove(), 3000);
        } else {
          throw new Error('Error al enviar el formulario');
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
    setTimeout(hidePreloader, 3000);
  }
});