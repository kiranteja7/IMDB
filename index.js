
const apiKey = '96cb4a99';
const URI= `https://www.omdbapi.com/?apikey=${apiKey}`;

//FETCH MOVIES 
async function fetchMovies(totalResults = 400) {
    
    // Calculate the total number of pages required based on the totalResults
    const totalPages = Math.ceil(totalResults / 10);

    // Array to store all movie results
    let allMovies = [];

    // Loop through each page and fetch results
    for (let page = 1; page <= totalPages; page++) {
        const apiUrl = `${URI}&s=movie&type=movie&page=${page}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            allMovies = allMovies.concat(data.Search || []); // Concatenate current page results to allMovies array
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return allMovies;
}



//UPCOMING MOVIES IN 2024 
async function upcomingMovies(){
    let currentYearMovies=[];

    const currentYear= new Date().getFullYear();

   currentYearMovies= await fetchMoviesByYear(currentYear);

   return currentYearMovies;
}

//upcomingMovies();



//ALL TIMETOP RATINGS BY IMDB 
 async function getTopRatedMovies(){

    let movieTitle=[], filteredTopMovies=[];

    let allMovies= await fetchMovies();

    const topRating =8;

    movieTitle= getValueFromJSON(allMovies, 'Title');

    for(let i=0;i< movieTitle.length;i++){
    const apiUrl= `${URI}&t=${encodeURIComponent(movieTitle[i])}`;
    const data= await fetchAPI(apiUrl);
    
    if(parseFloat(data.imdbRating)>=topRating){
        filteredTopMovies=filteredTopMovies.concat(data || []);    
    }
 }
 return filteredTopMovies;

}
 

//getTopRatedMovies();

//GET TOP MOVIES IN PREVIOUS YEAR
async function getTopRatedMoviesLastYear(){

    
  let movieTitle=[], TopMoviesLastYear=[];

const currentYear= new Date().getFullYear()-1;

  let currentYearMovies= await fetchMoviesByYear(currentYear);

  const topRating =6;

  movieTitle= getValueFromJSON(currentYearMovies, 'Title');

  for(let i=0;i< movieTitle.length;i++){
  const apiUrl= `${URI}&t=${encodeURIComponent(movieTitle[i])}`;
  const data= await fetchAPI(apiUrl);
  if(parseInt(data.imdbRating)>=topRating){
    TopMoviesLastYear=TopMoviesLastYear.concat(data || []);    
  }
 }
 return TopMoviesLastYear;
}

//getTopRatedMoviesLastYear();

//FETCH THE MOVIE BY GENRE 
async function filterDetailsByGenre(){
    let movieTitle=[], action=[], animation=[], comedy=[], scifi=[];

    let genre={action, animation, comedy, scifi};

    let allMovies= await fetchMovies();

    movieTitle= getValueFromJSON(allMovies, 'Title');

    try{
    for(let i=0;i< movieTitle.length;i++){
        const apiUrl= `${URI}&t=${encodeURIComponent(movieTitle[i])}`;
        const data= await fetchAPI(apiUrl);
        if(data.Genre.includes('Action')){
          genre.action.push(data);     
        }if(data.Genre.includes('Animation')){
            genre.animation.push(data);
        }if(data.Genre.includes('Comedy')){
            genre.comedy.push(data);
        }if(data.Genre.includes('Sci-Fi')){
            genre.scifi.push(data);
        }
       }
    }catch(error){
        console.error(error);
    }
       return genre;
}

//filterDetailsByGenre();

//FETCH BY MOVIE LANGUAGE
async function filterDetailsByLanguage(){

    let language={
       // en: ['The Godfather', 'The Shawshank Redemption', 'The Dark Knight', 'Pulp Fiction', 'Fight Club', 'Forrest Gump', 'Inception', 'The Matrix', 'Star Wars', 'Jurassic Park'],
       en: ['Casino Royale', 'Skyfall', 'Die another day', 'Tomorrow never dies', 'GoldenEye', 'The Spy Who Loved Me', 'Goldfinger', 'Dr. No', 'From Russia with Love', 'Live and Let Die'],
        hi: ['3 Idiots', 'Lagaan', 'Dilwale Dulhania Le Jayenge', 'Sholay', 'Gangs of Wasseypur', 'PK', 'Dangal', 'Swades', 'Taare Zameen Par', 'Kabhi Khushi Kabhie Gham'],
        te: ['Baahubali: The Beginning', 'Baahubali 2: The Conclusion', 'Arjun Reddy', 'RX 100', 'Jersey', 'Ala Vaikunthapurramuloo', 'Rangasthalam', 'Paisa Vasool', 'RRR', 'Pushpa: The rise'],
        ta: ['Vada Chennai', 'Kabali', 'Master', 'Sarpatta Parambarai', 'Asuran', 'Kaithi', 'Bigil', 'Viswasam', 'Petta', 'Karnan']
    };

    let english=[], telugu=[], hindi=[], tamil=[];

    let movies={english, telugu, hindi, tamil};

    for (const [lang, moviesArray] of Object.entries(language)) {
        for(let i=0;i<moviesArray.length;i++){
            const apiUrl= `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(moviesArray[i])}&language=${lang}`;
            const data= await fetchAPI(apiUrl);
            if(data.Response==='True'){
              if(lang==='en'){
                  movies.english.push(data);
              }
              if(lang==='hi'){
                  movies.hindi.push(data);
              }
              if(lang==='te'){
                  movies.telugu.push(data);
              }
              if(lang==='ta'){
                  movies.tamil.push(data);
              }
            }else{
                console.log(apiUrl);
              console.error("Unable to fetch the data");
              break;
            }
          }
    }
    return movies;
}

//filterDetailsByLanguage();



async function fetchAPI(url){
try{
   const response = await fetch(url);
   return await response.json();
    }catch(error){
        console.error("Unable to fetch the data");
    }
}

function getValueFromJSON(data, value){
let filteredData=[];
  data.filter((d)=>{
    filteredData.push(d[value]);
  });

  return filteredData;
}


async function fetchMoviesByYear(year, pages=4){

    let currentYearMovies=[];

    for(let page=1;page<pages;page++){
       const apiUrl= `${URI}&s=movie&type=movie&y=${year}&page=${pages}`;
      const data = await fetchAPI(apiUrl);
      currentYearMovies= currentYearMovies.concat(data.Search || []);
       
    }
    return currentYearMovies;
}



//APPENDING THE DATA IN THE CAROUSEL LIST 

  function carouselCreator(moviesData, carouselId){

    var carouselInner = document.querySelector(`#${carouselId} .carousel-inner`);
    const numItems = Math.ceil(moviesData.length / 4);

    for (let i = 0; i < numItems; i++) {
        const carouselItem = document.createElement('div');
        carouselItem.className = "carousel-item";
        if (i === 0) {
            carouselItem.classList.add("active");
        }

        const slideContent = document.createElement('div');
        slideContent.className = "row carousel-content";

        const screenWidth = window.innerWidth;

        let columnsPerRow = 4; // Default to 4 columns

        if (screenWidth < 992 && screenWidth >= 768) {
            columnsPerRow = 3; // Medium screens, show 3 columns per row
        } else if (screenWidth < 768) {
            columnsPerRow = 2; // Small screens, show 2 columns per row
        }

        for (let j = i * columnsPerRow; j < Math.min((i + 1) * columnsPerRow, moviesData.length); j++) {
            if (moviesData[j].Poster === 'N/A') {
               moviesData[j].Poster='https://via.placeholder.com/300';
            }

            const movie = moviesData[j];

            const movieCol = document.createElement('div');
            movieCol.className = "col-md-3";

            const card = document.createElement('div');
            card.className = "card";
            card.style.cursor='pointer';

            card.addEventListener('mouseenter', function(){
              card.style.transform='translateY(-10px)';
            });

            card.addEventListener('mouseleave', function(){
              card.style.transform='translateY(0px)';
            });

            card.addEventListener('click', function(event){           
              event.preventDefault();
              localStorage.setItem("getMovie", movie.Title);   
               window.location.href="movies.html?searchValue=" + encodeURIComponent(movie.Title);    
            })

            const urlParams = new URLSearchParams(window.location.search);
             const searchValue = urlParams.get('searchValue');
             if(searchValue){
              displayAPI(searchValue);
             }

            const img = document.createElement('img');
            img.src = movie.Poster;
            img.alt = movie.Title;
            img.className = "card-img-top carousel-img"; 
            card.appendChild(img);

            const cardBody = document.createElement('div');
            cardBody.className = "card-body";

            const title = document.createElement('h5');
            title.textContent = movie.Title;
            title.className = "card-title";
            cardBody.appendChild(title);

            const year = document.createElement('p');
            year.textContent = "Year: " + movie.Year;
            year.className = "card-text";
            cardBody.appendChild(year);

            card.appendChild(cardBody);
            movieCol.appendChild(card);
            slideContent.appendChild(movieCol);
        }

        carouselItem.appendChild(slideContent);
        carouselInner.appendChild(carouselItem);
    }
  }

  async function createCarouselItemsForUpcomingMovies() {

    let storingArray= localStorage.getItem('storeArrayforUpcoming');

    if(!storingArray){
      let movieData= await upcomingMovies();
      localStorage.setItem('storeArrayforAllTime', JSON.stringify(movieData));
      storingArray = JSON.stringify(movieData);
    }

    const dataArray= JSON.parse(storingArray);

    if(window.location.href.includes('index.html')){
    carouselCreator(dataArray, 'carouselUpcomingMovies');
    }
  }


  async function createCarouselItemsForAllTime(){

     let storingArray= localStorage.getItem('storeArrayforAllTime');

      if(!storingArray){
        let movieData= await getTopRatedMovies();
        localStorage.setItem('storeArrayforAllTime', JSON.stringify(movieData));
        storingArray = JSON.stringify(movieData);
      }

      const dataArray= JSON.parse(storingArray);
      if(window.location.href.includes('index.html')){
    carouselCreator(dataArray, 'carouselAllTimeMovies');
      }

  }

  async function createCarouselItemsForLastYear(){
   
    
    let storingArray= localStorage.getItem('storeArrayforLastYear');

    if(!storingArray){
      let movieData= await getTopRatedMoviesLastYear();
      localStorage.setItem('storeArrayforLastYear', JSON.stringify(movieData));
      storingArray = JSON.stringify(movieData);
    }

    const dataArray = JSON.parse(storingArray)

    if(window.location.href.includes('index.html')){
    carouselCreator(dataArray, 'carouselTopRatedMoviesLastYear');
    }
    
  }

  async function createCarouselItemsByGenre(){
    // let movieData= await filterDetailsByGenre();

    let storingArray= localStorage.getItem('storeArrayByGenre');

    if (!storingArray) {
      // Fetch data from the API only if it's not available in local storage
      let movieData = await filterDetailsByGenre();
      localStorage.setItem('storeArrayByGenre', JSON.stringify(movieData));
      storingArray = JSON.stringify(movieData);
  }

      const dataArray = JSON.parse(storingArray);

      if(window.location.href.includes('index.html')){
    carouselCreator(dataArray.action, 'CarouselForAction');
      carouselCreator(dataArray.animation, 'CarouselForAnimation');
      carouselCreator(dataArray.comedy, 'CarouselForComedy');
      carouselCreator(dataArray.scifi, 'CarouselForScifi');
      }

  }

  async function createCarouselItemsByLanguage(){

    let storingArray = localStorage.getItem('storeArrayByLanguage');

    if (!storingArray) {
        // Fetch data from the API only if it's not available in local storage
        let movieData = await filterDetailsByLanguage();
        localStorage.setItem('storeArrayByLanguage', JSON.stringify(movieData));
        storingArray = JSON.stringify(movieData);
    }

    const dataArray = JSON.parse(storingArray);

    if(window.location.href.includes('index.html')){

    carouselCreator(dataArray.telugu, 'CarouselForTelugu');
    carouselCreator(dataArray.english, 'CarouselForEnglish');
    carouselCreator(dataArray.tamil, 'CarouselForTamil');
    carouselCreator(dataArray.hindi, 'CarouselForHindi');

    }
  }

  
  async function calls(){
    await createCarouselItemsForUpcomingMovies();
    await createCarouselItemsForLastYear();
    await createCarouselItemsByLanguage();
    await createCarouselItemsByGenre();
    await createCarouselItemsForAllTime();
  }

  calls();


  /////////////////////IMPLEMENTING THE SEARCH ALGORITHM AND MOVIE HTML PAGE///////////////////////////////////////////////////////////////


  function saveToLocalStorage(event) {
    event.preventDefault();
   var value = document.getElementById("searchInput").value;
   value=convertFirstLetterToCapital(value);
    localStorage.setItem("myValue", value);
   // window.location.href="movies.html";
   window.location.href = "movies.html?searchValue=" + encodeURIComponent(value);
}

