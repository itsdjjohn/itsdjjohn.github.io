// DJ John - Artist Website JavaScript
// Professional template functionality

document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    initPreloader();
    initNavigation();
    initScrollEffects();
    loadEvents();
    initContactForm();
    initLanguageSwitcher();
});

// Preloader
function initPreloader() {
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1800);
    });
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Scroll reveal effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('reveal-on-scroll');
        observer.observe(section);
    });
}

// Bandsintown API - Load Events
async function loadEvents() {
    const container = document.getElementById('eventsContainer');
    const emptyState = document.getElementById('eventsEmpty');
    
    try {
        const response = await fetch(
            'https://rest.bandsintown.com/artists/id_86889/events?app_id=itsdjjohn.com'
        );
        
        if (!response.ok) throw new Error('API Error');
        
        const events = await response.json();
        const now = new Date();
        
        // Filter upcoming events
        const upcomingEvents = events.filter(event => 
            new Date(event.datetime) > now
        ).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        if (upcomingEvents.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        // Render events
        container.innerHTML = upcomingEvents.map(event => {
            const date = new Date(event.datetime);
            const day = date.getDate();
            const month = date.toLocaleDateString('es-PA', { month: 'short' }).toUpperCase();
            const venue = event.venue;
            
            return `
                <article class="event-card">
                    <div class="event-date">
                        <span class="event-day">${day}</span>
                        <span class="event-month">${month}</span>
                    </div>
                    <div class="event-info">
                        <h3>${venue.name}</h3>
                        <p>${venue.city}${venue.region ? ', ' + venue.region : ''}, ${venue.country}</p>
                    </div>
                    <a href="${event.url || '#'}" class="btn btn-primary" target="_blank" rel="noopener">
                        Tickets
                    </a>
                </article>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading events:', error);
        emptyState.style.display = 'block';
        emptyState.querySelector('p').textContent = 'No se pudieron cargar los eventos';
    }
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Enviando...</span><i class="fas fa-spinner fa-spin"></i>';
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            const response = await fetch('https://formspree.io/f/mnqebgje', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                submitBtn.innerHTML = '<span>¡Enviado!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = '#22c55e';
                form.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Form error');
            }
            
        } catch (error) {
            submitBtn.innerHTML = '<span>Error</span><i class="fas fa-times"></i>';
            submitBtn.style.background = '#dc2626';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}

// Language Switcher
function initLanguageSwitcher() {
    const langSelect = document.getElementById('langSelect');
    
    const translations = {
        es: {
            'hero-subtitle': 'Panamá City',
            'hero-desc': 'Música, energía y vibra única',
            'btn-events': 'Ver Eventos',
            'btn-contact': 'Contactar',
            'events-eyebrow': 'Tour Dates',
            'events-title': 'Próximos Eventos',
            'no-events': 'No hay eventos programados actualmente',
            'view-all': 'Ver todos los eventos',
            'about-eyebrow': 'Biografía',
            'about-title': 'Quién Soy',
            'bio-p1': 'DJ John es un DJ y productor nacido en la Ciudad de Panamá. Es conocido por su estilo único y su capacidad para mezclar diferentes géneros musicales, creando sets inolvidables que mantienen a la pista de baile en constante movimiento.',
            'bio-p2': 'Comenzó su carrera en la música electrónica a los 13 años tocando en eventos locales, y rápidamente escaló para convertirse en uno de los nombres más reconocidos de la escena crossover panameña.',
            'highlights-title': 'Highlights',
            'contact-eyebrow': 'Booking & Management',
            'contact-title': 'Contacto',
            'form-name': 'Nombre',
            'form-email': 'Email',
            'form-subject': 'Asunto',
            'form-message': 'Mensaje',
            'form-send': 'Enviar mensaje',
            'stat-years': 'Años de experiencia',
            'stat-events': 'Eventos realizados',
            'stat-fans': 'Seguidores',
            'footer-tagline': 'Música sin fronteras',
            'footer-rights': 'Todos los derechos reservados',
            'nav-home': 'Inicio',
            'nav-events': 'Eventos',
            'nav-about': 'Bio',
            'nav-contact': 'Contacto'
        },
        en: {
            'hero-subtitle': 'Panama City',
            'hero-desc': 'Music, energy and unique vibes',
            'btn-events': 'View Events',
            'btn-contact': 'Contact',
            'events-eyebrow': 'Tour Dates',
            'events-title': 'Upcoming Events',
            'no-events': 'No events scheduled at this time',
            'view-all': 'View all events',
            'about-eyebrow': 'Biography',
            'about-title': 'About Me',
            'bio-p1': 'DJ John is a DJ and producer born in Panama City. He is known for his unique style and ability to blend different musical genres, creating unforgettable sets that keep the dance floor moving.',
            'bio-p2': 'He started his career in electronic music at age 13 playing at local events, and quickly rose to become one of the most recognized names in the Panamanian crossover scene.',
            'highlights-title': 'Highlights',
            'contact-eyebrow': 'Booking & Management',
            'contact-title': 'Contact',
            'form-name': 'Name',
            'form-email': 'Email',
            'form-subject': 'Subject',
            'form-message': 'Message',
            'form-send': 'Send message',
            'stat-years': 'Years experience',
            'stat-events': 'Events performed',
            'stat-fans': 'Followers',
            'footer-tagline': 'Music without borders',
            'footer-rights': 'All rights reserved',
            'nav-home': 'Home',
            'nav-events': 'Events',
            'nav-about': 'Bio',
            'nav-contact': 'Contact'
        }
    };
    
    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        const t = translations[lang];
        
        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });
        
        // Update HTML lang
        document.documentElement.lang = lang;
    });
}

// Add reveal animation styles
const style = document.createElement('style');
style.textContent = `
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .reveal-on-scroll.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-toggle.active .hamburger {
        background: transparent;
    }
    
    .nav-toggle.active .hamburger::before {
        top: 0;
        transform: rotate(45deg);
    }
    
    .nav-toggle.active .hamburger::after {
        bottom: 0;
        transform: rotate(-45deg);
    }
`;
document.head.appendChild(style);