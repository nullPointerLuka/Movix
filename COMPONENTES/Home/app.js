// VARIABLES 
let peliculasGlobal = [];
let generoActivo = "Todos";
let ordenActivo = "ninguno";
let busquedaActiva = "";

// FETCH
fetch("https://nullpointerluka.github.io/Movix/COMPONENTES/BD/movies.json")
  .then(response => response.json())
  .then(data => {
    peliculasGlobal = data.movies;
    aplicarFiltros();
  });


//FUNCIÓN PRINCIPAL
function aplicarFiltros() {

  let resultado = [...peliculasGlobal];

  // FILTRO POR GENERO
  if (generoActivo !== "Todos") {
    resultado = resultado.filter(movie =>
      movie.genero.includes(generoActivo)
    );
  }

  // BUSQUEDA
  if (busquedaActiva !== "") {
    resultado = resultado.filter(movie =>
      movie.titulo.toLowerCase().includes(busquedaActiva)
    );
  }

  // ORDEN
  if (ordenActivo === "rating") {
    resultado.sort((a, b) => b.rating - a.rating);
  }

  if (ordenActivo === "vistas") {
    resultado.sort((a, b) => b.vistas - a.vistas);
  }

  if (ordenActivo === "recomendado") {
    resultado = resultado.filter(movie => movie.recomendado === true);
  }

  mostrarPeliculas(resultado);
}


// MOSTRAR CARDS
function mostrarPeliculas(movies) {
  const container = document.getElementById("movieContainer");

  container.innerHTML = "";

  // si no hay resultados
  if (movies.length === 0) {
    container.innerHTML = `<p class="text-center">No hay resultados...</p>`;
    return;
  }

  movies.forEach(movie => {

    let generosHTML = "";
    let maxMostrar = 2;

    let generosVisibles = movie.genero.slice(0, maxMostrar);

    generosVisibles.forEach(gen => {
      generosHTML += `<span class="nt-genre-tag">${gen}</span>`;
    });

    if (movie.genero.length > maxMostrar) {
      let restantes = movie.genero.length - maxMostrar;
      generosHTML += `<span class="nt-genre-tag">+${restantes}</span>`;
    }

    container.innerHTML += `
      <div class="col">
        <div class="nt-movie-card h-100">

          <div class="nt-poster-wrap">
            <img src="${movie.imagen}" alt="${movie.titulo}">
            <div class="nt-poster-gradient"></div>

            <div class="nt-rating-badge">
              <span class="material-symbols-outlined">star</span> ${movie.rating}
            </div>
          </div>

          <div class="nt-card-body">

            <div class="d-flex justify-content-between align-items-center mb-3">

              <div class="d-flex flex-wrap gap-2">
                ${generosHTML}
              </div>

              <span class="nt-duration-tag">${movie.duracion}</span>

            </div>

            <h3 class="nt-card-title mb-2">${movie.titulo.toUpperCase()}</h3>

            <p class="nt-card-desc mb-4">${movie.descripcionCorta}</p>

            <div class="mt-auto">
              <button class="nt-btn-details" onclick="verDetalle(${movie.id})">
                Ver Detalles
                <span class="material-symbols-outlined nt-arrow">arrow_forward</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    `;
  });
}


// BOTONES UI 
function activarBoton(clase, botonClickeado) {
  document.querySelectorAll(clase).forEach(btn => btn.classList.remove("active"));
  botonClickeado.classList.add("active");
}


// FILTRO GENERO
function filtrarGenero(gen) {
  generoActivo = gen;
  aplicarFiltros();
}


// ORDEN
function ordenarPor(tipo) {
  ordenActivo = tipo;
  aplicarFiltros();
}


// BUSCADOR 
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");

  if (input) {
    input.addEventListener("input", function () {
      busquedaActiva = this.value.toLowerCase();
      aplicarFiltros();
    });
  }
});


//REDIRECCIÓN
function verDetalle(id) {
  window.location.href = `COMPONENTES/Details/Details.html?id=${id}`;
}