// Function to retrieve value from local storage
function getValueFromLocalStorage() {
    var value = localStorage.getItem("myValue");
    return value; // Output the value to console
}

//COMING FROM MOVIES.HTML
var movieName= getValueFromLocalStorage();

//COMING FROM INDEX.HTML FROM CARDS COMPONENT
var movieTitle= localStorage.getItem("getMovie");

const urlParams = new URLSearchParams(window.location.search);
let searchValue = urlParams.get('searchValue');

if(window.location.href.includes('movies.html')){
localStorage.setItem('valueFromMovies', searchValue);
}


// Check if searchValue exists and call displayAPI
if (searchValue) {
    displayAPI(searchValue);
}

// console.log(movieName);

async function displayAPI(movie){
const apiUrl= `${URI}&t=${encodeURIComponent(movie)}&plot=full`;

  const response = await fetch(apiUrl);
  const data= await response.json();

  createDynamicData(data);
}


async function createDynamicData(getdata){

  const data= await getdata;

   if(data.Title===undefined){
      window.location.href='nodata.html';
   }

  if(data.Poster==='N/A'){
    data.Poster='https://via.placeholder.com/300';
  }

  let title= document.getElementById('movie-title');
   title.textContent= data.Title;

  let image=document.getElementById('image');
  image.src= data.Poster;

  let plot = document.getElementById('plot');
  plot.textContent= data.Plot;

  let table= document.getElementById('table');

  table.innerHTML=`
  <tbody>
          <tr>
            <th scope="row" style="color: yellow; border: none">Title</th>
            <td style="border: none; color: white"> ${data.Title}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Year</th>
            <td style="border: none; color: white">${data.Year}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Rated</th>
            <td style="border: none; color: white">${data.Rated}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Released</th>
            <td style="border: none; color: white">${data.Released}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">RunTime</th>
            <td style="border: none; color: white">${data.Runtime}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Genre</th>
            <td style="border: none; color: white">${data.Genre}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Director</th>
            <td style="border: none; color: white">${data.Director}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Writer</th>
            <td style="border: none; color: white">${data.Writer}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Actors</th>
            <td style="border: none; color: white">${data.Actors}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Language</th>
            <td style="border: none; color: white">${data.Language}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Country</th>
            <td style="border: none; color: white">${data.Country}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Awards</th>
            <td style="border: none; color: white">${data.Awards}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Rating by IMDB</th>
            <td style="border: none; color: white">${data.imdbRating}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">IMDB Votes</th>
            <td style="border: none; color: white">${data.imdbVotes}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">MetaScore</th>
            <td style="border: none; color: white">${data.MetaScore}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Type</th>
            <td style="border: none; color: white">${data.Type}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">DVD</th>
            <td style="border: none; color: white">${data.DVD}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">BoxOffice</th>
            <td style="border: none; color: white">${data.BoxOffice}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Production</th>
            <td style="border: none; color: white">${data.Production}</td>
          </tr>
          <tr>
            <th scope="row" style="color: yellow; border: none">Website</th>
            <td style="border: none; color: white">${data.Website}</td>
          </tr>
        </tbody>
  `
}

