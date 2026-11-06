/* Taste of Africa - DOM interactivity */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } };

  // 1. Dark / light mode (persisted)
  const toggle = $('#themeToggle');
  const applyTheme = t => { document.documentElement.dataset.theme = t; toggle.textContent = t === 'dark' ? '☀️' : '🌙'; };
  applyTheme(localStorage.getItem('theme') || 'light');
  toggle.addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', t); applyTheme(t);
  });

  // 2. Image fallback: show a styled placeholder with the alt text if an image is missing
  $$('img').forEach(img => img.addEventListener('error', () => {
    const d = document.createElement('div'); d.className = 'ph'; d.textContent = img.alt; img.replaceWith(d);
  }));

  // 3. Recipe filter by region (data-region attributes)
  const filters = $$('.filter');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.toggle('active', b === btn));
    $$('#recipeGrid .card').forEach(card => {
      card.classList.toggle('hidden', btn.dataset.region !== 'all' && card.dataset.region !== btn.dataset.region);
    });
  }));

  // 4. Favorites saved in localStorage
  let favs = store('favorites', []);
  const paint = () => $$('.fav').forEach(b => {
    const on = favs.includes(b.dataset.id);
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
  });
  $$('.fav').forEach(b => b.addEventListener('click', () => {
    favs = favs.includes(b.dataset.id) ? favs.filter(f => f !== b.dataset.id) : [...favs, b.dataset.id];
    localStorage.setItem('favorites', JSON.stringify(favs)); paint();
  }));
  paint();

  // 5. Ingredient scaler
  const out = $('#servings');
  if (out) {
    const base = +out.dataset.base; let n = base;
    const render = () => {
      out.textContent = n;
      $$('.ingredients li').forEach(li => {
        const v = (+li.dataset.qty * n) / base;
        $('.q', li).textContent = Number.isInteger(v) ? v : +v.toFixed(2);
      });
    };
    $('#plus').addEventListener('click', () => { if (n < 20) { n++; render(); } });
    $('#minus').addEventListener('click', () => { if (n > 1) { n--; render(); } });
  }

  // 6. Contact form validation + dynamic confirmation
  const form = $('#contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#name').value.trim(), email = $('#email').value.trim(), country = $('#country').value, msg = $('#message').value.trim();
    const err = $('#formError');
    if (!name || !email || !country) { err.textContent = 'Please fill in your name, email and country.'; return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Please enter a valid email address.'; return; }
    if (msg.length <= 20) { err.textContent = `Your message must be more than 20 characters (currently ${msg.length}).`; return; }
    form.classList.add('hidden');
    const t = $('#thanks');
    t.textContent = `Thank you, ${name}! We've received your message.`; // textContent avoids HTML injection
    t.classList.remove('hidden');
  });

  // 7. Newsletter signup (footer)
  $('#newsletterForm').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#nlEmail'), msg = $('#nlMsg');
    if (!em.value.includes('@')) { msg.textContent = 'Enter a valid email.'; return; }
    const list = store('subscribers', []); list.push(em.value);
    localStorage.setItem('subscribers', JSON.stringify(list));
    msg.textContent = 'Thanks for subscribing! 🎉'; em.value = '';
  });

  // 8. Small fade-in animation
  $$('.card, .region-tile').forEach(c => c.classList.add('fade'));
});
