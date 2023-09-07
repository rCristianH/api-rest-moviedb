$searchBtn.click(function () {
  location.hash = "#search=";
});
$trenMore.click(function () {});
$navHome.click(function () {
  location.hash = "#home=";
});
$navCate.click(function () {
  location.hash = "#category=";
});

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
  $trendingSec.show();
  $categoriesSec.show();
  $genericSec.hide();
  $movieDetSec.hide();
  getTrendMovieTop();
  getCategPrew();
}
function getID(i) {
  const match = i.match(/=(\d+)-/);

  if (match) {
    const number = match[1];
    return number;
  } else {
    console.log("404 No se encontro id.");
  }
}
function getName(i) {
  const lastIndex = i.lastIndexOf("-");
  let lastName = lastIndex !== -1 ? i.slice(lastIndex + 1) : null;

  if (lastName) {
    lastName = lastName.replace(/%20/g, ' ');
  }

  return lastName;
}
function categoriesPage() {
  console.log("categories!!");
  $trendingSec.hide();
  $categoriesSec.hide();
  $genericSec.show();
  $movieDetSec.hide();
  getMoviesByCate(getID(location.hash),getName(location.hash))
}

function movieDetailsPage() {
  console.log("Movie!!");
  $trendingSec.hide();
  $categoriesSec.hide();
  $genericSec.hide();
  $movieDetSec.show();
}

function searchPage() {
  console.log("Search!!");
  $trendingSec.hide();
  $categoriesSec.hide();
  $genericSec.show();
  $movieDetSec.hide();
}

function trendsPage() {
  console.log("TRENDS!!");
  $trendingSec.show();
  $categoriesSec.hide();
  $genericSec.hide();
  $movieDetSec.hide();
}
