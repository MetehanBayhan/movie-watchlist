
const searchBtn = document.querySelector(".search-btn")
const watchlistSearchBtn = document.querySelector(".watchlist-search-btn")
const searchBar = document.querySelector(".film-search-bar")
const watchlistSearchBar = document.querySelector(".watchlist-search-bar")
const movieBox = document.querySelector(".listed-films-wrapper")
const myWatchlistBox = document.querySelector(".my-watchlist-wrapper")
const pageDirection = document.querySelector(".watchlist-page-link")

function getMovie(movieName){
    fetch(`https://www.omdbapi.com/?apikey=5a98f506&s=${movieName}&type=movie&plot=short`)
    .then(res => res.json())
    .then(data => {
      if(data.Response === "True"){
        placeHtml(data.Search)
      } else {
        movieBox.innerHTML = `
        <div class="no-records">
          <p>Unable to find what you're looking for. Please try another search</p>
        </div>
        `
      }
      
    })
}


/*

DATADAN DONENLERI ARRAY ICINDE TUTUP IMDBIDSINI SORGULATP LOCAL STORAGE A JSON OLARK ATABILIRSIN

*/

const movies = []
function placeHtml(filmArray) {

  let htmlString = ``
  for(let movie of filmArray) {
    fetch(`https://www.omdbapi.com/?apikey=5a98f506&t=${movie.Title}&plot=short`)
      .then(res => res.json())
      .then(data => {
        movies.push(data)
        htmlString += `
        <div class="movie">
          <div class="movie-poster-wrapper">
            <img src="${data.Poster}" alt="" class="movie-poster">
          </div>
          
          <div class="movie-info-wrapper">
            <div class="movie-name-wrapper">
              <h4 class="movie-name">${data.Title}</h4>
              <p class="movie-imdb"><i class="fa-solid fa-star fa-md" style="color: #fec654;"></i>${data.imdbRating}</p>
            </div>
            <div class="movie-type-and-time">
              <p class="movie-time">${data.Runtime}</p>
              <p class="movie-type">${data.Genre}</p>
              <a class="add-watchlist" data-imdbid="${data.imdbID}"><i class="fa-solid fa-circle-plus fa-lg" style="color: #000000;"></i>Watchlist</a>
            </div>
            <div class="movie-bio-wrapper">
              <p class="movie-bio">${data.Plot}</p>
            </div>
          </div>
        </div>`
      })
      .then(() => {
        movieBox.innerHTML = htmlString
      })
  }

}


if (location.pathname === "/index.html"){
  searchBtn.addEventListener("click", () => {
    getMovie(searchBar.value)
  })
} 
else if (location.pathname == `/`){
  location.pathname = '/index.html';
}

document.addEventListener("click", (e) => {
  if(e.target.dataset.imdbid){
    addToMyList(e.target.dataset.imdbid)
  }
})



function addToMyList(imdbId){
  const currentArr = []
  for(let movie of movies){
    if(movie.imdbID == imdbId){
      if(JSON.parse(localStorage.getItem("watchlistArray"))){
        currentWatchlist = JSON.parse(localStorage.getItem("watchlistArray"))
        const hasMovie = currentWatchlist.some(item => item.imdbID === imdbId)
        if(!hasMovie){
          currentWatchlist.unshift(movie)
          localStorage.setItem("watchlistArray", JSON.stringify(currentWatchlist))
        }
      } else {
        currentArr.unshift(movie)
        localStorage.setItem("watchlistArray", JSON.stringify(currentArr))
      }
    }
  }
}


pageDirection.addEventListener("click", () => {
  localStorage.setItem("renderResult",renderMyList())
})

function renderMyList() {
  currentWatchlist = JSON.parse(localStorage.getItem("watchlistArray"))
  let htmlString = ``
  for(let movie of currentWatchlist){
    htmlString += `
    <div class="movie">
      <div class="movie-poster-wrapper">
        <img src="${movie.Poster}" alt="" class="movie-poster">
      </div>
      
      <div class="movie-info-wrapper">
        <div class="movie-name-wrapper">
          <h4 class="movie-name">${movie.Title}</h4>
          <p class="movie-imdb"><i class="fa-solid fa-star fa-md" style="color: #fec654;"></i>${movie.imdbRating}</p>
        </div>
        <div class="movie-type-and-time">
          <p class="movie-time">${movie.Runtime}</p>
          <p class="movie-type">${movie.Genre}</p>
          <a class="add-watchlist" data-imdbid="${movie.imdbID}"><i class="fa-solid fa-circle-plus fa-lg" style="color: #000000;"></i>Watchlist</a>
        </div>
        <div class="movie-bio-wrapper">
          <p class="movie-bio">${movie.Plot}</p>
        </div>
      </div>
    </div>`
    }
  return htmlString
}



window.onload = function() {
  if (location.pathname === "/watchlist.html"){
    const renderResult = localStorage.getItem("renderResult");
    if (renderResult) {
      myWatchlistBox.innerHTML = renderResult;
      localStorage.removeItem(renderResult)
    }
  }
  
  
};