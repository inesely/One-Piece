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

      <input 
        type="text" 
        id="searchInput" 
        placeholder="Search a One Piece title..." 
      />

      <div class="characters" id="charactersContainer"></div>
    `;

    displayCharacters(allCharacters);

    const searchInput = document.querySelector('#searchInput');

    searchInput.addEventListener('input', function () {
      const searchValue = searchInput.value.toLowerCase();

      const filteredCharacters = allCharacters.filter(char =>
        char.title.toLowerCase().includes(searchValue)
      );

      displayCharacters(filteredCharacters);
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
    </div>
  `).join('');
}

getCharacters();