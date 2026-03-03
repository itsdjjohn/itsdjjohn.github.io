// Preloader
window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    if (pre) {
        setTimeout(() => {
            pre.classList.add('hidden');
            setTimeout(() => { pre.style.display = 'none'; }, 800);
        }, 1800);
    }
});

// Navigation
(function() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.textContent = menu.classList.contains('active') ? '✕' : '☰';
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.textContent = '☰';
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }
})();

// Scroll Reveal
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Bandsintown API - Links directos a venta
(function() {
    const container = document.getElementById('events');
    const noEventsMsg = document.getElementById('no-events');
    if (!container) return;

    const appId = '6ddc274027f79a574321428def39a357';
    const artist = 'id_86889';

    fetch(`https://rest.bandsintown.com/artists/${artist}/events?app_id=${appId}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(events => {
            if (!Array.isArray(events) || events.length === 0) {
                noEventsMsg.style.display = 'block';
                container.style.display = 'none';
                return;
            }

            const now = new Date();
            let html = '';
            let hasFuture = false;

            events.forEach(ev => {
                const date = new Date(ev.datetime);
                if (date < now) return;
                hasFuture = true;

                const day = date.getDate();
                const month = date.toLocaleDateString('es-PA', {month:'short'}).toUpperCase();
                const v = ev.venue || {};
                
                // Detectar link directo de venta
                let ticketUrl = '#';
                let isDirectTicket = false;
                
                // Opción 1: Buscar en offers
                if (ev.offers && ev.offers.length > 0) {
                    const ticketOffer = ev.offers.find(o => o.type === 'Tickets' && o.url) || ev.offers[0];
                    if (ticketOffer && ticketOffer.url) {
                        ticketUrl = ticketOffer.url;
                        isDirectTicket = true;
                    }
                }
                
                // Opción 2: Detectar por palabras clave en el url
                if (ticketUrl === '#' && ev.url) {
                    const saleKeywords = ['ticket', 'entrada', 'boleta', 'eventbrite', 'ticketmaster', 'passline', 'wemusic', 'tuboleta', 'fever', 'widget'];
                    const isSaleLink = saleKeywords.some(keyword => ev.url.toLowerCase().includes(keyword));
                    
                    if (isSaleLink) {
                        ticketUrl = ev.url;
                        isDirectTicket = true;
                    } else {
                        ticketUrl = ev.url;
                    }
                }

                // Crear botón según disponibilidad
                let buttonHtml = '';
                if (ticketUrl !== '#') {
                    buttonHtml = `<a href="${ticketUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-ticket-alt"></i> 
                        ${isDirectTicket ? 'Comprar Entradas' : 'Tickets'}
                    </a>`;
                } else {
                    buttonHtml = `<button class="btn btn-secondary" disabled style="opacity: 0.6; cursor: not-allowed;">
                        <i class="fas fa-clock"></i> Próximamente
                    </button>`;
                }

                html += `<div class="event-card">
                    <div class="event-date">
                        <span class="event-day">${day}</span>
                        <span class="event-month">${month}</span>
                    </div>
                    <div class="event-info">
                        <h3>${v.name || 'TBA'}</h3>
                        <p>${v.city || 'TBA'}${v.country ? ', ' + v.country : ''}</p>
                        ${ev.lineup && ev.lineup.length > 1 ? `<small style="color: var(--gray); font-size: 0.85rem; display: block; margin-top: 0.5rem;"><i class="fas fa-users" style="margin-right: 0.5rem;"></i>${ev.lineup.slice(0, 3).join(', ')}${ev.lineup.length > 3 ? ' +' + (ev.lineup.length - 3) + ' más' : ''}</small>` : ''}
                    </div>
                    ${buttonHtml}
                </div>`;
            });

            if (hasFuture) {
                container.innerHTML = html;
            } else {
                noEventsMsg.style.display = 'block';
                container.style.display = 'none';
            }
        })
        .catch(err => {
            console.error('Bandsintown:', err);
            noEventsMsg.style.display = 'block';
            container.style.display = 'none';
        });
})();

// Cambio de idioma
document.getElementById('lang')?.addEventListener('change', function() {
    const t = {
        es: { hero: 'Música, energía y vibra única.', events: 'EVENTOS', about: 'Quién Soy', contact: 'Contacto', no: 'No hay eventos próximos' },
        en: { hero: 'Music, energy and unique vibes.', events: 'EVENTS', about: 'About Me', contact: 'Contact', no: 'No upcoming events' }
    }[this.value];

    document.getElementById('hero-text').textContent = t.hero;
    document.getElementById('events-title').textContent = t.events;
    document.getElementById('about-title').textContent = t.about;
    document.getElementById('contact-title').textContent = t.contact;
    document.getElementById('no-events').textContent = t.no;
});

// Formulario de contacto
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(this));

    fetch('https://formspree.io/f/mnqebgje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
        btn.style.background = '#22c55e';
        this.reset();
        setTimeout(() => { 
            btn.innerHTML = originalText; 
            btn.style.background = ''; 
            btn.disabled = false; 
        }, 3000);
    })
    .catch(() => {
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        btn.style.background = '#dc2626';
        setTimeout(() => { 
            btn.innerHTML = originalText; 
            btn.style.background = ''; 
            btn.disabled = false; 
        }, 3000);
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});