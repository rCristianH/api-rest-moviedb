/* //@ts-check */
const api = axios.create({
  baseURL: URL_API,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

async function getTrendMovieTop() {
  const { data } = await api("/trending/movie/day");
  const movies = data.results;
  let element = ``;
  movies.forEach((movie) => {
    element += `
    <div class="movie-container">
      <img class="movie-img" src="${URL_BASE_IMAGE}${movie.poster_path}">
    </div>`;
  });
  $trendPrewMoviesCont.html(element);
}
async function getCategPrew() {
  const { data } = await api("/genre/movie/list");
  const categories = data.genres;
  let element = ``;
  categories.forEach((category) => {
    element += `
      <div class="category-container">
    <h3 id="id${category.id}" class="category-title">${category.name}</h3>
  </div>`;
  });
  $categoriesPrew.html(element);
}
