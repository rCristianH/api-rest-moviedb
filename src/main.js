/* // @ts-ignore */
// @ts-ignore
let lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : navigator.language;
let idioma = document.getElementById("lang");
idioma.addEventListener("change", function () {
  let idiomaChange = idioma.value;
  if (idiomaChange === "sys") {
    localStorage.setItem("lang", navigator.language);
    location.reload()
  } else if (idiomaChange === "en") {
    localStorage.setItem("lang", "en-US");
    location.reload()
  } else {
    localStorage.setItem("lang", "es-US")
    location.reload()
  }
});
const api = axios.create({
  baseURL: URL_API,
  params: { include_adult: "true", language: lang },
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});
const likedMovie = () => {
  const item = JSON.parse(localStorage.getItem("liked_movie"));
  return (movies = item ? item : {});
};
const likeMovie = (movie) => {
  const likedMovies = likedMovie();
  console.log(likedMovies);
  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem("liked_movie", JSON.stringify(likedMovies));
};
/* utils */
// Selecciona el elemento 'main' del documento
let selectMain = document.querySelector("main");
function* numeros() {
  let i = 2;
  while (true) {
    yield i;
    i++;
  }
}
// Genera números comenzando desde 2
const generador = numeros();
// Comprueba si se debe activar el scroll infinito
const checkDisplay = (apiUrl = false) => {
  console.log("cr");
  let prevScrollTop = 0;
  // Comprueba si el elemento con clase 'genericSec' tiene display 'block'
  if ($genericSec.css("display") === "block" && typeof apiUrl == "string") {
    selectMain?.addEventListener(
      "scroll",
      function () {
        const currentScrollTop = selectMain.scrollTop;

        // Compara la posición actual con la posición anterior
        if (currentScrollTop > prevScrollTop) {
          infiniteScroll(apiUrl);
        }

        // Actualiza la posición anterior
        prevScrollTop = currentScrollTop;
      },
      { passive: false }
    );
  }
};
// Realiza el scroll infinito
const infiniteScroll = async (apiUrl = "string") => {
  let scrollTop = selectMain?.scrollTop;
  const scrollHeight = selectMain?.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 80;
  if (scrollIsBottom) {
    const { data } = await api(apiUrl, {
      params: {
        page: generador.next().value,
      },
    });
    const movies = data.results;

    if (data.page > data.total_pages) {
      checkDisplay();
      return;
    }
    console.log(movies);
    createMoviesAlt($genericListCont, movies, false);
  }
};
// Opciones para el observador de intersección
let options = {
  root: selectMain,
};
// Callback para el observador de intersección
let calback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
};
const lazyLoader = new IntersectionObserver(calback, options);
// Crea elementos de películas en la lista
function createMoviesAlt(i, j, k = true) {
  let lazyLoad = true;
  if (k) {
    i.html("");
  }
  j.forEach((movie) => {
    if (movie.poster_path !== null) {
      const movieContainer = document.createElement("div");
      movieContainer.className = "movie-container";

      const movieImage = document.createElement("img");
      movieImage.className = "movie-img";
      movieImage.setAttribute(
        lazyLoad ? "data-img" : "src",
        `${URL_BASE_IMAGE}${movie.poster_path}`
      );
      const movieBtn = document.createElement("button");
      movieBtn.className = "trending-preview-more movie-btn";
      likedMovie()[movie.id] && movieBtn.classList.add("movie-btn-liked");
      movieBtn.addEventListener("click", () => {
        movieBtn.classList.toggle("movie-btn-liked");
        likeMovie(movie);
      });

      if (lazyLoad) {
        lazyLoader.observe(movieImage);
      }
      movieContainer.appendChild(movieImage);
      movieContainer.appendChild(movieBtn);
      movieImage.addEventListener("click", function () {
        location.hash = `#movie=${movie.id}`;
      });
      i.append(movieContainer);
    }
  });
}

