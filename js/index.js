// TMDB API 
const API_KEY= 'api_key=741a5a16523a2ebd077f3f2a6cba06a2';
const BASE_URL='https://api.themoviedb.org/3';

const type = document.getElementsByName('type')[0].content; // type -> tv-shows, movies

// API URL za sve filmove sortirane po popularnosti 
let API_URL_MOVIE = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
let SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY;
const API_URL_PAGE = '&page=';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

if(type === "tv-shows") {
    API_URL_MOVIE = BASE_URL + '/discover/tv?sort_by=popularity.desc&' + API_KEY;
    SEARCH_URL = BASE_URL + '/search/tv?' + API_KEY;
}


let urlPage = 1;
let maxPages = 500;
let movies = [];
let sliderMovies = [];
let slideIndex = -1;


// Prikupimo elemente koji nam trebaju
const collection = document.getElementById('collection');
const load = document.getElementById('load');
const modal = document.querySelector(".modal-window");
modal.addEventListener("click", () => {
    modal.style.display = "none";
});
const pop_up = document.querySelector(".pop-up");

// Poziv pri otvaranju stranice
(function() {
    collection.innerHTML=' ';
    tryingSearchAndGenre(API_URL_MOVIE + API_URL_PAGE);
})()


// Funckija za slajder

try {
    const leftButton = document.querySelector(".slider .left-btn button");
    const rightButton = document.querySelector(".slider .right-btn button");

    leftButton.addEventListener('click', readDirection);
    rightButton.addEventListener('click', readDirection);
} catch {}

function readDirection(e) {
    slideMovies(e.target.parentNode.id);
}

function slideMovies(direction) {
    if(direction === "left") {
        slideIndex--;
    } else {
        slideIndex++;
    }

    if(slideIndex < 0) {
        slideIndex = 4;
    } else if(slideIndex > 4) {
        slideIndex = 0;
    }

    let title = sliderMovies[slideIndex]["title"];
    let year = sliderMovies[slideIndex]["release_date"];
    let background = sliderMovies[slideIndex]["backdrop_path"];

    if(screen.width <= 500) {
        background = sliderMovies[slideIndex]["poster_path"];
    }

    if(title == null) {
        title = "Movie Name";
    }

    if(year == null) {
        year = "?";
    } else {
        year = year.slice(0, 4);
    }

    if(background == null) {
        background = "./images/wide-backup.jpg";
    }
    
    document.querySelector(".slider img").src = IMG_URL + background;
    document.querySelector(".slider .slider-title-container").innerHTML = title + " (" + year + ")";
}


// Funkcija koja prikazuje filmove na pocetnoj strani
function showMovies(data) {
    
    data.forEach(movie => {
        let {title, poster_path, overview, genre_ids, release_date, backdrop_path, vote_average, vote_count, original_language} = movie;

        if(type === "tv-shows") {
            let {name, first_air_date} = movie;
            title = name;
            release_date = first_air_date;
        }

        let img_src = IMG_URL;
        let movieYear = "";
        if(release_date === "" || release_date == null) {
            movieYear = "?";
            release_date = "?";
        } else {
            movieYear = release_date.slice(0,4);
        }
        
        if(screen.width <= 400) {
            img_src += backdrop_path;
            if(backdrop_path === null) {
                img_src = "./images/wide-backup.jpg";
            }
        } else {
            img_src += poster_path;
            if(poster_path === null) {
                img_src = "./images/poster-backup.jpg";
            }
        }

        const movieEl = document.createElement('div');
        movieEl.classList.add('box');
        movieEl.innerHTML = 
        `<div class="container">
            <div class="poster">
                <img src="${img_src}" alt="${title}">
                <div class="mask"></div>
            </div>
            <div class="mini-description">
                <div class="box-title">${title}</div>
                <div class="box-year">${movieYear}</div>
            </div>
        </div>`;

        movieEl.addEventListener('click', function() {
            modal.style.display = "flex";
            document.querySelector(".modal-window img").src = img_src;
            document.getElementById("movie-title").innerHTML = title;
            document.getElementById("rating").innerHTML = '<i class="fas fa-star"></i> ' + vote_average*10 + "%";
            document.getElementById("voted").innerHTML = vote_count;
            document.getElementById("release-date").innerHTML = release_date;
            document.getElementById("language").innerHTML = getLanguage(original_language);
            document.getElementById("selected-genre-list").innerHTML = getGenresString(genre_ids);
            document.querySelector(".modal-window .desc-text p").innerHTML = overview;
        });

        collection.appendChild(movieEl);
    });

}