var array=[];
let movieAddToFavBtn = document.querySelector('.buttons');


// let btnStatForMovieSection="";

 let btnStatForMovieSection= localStorage.getItem(`favButtonInMovieSection_${searchValue}`);

if(window.location.href.includes('movies.html')){
  movieAddToFavBtn.id=searchValue;
chanegColorAndText();
}



  function chanegColorAndText(){
    if(btnStatForMovieSection==='green'){
      movieAddToFavBtn.classList.remove('btn-danger');
      movieAddToFavBtn.classList.add('btn-success');
      movieAddToFavBtn.textContent= 'ADD TO FAVOURITES';
    }
    if(btnStatForMovieSection==='red'){
       movieAddToFavBtn.classList.remove('btn-success');
       movieAddToFavBtn.classList.add('btn-danger');
       movieAddToFavBtn.textContent= 'REMOVE FROM FAVOURITES';
    }
  }

 


  if(window.location.href.includes('movies.html')){
    movieAddToFavBtn.addEventListener('click', function(){   
      this.classList.toggle('btn-success');
      this.classList.toggle('btn-danger');     

            if(this.classList.contains('btn-success')){
              this.textContent='ADD TO FAVOURITES';
              btnStatForMovieSection='green';
             localStorage.setItem(`favButtonInMovieSection_${searchValue}`, btnStatForMovieSection);
              alert('REMOVED FROM FAVOURITES');
                }
                else if(this.classList.contains('btn-danger')){
               this.textContent='REMOVE FROM FAVOURITES';
               btnStatForMovieSection='red';
                localStorage.setItem(`favButtonInMovieSection_${searchValue}`, btnStatForMovieSection);


                 let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

               // Add the selected movie to favorites array
                  favorites.push(movieAddToFavBtn.id);

                    // Store updated favorites array back in local storage
                  localStorage.setItem('favorites', JSON.stringify(favorites));

              alert('ADDED TO FAVOURITES');
            }
      });
    }