$navBack.on("click", function () {
  window.history.back();
});
// Obtiene las películas tendencia
async function getTrendMovieTop() {
  let lazyLoad = true;
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  /* movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.className = "movie-container";

    const movieImage = document.createElement("img");
    movieImage.className = "movie-img";
    movieImage.setAttribute(
      lazyLoad ? "data-img" : "src",
      `${URL_BASE_IMAGE}${movie.poster_path}`
    );
    if (lazyLoad) {
      lazyLoader.observe(movieImage);
    }
    movieContainer.appendChild(movieImage);

    movieImage.addEventListener("click", function () {
      location.hash = `#movie=${movie.id}`;
      console.log(`Se hizo clic en la imagen de la película:`);
    });
    $trendPrewMoviesCont.append(movieContainer);
  }); */
  createMoviesAlt($trendPrewMoviesCont, movies);
}
// Obtiene categorías de películas
async function getCategPrew() {
  const { data } = await api("genre/movie/list?include_adult=true");
  const categories = data.genres;
  $categoriesPrew.html("");
  categories.forEach((category) => {
    const divElement = document.createElement("div");
    divElement.className = "category-container";

    const h3Element = document.createElement("h3");
    h3Element.id = "id" + category.id;
    h3Element.className = "category-title";
    h3Element.textContent = category.name;

    divElement.appendChild(h3Element);
    h3Element.onclick = function () {
      location.hash = `#category=${category.id}-${category.name}`;
    };
    $categoriesPrew.append(divElement);
  });
}
// Obtiene películas por categoría
async function getMoviesByCate(i, j) {
  try {
    await api(`movie/${i}/similar`);
  } catch (e) {
    console.log(e.response.status);
    location.hash = "#home=";
    return;
  }
  const { data } = await api(`movie/${i}/similar`);
  const movies = data.results;
  console.log(movies);
  $genericListName.text(j);
  createMoviesAlt($genericListCont, movies);
  selectMain.scrollTop = 0;
  checkDisplay(`movie/${i}/similar`);
  infiniteScroll(`movie/${i}/similar`);
}
// Realiza una búsqueda de películas
async function getQuerySearch(i, j) {
  const { data } = await api(`search/movie?query=${i}`);
  const movies = data.results;
  console.log(movies);
  $genericListName.text(j);
  createMoviesAlt($genericListCont, movies);
  // @ts-ignore
  selectMain.scrollTop = 0;
  // @ts-ignore
  checkDisplay(`search/movie?query=${i}`);
  infiniteScroll(`search/movie?query=${i}`);
}
// Obtiene películas en tendencia
async function getTrends() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  console.log(movies);
  $genericListName.text(`Trendings day`);
  createMoviesAlt($genericListCont, movies);

  selectMain.scrollTop = 0;
  checkDisplay("trending/movie/day");
  infiniteScroll("trending/movie/day");
}
// Obtiene información de una película por su ID
async function getMovieById(i) {
  console.log(i);
  const { data } = await api(`movie/${i}`);
  const movies = data;
  console.log(movies);
  getSimilar(i);
  $imgDet.attr("src", `${URL_BASE_IMAGE}${movies.poster_path}`);
  $movDetCont.html("");
  let $container = $("<div>").addClass("container-movie--details");
  let $title = $("<h1>").addClass("movieDetail-title").text(movies.title);
  let $score = $("<span>")
    .addClass("movieDetail-score")
    .text(`⭐${movies.vote_average.toFixed(1)}`);
  let $description = $("<p>")
    .addClass("movieDetail-description")
    .text(movies.overview);
  let $categoriesList = $("<article>").addClass("categories-list");

  movies.genres.forEach(function (category) {
    let $categoryContainer = $("<div>").addClass("category-container");
    let $categoryTitle = $("<h3>", {
      id: "id" + category.id,
      class: "category-title",
      text: category.name,
    });
    $categoryTitle.on("click", function () {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    $categoryContainer.append($categoryTitle);
    $categoriesList.append($categoryContainer);
  });
  $container.append($title, $score, $description, $categoriesList);
  $movDetCont.append($container);
}
// Obtiene películas similares a una película por su ID
async function getSimilar(i) {
  const { data } = await api(`movie/${i}/similar`);
  const movies = data.results;
  console.log(movies);
  createMoviesAlt($movDetSim, movies);
}

const getSaves = () => {
  const movies = Object.values(JSON.parse(localStorage.getItem("liked_movie")));
  $genericListName.text(`Saves films`);
  console.log(movies);
  createMoviesAlt($genericListCont, movies);

  selectMain.scrollTop = 0;
};
