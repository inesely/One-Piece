
const app = document.querySelector('#app');

async function getCharacters() {
  try {
    const response = await fetch('https://api.jikan.moe/v4/anime?q=one%20piece');
    const data = await response.json();

    const characters = data.data;

    app.innerHTML = `
      <h1>One Piece</h1>
      <div class="characters">
        ${characters.slice(0, 10).map(char => `
          <div class="card">
            <h2>${char.title}</h2>
            <img src="${char.images.jpg.image_url}" width="200"/>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error(error);
    app.innerHTML = `<p>Erreur API</p>`;
  }
}

getCharacters();