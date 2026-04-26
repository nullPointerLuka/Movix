let peliculasGlobal = [];

fetch("../BD/movies.json")
  .then(res => res.json())
  .then(data => {
    peliculasGlobal = data.movies;
  });

const input = document.getElementById("searchInputDetails");
const resultsBox = document.getElementById("searchResults");

let timeout = null;

if (input) {
  input.addEventListener("input", function () {

    clearTimeout(timeout);

    timeout = setTimeout(() => {

      let texto = input.value.toLowerCase().trim();

      if (texto === "") {
        resultsBox.style.display = "none";
        return;
      }

      let filtradas = peliculasGlobal.filter(movie =>
        movie.titulo.toLowerCase().includes(texto) ||
        movie.genero.some(g => g.toLowerCase().includes(texto))
      );

      mostrarResultados(filtradas);

    }, 300);
  });
}

function mostrarResultados(lista) {

  if (!resultsBox) return;

  resultsBox.innerHTML = "";

  if (lista.length === 0) {
    resultsBox.style.display = "none";
    return;
  }

  lista.slice(0, 5).forEach(movie => {
    resultsBox.innerHTML += `
      <div class="nt-search-item" onclick="irDetalle(${movie.id})">
        <img src="${movie.imagen}">
        <div class="nt-search-info">
          <span class="nt-search-title">${movie.titulo}</span>
          <div class="nt-search-rating">⭐ ${movie.rating}</div>
        </div>
      </div>
    `;
  });

  resultsBox.style.display = "block";
}

function irDetalle(id) {
  window.location.href = `../Details/Details.html?id=${id}`;
}

document.addEventListener("click", function (e) {
  if (!e.target.closest(".nt-search-wrap")) {
    if (resultsBox) resultsBox.style.display = "none";
  }
});