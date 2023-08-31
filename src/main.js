/* //@ts-check */

async function getTrendMovieTop() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };
  const res = await fetch(`${URL_API}/trending/movie/day`, options);
  const data = await res.json();
  const movies = data.results;
  movies.forEach((movie) => {
    const trendPrewMoviesCont = document.querySelector(
      ".trending-preview--movie-list"
    );
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("src", `${URL_BASE_IMAGE}${movie.poster_path}`);
    movieContainer.appendChild(movieImg);
    trendPrewMoviesCont.appendChild(movieContainer);
  });
}
async function getCategPrew() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };
  const res = await fetch(`${URL_API}/genre/movie/list`, options);
  const data = await res.json();
  const categories = data.genres;
  const categoriesPrew = document.querySelector(".categories-preview--list");
  let element = ``
  categories.forEach((category) => {
  element += `<div class="category-container">
    <h3 id="id${category.id}" class="category-title">${category.name}</h3>
  </div>`
  });
  categoriesPrew.innerHTML = element
}

getTrendMovieTop();
getCategPrew()
