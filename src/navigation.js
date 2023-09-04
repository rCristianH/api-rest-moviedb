window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

function navigator() {
  console.log({ location });

  location.hash.startsWith("#trends")
    ? trendsPage()
    : location.hash.startsWith("#search=")
    ? searchPage()
    : location.hash.startsWith("#movie=")
    ? movieDetailsPage()
    : location.hash.startsWith("#category=")
    ? categoriesPage()
    : homePage();
}

function homePage() {
  console.log("Home!!");

  getTrendMovieTop();
  getCategPrew();
}

function categoriesPage() {
  console.log("categories!!");
}

function movieDetailsPage() {
  console.log("Movie!!");
}

function searchPage() {
  console.log("Search!!");
}

function trendsPage() {
  console.log("TRENDS!!");
}
