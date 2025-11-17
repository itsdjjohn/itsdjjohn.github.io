// ================================
// PRELOADER
// ================================
window.onload = () => {
  setTimeout(() => {
    document.getElementById('preloader').style.opacity = '0';
    document.getElementById('preloader').classList.add('pointer-events-none');
    document.getElementById('content').style.opacity = '1';
    loadEvents();
  }, 800);
};

// ================================
// MOBILE MENU
// ================================
document.addEventListener('click', e => {
  if (e.target.closest('.menu-toggle')) {
    document.querySelector('.nav-links').classList.toggle('show');
  }
  if (e.target.matches('.nav-links a')) {
    document.querySelector('.nav-links').classList.remove('show');
  }
});

// ================================
// LOAD EVENTS — BANDSINTOWN API
// ================================
function loadEvents() {
  fetch('https://rest.bandsintown.com/artists/itsdjjohn/events?app_id=6ddc274027f79a574321428def39a357')
    .then(r => r.json())
    .then(d => {
      const c = document.getElementById('events');
      c.innerHTML = '';

      if (!d || d.length === 0 || d.error) {
        document.getElementById('no-events').style.display = 'block';
        return;
      }

      d.forEach(e => {
        const date = new Date(e.datetime).toLocaleDateString('es-PA', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        }).toUpperCase();

        c.innerHTML += `
          <div class="event">
            <div style="font-size:2rem;font-weight:900;margin-bottom:1rem">${date}</div>
            <h3 style="font-size:1.8rem;margin-bottom:1rem">${e.venue.name}</h3>
            <p style="opacity:.8">${e.venue.location}</p>
            <a href="${e.url}" target="_blank" class="btn" style="margin-top:1.5rem;display:inline-block">
              TICKETS
            </a>
          </div>`;
      });
    })
    .catch(() => {
      document.getElementById('no-events').style.display = 'block';
    });
}

// ================================
// CONTACT FORM — FORMSPREE
// ================================
document.getElementById('form').onsubmit = async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  await fetch('https://formspree.io/f/xdovwvrp', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });

  alert('¡Mensaje enviado!');
  e.target.reset();
};