// Load

function createNewPage(){
    if(urlPage !== maxPages) {
        showMovies(movies.slice(0 + (urlPage*20), 20 + (urlPage*20)));
        urlPage++;
    } else {
        pop_up.style.top = "5%";
        setTimeout(() => pop_up.style.top = "-10%", 2000);
    }
}

load.addEventListener('click', createNewPage);



let searchTerm = "";
let selectedGenre = 0;
let selectedRating = 0;


// Search
let search;
try {
    const form = document.getElementById('form');
    form.addEventListener('submit', searchFun);
    search = document.getElementById('search');
} catch {}

function searchFun(e) {
    e.preventDefault();

    searchTerm = search.value;

    try {
        const dropdown = document.getElementById("genre");
        selectedGenre = parseInt(dropdown.value);

        const ratingDropdown = document.getElementById("movies-rating");
        selectedRating = parseInt(ratingDropdown.value);
    } catch {}

    urlPage = 1;
    collection.innerHTML = ' ';
    if(searchTerm) {
        document.querySelector(".trending-movies .collection-type").innerHTML = 
        '<i class="fas fa-search"></i> Search results for: <i style="opacity: 0.8;">' + searchTerm + '</i>';
        tryingSearchAndGenre(SEARCH_URL + '&query=' + searchTerm + API_URL_PAGE);
    }
    else {
        pages = 1;
        document.querySelector(".trending-movies .collection-type").innerHTML = 
        '<i class="fas fa-search"></i> Movies';
        tryingSearchAndGenre(API_URL_MOVIE + API_URL_PAGE);
    }
}


// Movie or tv show genres
let movieGenres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
];
if(type === "tv-shows") {
    movieGenres = [
        {
            "id":10759,
            "name":"Action & Adventure"
        },
        {
            "id":16,
            "name":"Animation"
        },
        {
            "id":35,
            "name":"Comedy"
        },
        {
            "id":80,
            "name":"Crime"
        },
        {
            "id":99,
            "name":"Documentary"
        },
        {
            "id":18,
            "name":"Drama"
        },
        {
            "id":10751,
            "name":"Family"
        },
        {
            "id":10762,
            "name":"Kids"
        },
        {
            "id":9648,
            "name":"Mystery"
        },
        {
            "id":10763,
            "name":"News"
        },
        {
            "id":10764,
            "name":"Reality"
        },
        {
            "id":10765,
            "name":"Sci-Fi & Fantasy"
        },
        {
            "id":10766,
            "name":"Soap"
        },
        {
            "id":10767,
            "name":"Talk"
        },
        {
            "id":10768,
            "name":"War & Politics"
        },
        {
            "id":37,
            "name":"Western"
        }
    ]
}

function getGenresString(gen) {
    let gen_string = "";
    gen.forEach(g => gen_string += " | " + (movieGenres.filter(movieGenre => movieGenre.id === g))[0].name);
    return gen_string;
}


// Filling in Select element
try {
    const dropdown = document.getElementById("genre");
    fillInDropdown(movieGenres, dropdown);
} catch {}

function fillInDropdown(genres, select) {
    genres.forEach(genre => {
        let opt = document.createElement('option');
        opt.value = genre.id;
        opt.innerHTML = genre.name;
        select.appendChild(opt);
    });
}




