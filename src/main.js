const app = document.querySelector('#app');

let allCharacters = [];

app.innerHTML = `<p>Loading...</p>`;

async function getCharacters() {
  try {
   const response = await fetch('https://api.jikan.moe/v4/anime?q=one%20piece');

if (!response.ok) {
  throw new Error('API request failed');
}

const data = await response.json();

    allCharacters = data.data;

    app.innerHTML = `
      <div class="header">
        <p class="tagline">Anime API Project</p>
        <h1>One Piece Universe Explorer</h1>
        <p class="subtitle">Search, sort and save your favorite One Piece titles.</p>
        <button id="themeToggle">🌙 Toggle Theme</button>
      </div>

      <section class="top-section">
        <div class="favorites-box">
          <h2>Favorites</h2>
          <div id="favoritesContainer"></div>
        </div>

        <div class="controls">
          <select id="sortSelect">
            <option value="">Sort by title</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>

          <select id="typeFilter">
  <option value="">All types</option>
  <option value="TV">TV</option>
  <option value="Movie">Movie</option>
  <option value="OVA">OVA</option>
  <option value="Special">Special</option>
</select>

          <input
            type="text"
            id="searchInput"
            placeholder="Search a One Piece title..."
          />
        </div>
      </section>

      <div class="stats">
        <div class="stat-card">
          <h3>Total items</h3>
          <p id="totalItems">0</p>
        </div>

        <div class="stat-card">
          <h3>Average score</h3>
          <p id="averageScore">0</p>
        </div>

        <div class="stat-card favorites-clickable" onclick="showFavoritesPage()">
          <h3>Favorites</h3>
          <p id="favoritesCount">0</p>
        </div>
      </div>

      <div class="characters" id="charactersContainer"></div>
    `;

    displayCharacters(allCharacters);
    displayFavorites();
    displayStats();
    setupTheme();

    const searchInput = document.querySelector('#searchInput');
    const sortSelect = document.querySelector('#sortSelect');
    const typeFilter = document.querySelector('#typeFilter');

 searchInput.addEventListener('input', function () {
  const searchValue = searchInput.value.trim().toLowerCase();

  if (searchValue.length === 1) {
    document.querySelector('#charactersContainer').innerHTML = `
      <div class="no-results">
        <h2>Search too short</h2>
        <p>Please enter at least 2 letters.</p>
      </div>
    `;
    return;
  }

  const filteredCharacters = allCharacters.filter(char =>
    char.title.toLowerCase().includes(searchValue)
  );

  displayCharacters(filteredCharacters);
});


    typeFilter.addEventListener('change', function () {
  const selectedType = typeFilter.value;

  const filteredByType = selectedType === ''
    ? allCharacters
    : allCharacters.filter(char => char.type === selectedType);

  displayCharacters(filteredByType);
});
    sortSelect.addEventListener('change', function () {
      let sortedCharacters = [...allCharacters];

      if (sortSelect.value === 'az') {
        sortedCharacters.sort((a, b) => a.title.localeCompare(b.title));
      }

      if (sortSelect.value === 'za') {
        sortedCharacters.sort((a, b) => b.title.localeCompare(a.title));
      }

      displayCharacters(sortedCharacters);
    });

  } catch (error) {
    console.error(error);
    app.innerHTML = `
  <div class="no-results">
    <h2>API temporarily unavailable</h2>
    <p>Please refresh the page in a few seconds.</p>
  </div>
`;
  }
}

function displayCharacters(characters) {
  const charactersContainer = document.querySelector('#charactersContainer');

  if (characters.length === 0) {
    charactersContainer.innerHTML = `
      <div class="no-results">
        <h2>No results found</h2>
        <p>Try searching another One Piece title.</p>
      </div>
    `;
    return;
  }

  charactersContainer.innerHTML = characters.map(char => `
    <div class="card">
      <h2>${char.title}</h2>
      <img src="${char.images.jpg.large_image_url}" alt="${char.title}" />

      <p><strong>Year:</strong> ${char.year || 'Unknown'}</p>
      <p><strong>Type:</strong> ${char.type || 'Unknown'}</p>
      <p class="score-badge">⭐ ${char.score || 'N/A'}</p>
      <p><strong>Episodes:</strong> ${char.episodes || 'Unknown'}</p>
      <p><strong>Status:</strong> ${char.status || 'Unknown'}</p>
      <p class="synopsis"><strong>Synopsis:</strong> ${char.synopsis || 'No description'}</p>

      <button onclick="addToFavorites('${char.title}')">Add to Favorites</button>
    </div>
  `).join('');
  observeCards();
}

window.addToFavorites = function(title) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (!favorites.includes(title)) {
    favorites.push(title);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    showNotification(`${title} added to favorites!`);
    displayFavorites();
    displayStats();
  } else {
    showNotification(`${title} is already in favorites!`);
  }
};

function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const favoritesContainer = document.querySelector('#favoritesContainer');

  favoritesContainer.innerHTML = favorites
    .map(title => `
      <p>
        ⭐ ${title}
        <button onclick="removeFavorite('${title}')">Remove</button>
      </p>
    `)
    .join('');
}

window.removeFavorite = function(title) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favorites = favorites.filter(favorite => favorite !== title);

  localStorage.setItem('favorites', JSON.stringify(favorites));

  showNotification(`${title} removed from favorites!`);
  displayFavorites();
  displayStats();
};

function displayStats() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const scores = allCharacters
    .map(char => char.score)
    .filter(score => score !== null);

  const average =
    scores.reduce((total, score) => total + score, 0) / scores.length;

  document.querySelector('#totalItems').textContent = allCharacters.length;
  document.querySelector('#averageScore').textContent = average.toFixed(1);
  document.querySelector('#favoritesCount').textContent = favorites.length;
}

window.showFavoritesPage = function() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const favoriteItems = allCharacters.filter(char =>
    favorites.includes(char.title)
  );

  app.innerHTML = `
    <div class="header">
      <p class="tagline">Your saved collection</p>
      <h1>Your Favorites</h1>
      <p class="subtitle">All your saved One Piece titles in one place.</p>
      <button onclick="getCharacters()">⬅ Back to Home</button>
    </div>

    <div class="characters" id="charactersContainer"></div>
  `;

  displayCharacters(favoriteItems);
};

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2500);
}

window.getCharacters = getCharacters;

function observeCards() {
  const cards = document.querySelectorAll('.card');

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });

  cards.forEach(card => {
    observer.observe(card);
  });
}
getCharacters();
function setupTheme() {
  const themeToggle = document.querySelector('#themeToggle');

  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}


