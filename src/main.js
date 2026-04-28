const app = document.querySelector('#app');

let allCharacters = [];

app.innerHTML = `<p>Loading...</p>`;

async function getCharacters() {
  try {
    const response = await fetch('https://api.jikan.moe/v4/anime?q=one%20piece');
    const data = await response.json();

    allCharacters = data.data.slice(0, 20);

    app.innerHTML = `
      <h1>One Piece</h1>

<select id="sortSelect">
  <option value="">Sort by title</option>
  <option value="az">A-Z</option>
  <option value="za">Z-A</option>
</select>

      <input 
        type="text" 
        id="searchInput" 
        placeholder="Search a One Piece title..." 
      />

      <div class="characters" id="charactersContainer"></div>
    `;

    displayCharacters(allCharacters);

    const searchInput = document.querySelector('#searchInput');
    const sortSelect = document.querySelector('#sortSelect');
    searchInput.addEventListener('input', function () {
      const searchValue = searchInput.value.toLowerCase();

      const filteredCharacters = allCharacters.filter(char =>
        char.title.toLowerCase().includes(searchValue)
      );

      displayCharacters(filteredCharacters);
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
    app.innerHTML = `<p>Erreur API</p>`;
  }
}

function displayCharacters(characters) {
  const charactersContainer = document.querySelector('#charactersContainer');

  charactersContainer.innerHTML = characters.map(char => `
<div class="card">
  <h2>${char.title}</h2>
  <img src="${char.images.jpg.image_url}" alt="${char.title}" />

  <p><strong>Year:</strong> ${char.year || 'Unknown'}</p>
  <p><strong>Type:</strong> ${char.type || 'Unknown'}</p>
  <p><strong>Score:</strong> ${char.score || 'N/A'}</p>
  <p><strong>Episodes:</strong> ${char.episodes || 'Unknown'}</p>
  <p><strong>Status:</strong> ${char.status || 'Unknown'}</p>
  <p><strong>Synopsis:</strong> ${char.synopsis ? char.synopsis.slice(0, 120) + '...' : 'No description'}</p>

  <button onclick="addToFavorites('${char.title}')">Add to Favorites</button>
</div>
  `).join('');
}
window.addToFavorites = function(title) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (!favorites.includes(title)) {
    favorites.push(title);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${title} added to favorites!`);
  } else {
    alert(`${title} is already in favorites!`);
  }
};
getCharacters();