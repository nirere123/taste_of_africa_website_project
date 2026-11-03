
document.addEventListener('DOMContentLoaded', () => {
  // Light/dark theme: save the visitor's choice.
  const themeButton = document.querySelector('#themeToggle');
  const savedTheme = localStorage.getItem('toa-theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
  if (themeButton) {
    themeButton.textContent = document.body.classList.contains('dark') ? '☀️ Light' : '🌙 Dark';
    themeButton.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('toa-theme', theme);
      themeButton.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    });
  }

  // Recipe region filter.
  const filterButtons = document.querySelectorAll('[data-filter]');
  const recipeCards = document.querySelectorAll('[data-region]');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    recipeCards.forEach(card => {
      card.classList.toggle('hidden', selected !== 'all' && card.dataset.region !== selected);
    });
  }));

  // Favorites persist in localStorage.
  let favorites = JSON.parse(localStorage.getItem('toa-favorites') || '[]');
  document.querySelectorAll('[data-favorite]').forEach(button => {
    const id = button.dataset.favorite;
    const update = () => {
      const chosen = favorites.includes(id);
      button.textContent = chosen ? '♥ Saved' : '♡ Favorite';
      button.setAttribute('aria-pressed', String(chosen));
      button.style.background = chosen ? '#a83220' : '';
    };
    update();
    button.addEventListener('click', () => {
      favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
      localStorage.setItem('toa-favorites', JSON.stringify(favorites));
      update();
    });
  });

  // Ingredient scaler on recipe pages.
  const servingsOutput = document.querySelector('#servings');
  const scaleButtons = document.querySelectorAll('[data-scale]');
  if (servingsOutput && scaleButtons.length) {
    let servings = 4;
    const original = [...document.querySelectorAll('[data-amount]')].map(item => Number(item.dataset.amount));
    const updateIngredients = () => {
      servingsOutput.textContent = servings;
      document.querySelectorAll('[data-amount]').forEach((item, index) => {
        const amount = original[index] * servings / 4;
        item.textContent = Number.isInteger(amount) ? amount : amount.toFixed(1);
      });
    };
    scaleButtons.forEach(button => button.addEventListener('click', () => {
      servings = Math.max(1, Math.min(12, servings + Number(button.dataset.scale)));
      updateIngredients();
    }));
  }

  // Contact form: require a message longer than 20 characters.
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.querySelector('#name').value.trim();
    const message = document.querySelector('#message').value.trim();
    const feedback = document.querySelector('#formFeedback');
    if (message.length <= 20) {
      feedback.textContent = 'Please write a message longer than 20 characters.';
      feedback.className = 'notice';
      return;
    }
    contactForm.classList.add('hidden');
    feedback.textContent = `Thank you, ${name}! We have received your message.`;
    feedback.className = 'notice';
  });
});
