//@ts-check
/* // @ts-ignore */
const api = axios.create({
  baseURL: URL_API,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});
/* utils */
function* numeros() {
  let i = 2;
  while (true) {
    yield i;
    i++;
  }
}
const generador = numeros();
const checkDisplay = (apiUrl = false) => {
  console.log(typeof(apiUrl));
  if ($genericSec.css("display") === "block" && typeof(apiUrl) == "string") {
    document.querySelector("main")?.addEventListener(
      "scroll",
      function () {
        infiniteScroll(apiUrl);
      },
      false
    );
  }
};
const infiniteScroll = async (apiUrl) => {
  

  let scrollTop = document.querySelector("main")?.scrollTop;
  const scrollHeight = document.querySelector("main")?.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 20;

  if (scrollIsBottom) {
    const { data } = await api(apiUrl, {
      params: {
        page: generador.next().value,
      },
    });
    console.log(data);
    const movies = data.results;
    
    if (data.page === data.total_pages) {
      checkDisplay();
      return;
    }
    console.log(movies);
    createMoviesAlt($genericListCont, movies, false);
  }
};
let options = {
  root: document.querySelector("main"),
};
let calback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
};
const lazyLoader = new IntersectionObserver(calback, options);
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
      if (lazyLoad) {
        lazyLoader.observe(movieImage);
      }
      movieContainer.appendChild(movieImage);

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
  document.querySelector("main").scrollTop = 0;
}
async function getQuerySearch(i, j) {
  const { data } = await api(`search/movie?query=${i}`);
  const movies = data.results;
  console.log(movies);
  $genericListName.text(j);
  createMoviesAlt($genericListCont, movies);
  document.querySelector("main").scrollTop = 0;
  checkDisplay(`search/movie?query=${i}`);
  infiniteScroll(`search/movie?query=${i}`);
}

async function getTrends() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;

  $genericListName.text(`Trendings day`);
  createMoviesAlt($genericListCont, movies);

  document.querySelector("main").scrollTop = 0;
  checkDisplay("trending/movie/day");
  infiniteScroll("trending/movie/day");
}

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
async function getSimilar(i) {
  const { data } = await api(`movie/${i}/similar`);
  const movies = data.results;
  console.log(movies);
  createMoviesAlt($movDetSim, movies);
}