//IMPLEMENTING THE FAVOURITES SECTION /////////////////////////////////////////////////////////////////////////////////////////////////////

let getMovieVal = JSON.parse(localStorage.getItem('favorites'));

if (window.location.href.includes('favourites.html')) {
  // Get the container where the cards will be inserted
  let insertCards = document.getElementById('displayCards');

  if(getMovieVal.length===0){
    insertCards.innerHTML=`
    <div class="d-flex flex-column align-items-center justify-content-center" style="width: 100%">
        <div class="d-flex align-items-center justify-content-center">
            <i class="fa-solid fa-face-sad-tear"></i>
        </div>
        <div class="small-spacer"></div>
        <p style="color:white; font-size: 1.5rem">THERE IS NO FAVORITES HAVE BEEN ADDED INTO THIS PAGE</p>
        <div class="small-spacer"></div>
    </div>
    `;
  }

  // Iterate through each favorite movie
  getMovieVal.forEach(async function(movie) {

   btnStatForMovieSection=  localStorage.getItem(`favButtonInMovieSection_${movie}`);

    // Check if the movie is marked as favorite
    if (btnStatForMovieSection === 'red') {
      // Fetch movie details from API
      const apiUrl = `${URI}&t=${encodeURIComponent(movie)}&plot=full`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Create HTML elements for the movie card
      let cardHTML = `
        <div class="movie-card col-lg-4 col-md-6">
          <div class="card bg-dark text-yellow" id="${data.Title}" onclick="redirectToMoviePage(this)">
            <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300'}" class="card-img-top" id="image" alt="...">
            <div class="card-body">
              <h5 class="card-title yellow-colour">${data.Title}</h5>
              <p class="card-text yellow-colour">${data.Year}</p>
              <a href="#" class="btn btn-primary btn-danger" id="${data.Title}" onclick="deleteCard(event,this)">REMOVE FROM FAVOURITES</a>
            </div>
          </div>
        </div>
      `;

      // Append the movie card HTML to the container
      insertCards.innerHTML += cardHTML;
    }
  });
}


