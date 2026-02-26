// DJ John Website - Fixed Version
// API Key: 6ddc274027f79a574321428def39a357

document.addEventListener('DOMContentLoaded', function() {
    // Initialize preloader removal
    initPreloader();
    
    // Initialize navigation
    initNavigation();
    
    // Load events from Bandsintown
    loadEvents();
    
    // Initialize language switcher
    initLanguageSwitcher();
    
    // Initialize contact form
    initContactForm();
});

// Preloader - Always hide after animation
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    // Force hide after 2 seconds maximum
    setTimeout(function() {
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 2000);
    
    // Also hide when page fully loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (preloader) {
                preloader.classList.add('hidden');
            }
        }, 500);
    });
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu on link click
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// Bandsintown API - Load Events
function loadEvents() {
    const container = document.getElementById('events');
    const noEvents = document.getElementById('no-events');
    
    // API Configuration
    const appId = '6ddc274027f79a574321428def39a357';
    const artistId = 'id_86889';
    const apiUrl = 'https://rest.bandsintown.com/artists/' + artistId + '/events?app_id=' + appId;
    
    // Fetch events
    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            return response.json();
        })
        .then(function(events) {
            // Check if events is array and has items
            if (!Array.isArray(events) || events.length === 0) {
                showNoEvents();
                return;
            }
            
            const now = new Date();
            let hasUpcoming = false;
            
            // Clear container
            container.innerHTML = '';
            
            // Process events
            events.forEach(function(event) {
                const eventDate = new Date(event.datetime);
                
                // Skip past events
                if (eventDate < now) return;
                
                hasUpcoming = true;
                
                // Format date
                const day = eventDate.getDate();
                const month = eventDate.toLocaleDateString('es-PA', { month: 'short' }).toUpperCase();
                
                // Get venue info
                const venue = event.venue || {};
                const venueName = venue.name || 'TBA';
                const city = venue.city || 'TBA';
                const country = venue.country || '';
                
                // Ticket URL
                const ticketUrl = event.url || '#';
                
                // Create event card
                const card = document.createElement('div');
                card.className = 'event-card';
                card.innerHTML = 
                    '<div class="event-date">' +
                        '<span class="event-day">' + day + '</span>' +
                        '<span class="event-month">' + month + '</span>' +
                    '</div>' +
                    '<div class="event-info">' +
                        '<h3>' + venueName + '</h3>' +
                        '<p>' + city + (country ? ', ' + country : '') + '</p>' +
                    '</div>' +
                    '<a href="' + ticketUrl + '" class="btn btn-primary" target="_blank">Tickets</a>';
                
                container.appendChild(card);
            });
            
            // Show message if no upcoming events
            if (!hasUpcoming) {
                showNoEvents();
            }
        })
        .catch(function(error) {
            console.error('Error loading events:', error);
            showNoEvents();
        });
    
    function showNoEvents() {
        if (noEvents) {
            noEvents.style.display = 'block';
        }
        if (container) {
            container.style.display = 'none';
        }
    }
}

// Language Switcher
function initLanguageSwitcher() {
    const langSelect = document.getElementById('lang');
    
    if (!langSelect) return;
    
    const translations = {
        es: {
            hero: 'Música, energía y vibra única.',
            events: 'EVENTOS',
            about: 'Quién Soy',
            contact: 'Contacto',
            noEvents: 'No hay eventos próximos'
        },
        en: {
            hero: 'Music, energy and unique vibes.',
            events: 'EVENTS',
            about: 'About Me',
            contact: 'Contact',
            noEvents: 'No upcoming events'
        }
    };
    
    langSelect.addEventListener('change', function() {
        const lang = this.value;
        const t = translations[lang];
        
        // Update elements
        const heroText = document.getElementById('hero-text');
        const eventsTitle = document.getElementById('events-title');
        const aboutTitle = document.getElementById('about-title');
        const contactTitle = document.getElementById('contact-title');
        const noEvents = document.getElementById('no-events');
        
        if (heroText) heroText.textContent = t.hero;
        if (eventsTitle) eventsTitle.textContent = t.events;
        if (aboutTitle) aboutTitle.textContent = t.about;
        if (contactTitle) contactTitle.textContent = t.contact;
        if (noEvents) noEvents.textContent = t.noEvents;
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        // Loading state
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Send to Formspree
        fetch('https://formspree.io/f/mnqebgje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(function(response) {
            if (response.ok) {
                btn.textContent = '¡Enviado!';
                btn.style.background = '#22c55e';
                form.reset();
                
                setTimeout(function() {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Form error');
            }
        })
        .catch(function(error) {
            btn.textContent = 'Error';
            btn.style.background = '#dc2626';
            
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    });
}

// Add mobile menu styles
const style = document.createElement('style');
style.textContent = '.nav-menu.active { right: 0 !important; }';
document.head.appendChild(style);