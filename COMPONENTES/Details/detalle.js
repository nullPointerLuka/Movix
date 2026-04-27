const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("https://nullpointerluka.github.io/Movix/COMPONENTES/BD/movies.json")
  .then(response => response.json())
  .then(data => {
    peliculasGlobal = data.movies;

    aplicarFiltros();

    const movie = data.movies.find(m => m.id == id);
    mostrarDetalle(movie);
  });

function mostrarDetalle(movie) {

  if (!movie) return;

  // Zona Hero
  const bg = document.querySelector(".nt-hero-bg");

if (movie.video) {
  bg.innerHTML = "";

  
  const video = document.createElement("video");
  video.src = movie.video;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";

  bg.appendChild(video);
}


  document.getElementById("titulo").textContent = movie.titulo;

  document.querySelector(".nt-hero-title").textContent = movie.titulo;
 
 
  document.querySelector(".nt-rating-pill").textContent = movie.clasificacion + " Rated";
const pill = document.querySelector(".nt-rating-pill");

const clas = movie.clasificacion || "NR";
pill.textContent = clas;


if (clas === "18+") pill.style.background = "#ff4d4d";  
else if (clas === "16+") pill.style.background = "#ff944d";
else if (clas === "13+") pill.style.background = "#ffd24d";
else if (clas === "7+") pill.style.background = "#4dff88";
else pill.style.background = "#999";




  document.querySelector(".rating-val").innerHTML = `
    <span class="material-symbols-outlined fill-icon" style="font-size:1rem;">star</span>
    ${movie.rating}
  `;

  document.querySelector(".nt-hero-meta span:nth-child(2)").textContent = "Año de Lanzamiento: "+movie.anio;
  document.querySelector(".nt-hero-meta span:nth-child(3)").textContent = movie.duracion;

  // BADGE

const contenedorBadges = document.querySelector(".nt-hero-badges");
if (!contenedorBadges) return;

let badges = [];

// Autoc

const anio = parseInt(movie.anio);
const currentYear = new Date().getFullYear();

if (!isNaN(anio) && anio >= currentYear - 1) {
  badges.push("New Release");
}

if (typeof movie.rating === "number" && movie.rating >= 95) {
  badges.push("Top Rated");
}

if (typeof movie.vistas === "number" && movie.vistas >= 10000) {
  badges.push("Trending");
}

if (movie.duracion?.toLowerCase().includes("episodios")) {
  badges.push("Serie");
}


//Toma de Json

if (Array.isArray(movie.badges)) {
  badges = badges.concat(movie.badges);
}

badges = [...new Set(badges)];



const prioridadScore = {
  "Top Rated": movie.rating || 0,
  "Trending": (movie.vistas || 0) / 1000,
  "New Release": (!isNaN(anio) && anio >= currentYear - 1) ? 80 : 0,
  "IMAX Enhanced": 60,
  "Serie": 50
};
// prioridad 
badges.sort((a, b) => {
  if (a === "New Release") return -1;
  if (b === "New Release") return 1;

  return (prioridadScore[b] || 0) - (prioridadScore[a] || 0);
});

const principal = badges[0];
const secundarios = badges.slice(1, 4);


// MAPA CLASS

function obtenerClase(b) {
  if (b === "New Release") return "nt-badge nt-badge-new";
  if (b === "IMAX Enhanced") return "nt-badge nt-badge-imax";
  if (b === "Top Rated") return "nt-badge nt-badge-top";
  if (b === "Trending") return "nt-badge nt-badge-trending";
  if (b === "Serie") return "nt-badge nt-badge-serie";
  return "nt-badge";
}


//  RENDER 

let htmlBadges = "";

if (principal) {
  htmlBadges += `
    <span class="${obtenerClase(principal)} nt-badge-main">
      ${principal}
    </span>
  `;
}

secundarios.forEach(b => {
  htmlBadges += `
    <span class="${obtenerClase(b)}">
      ${b}
    </span>
  `;
});

contenedorBadges.innerHTML = htmlBadges;





  // POSTER

  document.querySelector(".nt-poster-img-wrap img").src = movie.imagen;

  let generosHTML = "";
  movie.genero.forEach(g => {
    generosHTML += `<span class="nt-genre-chip">${g}</span>`;
  });

  document.querySelector(".nt-poster-card .d-flex.flex-wrap").innerHTML = generosHTML;

  document.querySelector(".nt-stat-value").textContent = movie.vistas;

  let estrellasHTML = "";
  let estrellas = Math.round(movie.rating / 2); 

  for (let i = 0; i < 5; i++) {
    estrellasHTML += `
      <span class="material-symbols-outlined ${i < estrellas ? "fill-icon" : ""}">star</span>
    `;
  }

  document.querySelector(".nt-stars").innerHTML = estrellasHTML;

  document.querySelector(".nt-synopsis").textContent = movie.sinopsis;

  let actoresHTML = "";

  movie.actores.forEach(actor => {
    actoresHTML += `
      <div class="col">
        <div class="nt-cast-card">
          <div class="nt-cast-img-wrap mb-2">
            <img src="${actor.imagen}">
            <div class="nt-cast-overlay"></div>
          </div>
          <p class="nt-cast-name mb-0">${actor.nombre}</p>
          <p class="nt-cast-role">${actor.personaje}</p>
        </div>
      </div>
    `;
  });

  document.querySelector(".row.row-cols-2").innerHTML = actoresHTML;




  let contenedor = document.querySelector(".nt-comments-section .d-flex.flex-column.gap-5");

  let comentariosHTML = "";

  // JSON base
  movie.comentarios.forEach(c => {
    comentariosHTML += crearComentario("User", "Ahora", c, 5);
  });

  // LocalStorage
  let guardados = JSON.parse(localStorage.getItem("comentarios_" + movie.id)) || [];

  guardados.forEach(c => {
    comentariosHTML += crearComentario("Tú", "Ahora", c.texto, 5);
  });


  let comentariosJSON = movie.comentarios.length;

let comentariosGuardados = JSON.parse(localStorage.getItem("comentarios_" + movie.id)) || [];

let total = comentariosJSON + comentariosGuardados.length;

document.getElementById("totalComentarios").textContent = total + " Comments";


  contenedor.innerHTML = comentariosHTML;

  // BOToN COMENTAR 

  document.querySelector(".nt-btn-post").addEventListener("click", () => {
    const textarea = document.querySelector(".nt-textarea");
    const texto = textarea.value;

    if (texto.trim() === "") return;

    let comentarios = JSON.parse(localStorage.getItem("comentarios_" + movie.id)) || [];

    comentarios.push({ texto });

    localStorage.setItem("comentarios_" + movie.id, JSON.stringify(comentarios));

    textarea.value = "";

    location.reload();
  });

}

//  COMENTARIOS
function crearComentario(nombre, tiempo, texto, estrellas) {

  let starsHTML = "";

  for (let i = 0; i < 5; i++) {
    starsHTML += `
      <span class="material-symbols-outlined ${i < estrellas ? "fill-icon" : ""}">star</span>
    `;
  }

  return `
    <div class="d-flex gap-4">
      <div class="nt-review-avatar-wrap">
        <div class="nt-avatar">${nombre[0]}</div>
      </div>
      <div class="d-flex flex-column gap-2">
        <div class="d-flex align-items-center gap-3">
          <span class="nt-reviewer-name">${nombre}</span>
          <span class="nt-review-time">${tiempo}</span>
        </div>
        <div class="nt-stars mb-1">
          ${starsHTML}
        </div>
        <p class="nt-review-text mb-0">${texto}</p>
      </div>
    </div>
  `;
}
