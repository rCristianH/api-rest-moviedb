/* //@ts-check */
const api = axios.create({
  baseURL: URL_API,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

async function getTrendMovieTop() {
  const { data } = await api("trending/movie/day");
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
  const { data } = await api("genre/movie/list");
  const categories = data.genres;
  $categoriesPrew.html("")
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
  try{
    await api(`movie/${i}/similar`);
  }catch(e){
    console.log(e.response.status)
    location.hash = "#home="
    return;
  }
  const { data } = await api(`movie/${i}/similar`);
  const movies = data.results;
  console.log(movies);
  $genericListName.text(j);
  const $tempContainer = $("<div>");

  movies.forEach((movie) => {
    if (movie.poster_path !== null) {
      const $divElement = $("<div>").addClass("movie-container");

      const $imgElement = $("<img>")
        .attr("src", URL_BASE_IMAGE + movie.poster_path)
        .addClass("movie-img");
      $divElement.append($imgElement);
      $tempContainer.append($divElement);
    }
  });
  $genericListCont.html($tempContainer.html());
  document.querySelector("main").scrollTop = 0;
}