function tryingSearchAndGenre(url) {
    movies = [];

    let spinner = document.querySelector(".trending-movies .spinner-container");
    spinner.style.display = "flex";

    try {
        document.querySelector(".slider .img-loading").style.display = "block";
        document.querySelector(".slider img").style.display = "none";
    } catch {}

    // Check for maxPages:
    fetch(url + "1")
        .then(res => res.json())
        .then(data => {
            maxPages = data.total_pages
            for(let i = 0; i < maxPages; i++) {
                fetch(url + "" + (i+1))
                    .then(res => res.json())
                    .then(data => {
                        if(data["status_code"] == null) {
                            data.results.forEach(movie => {
                                if(movie["genre_ids"].includes(selectedGenre) || selectedGenre === 0) {
                                    if(selectedRating === 0 || 
                                        (selectedRating === 3 && movie["vote_average"] < 4.0) || 
                                        (selectedRating === 2 && movie["vote_average"] >= 4.0 && movie["vote_average"] < 7.0) ||
                                        (selectedRating === 1 && movie["vote_average"] >= 7.0)) {
                                        movies.push(movie);
                                    }
                                }   
                            });
                        }  
                        if(i === maxPages-1) {
                            spinner.style.display = "none";
                            try {
                                document.querySelector(".slider img").style.display = "block";
                                document.querySelector(".slider .img-loading").style.display = "none";
                                sliderMovies = movies.slice(0, 5);
                                slideMovies("right");
                            } catch {}
                            maxPages = Math.ceil(movies.length/20);
                            showMovies(movies.slice(0 + ((urlPage-1)*20), 20 + ((urlPage-1)*20)));
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        alert("Please try again.\nThere was an error trying to load movies!");
                    });
            }
        })
        .catch(error => {
            console.log(error);
            alert("Please try again.\nThere was an error trying to load movies!");
        });
}

// Navigacija mala

try {
    const navButton = document.querySelector("nav .links button");
    navButton.addEventListener('click', showNavigation);
} catch {}

function showNavigation() {
    document.querySelector("nav .links ul").style.display = "flex";
}


function getLanguage(language) {
    switch (language) {
        case "en":
            language = "English";
            break;
        case "ru":
            language = "Russian";
            break;
        case "hi":
            language = "Hindi";
            break;
        case "pt":
            language = "Portuguese";
            break;
        case "es":
            language = "Spanish";
            break;
        case "ja":
            language = "Japanese";
            break;
        case "da":
            language = "Danish";
            break;
        case "fr":
            language = "French";
            break;
        case "zh":
            language = "Zhongwen";
            break;
        case "ko":
            language = "Korean";
            break;
        case "cn":
            language = "Chinese";
            break;
        case "pl":
            language = "Polish";
            break;
        case "de":
            language = "German";
            break;
        case "it":
            language = "Italian";
            break;
        case "sv":
            language = "Swedish";
            break;
        case "th":
            language = "Thai";
            break;
        case "nl":
            language = "Dutch";
            break;
        case "no":
            language = "Norwegian";
            break;
        case "id":
            language = "Indonesian";
            break;
        case "tr":
            language = "Turkish";
            break;
        case "is":
            language = "Icelandic";
            break;
        case "fa":
            language = "Persian";
            break;
        case "te":
            language = "Telugu";
            break;
        case "ro":
            language = "Romanian";
            break;
        case "ta":
            language = "Tamil";
            break;
        case "bn":
            language = "Bengali";
            break;
        case "lv":
            language = "Latvian";
            break;
        case "ml":
            language = "Malayalam";
            break;
        case "xx":
            language = "xx";
            break;
        case "pa":
            language = "Panjabi";
            break;
        case "ar":
            language = "Arabic";
            break;
        case "tl":
            language = "Tagalog";
            break;
        case "ca":
            language = "Catalan";
            break;
        case "mr":
            language = "Marathi";
            break;
        case "la":
            language = "Latin";
            break;
        case "hu":
            language = "Hungarian";
            break;
        case "fi":
            language = "Finnish";
            break;
        case "cs":
            language = "Czech";
            break;
        case "he":
            language = "Hebrew";
            break;
        case "el":
            language = "Greek";
            break;
        case "nb":
            language = "Norwegian Bokmål";
            break;
        case "eu":
            language = "Basque";
            break;
        case "ms":
            language = "Malay";
            break;
    }

    return language;
}