function deleteCard(event, button) {
  event.preventDefault();
  event.stopPropagation();
  let movieTitle = button.id;
  
  // Remove the movie card from the DOM
  let cardToRemove = button.closest('.card');
  if (cardToRemove) {
    // Remove the movie card from the DOM
    cardToRemove.remove();
    let displayTitle = movieTitle.toUpperCase();
    alert(`${displayTitle} IS REMOVED FROM FAVOURITES`);
    btnStatForMovieSection=  localStorage.getItem(`favButtonInMovieSection_${movieTitle}`);
    btnStatForMovieSection='green';
    localStorage.setItem(`favButtonInMovieSection_${movieTitle}`, btnStatForMovieSection);
    // Remove the movie from favorites in local storage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let updatedFavorites = favorites.filter(title => {
      title=convertFirstLetterToCapital(title);
      // console.log(title, movieTitle);
      title !== movieTitle
    });
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    if(updatedFavorites.length===0){
      window.location.href='favourites.html';
    }
  } else {
    console.error('Movie card not found.');
  }
}

function convertFirstLetterToCapital(name){
  
  let firstCap= name.charAt(0).toUpperCase();
  let splicedName = name.slice(1);

  return firstCap+splicedName;
}


function redirectToMoviePage(card){
  let movieId = card.id;
  searchValue=card.id;
 window.location.href = "movies.html?searchValue=" + encodeURIComponent(movieId);
 }


if(window.location.href.includes("movies.html")){
  const searchValue = urlParams.get('searchValue');
  displayAPI(searchValue);
}

if(window.location.href.includes('nodata.html')){
  let noDataDisplay= document.getElementById('no-data');

  noDataDisplay.innerHTML=`
  <div class="spacer"></div>
  <div class="d-flex flex-column align-items-center justify-content-center" style="width: 100%">
  <div class="d-flex align-items-center justify-content-center">
      <i class="fa-solid fa-face-sad-tear"></i>
  </div>
  <div class="small-spacer"></div>
  <p style="color:white; font-size: 1.5rem">SORRY :) WE ARE NOT SURE WHAT YOU ARE LOOKING AT</p>
  <div class="small-spacer"></div>
  <p style="color:white; font-size: 1.5rem">OR THE MOVIE YOU ARE SEARCHING IS NOT PRESENT FROM OUR SIDE</p>
  <div class="small-spacer"></div>
  <div class="d-flex align-items-center justify-content-center">
            <div class="btn btn-primary btn-success" id="goToHome" onclick="window.location.href='index.html'">
                BACK TO HOME
            </div>
        </div>
</div>
  `
}