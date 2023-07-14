//import {set_offline} from './set_offline.js'

const form = document.querySelector('form');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-input-btn');
const stopBtn = document.getElementById('stop-btn');
const resultSection = document.querySelector('.result');
const backButton = document.getElementById('back-btn');
const loadMoreBtn = document.getElementById('load-more-btn');
const loadLessBtn = document.getElementById('load-less-btn');
const searchResultCount = document.getElementById('result-count');
const resultCount = document.getElementById('result-count');
const searchResultsHeader = document.getElementById('searchResultsHeader');
const token = Cookies.get( 'access_token' );
const decodedToken = JSON.parse( atob( token.split( '.' )[ 1 ] ) );
const username = decodedToken.username.toLowerCase();


var counter=1;
let count = 10;
var searchmode;
let totalCount = 0;
let foundRefMax=0;
let trackNewSearch=0;
let foundCountMax=0;
let socket = io(getUrl());
function getURLPath()
{
  return getUrl();
 // return 'http://localhost:5003';
}

function configNewSearch()
{
 counter=1;
 count = 10;
 searchmode;
 totalCount = 0;
 foundRefMax=0;
 trackNewSearch=0;
 foundCountMax=0;
}

function searchForItemEntered(foundCountMaxTracker)
{
  if(foundCountMaxTracker==true){
    configNewSearch();
  }

  trackNewSearch=true;
  let searchTerm = searchInput.value;
  if (searchTerm === "") {
    searchResultsHeader.style.color = "red";
    searchResultsHeader.innerText = ` Please Enter a search term`;
    searchResultsHeader.style.color = "black";
    return;
  }else{

    searchResultsHeader.style.color = "green";
    searchResultsHeader.innerText = `Searching..`;
  }
  var urlmode=getURLPath() 
  var mode=urlmode+searchmode;
  counter=0;
  if(searchTerm=="status"){
    fetch(`${mode}=${searchTerm}&count=${count}`)
    .then(response => response.json())
    .then(data => {
      resultSection.innerHTML = '';
      if (data.statusHistories.length > 0) {
        for (const status of data.statusHistories) {
          counter+=1;
          const resultDiv = document.createElement('div');
          resultDiv.innerHTML = `
          <hr>
          <div class="centered-text">
          <p style="text-align: center;">[${counter}]</p>
           </div>
           <p><b>Citizen Name:</b> ${status.citizen}</p>
           <p><b>Time Stamp:</b> ${status.timesent}</p>
            <p><b>Status:</b> ${status.status}</p>
          `;
          resultSection.appendChild(resultDiv);        
        }
        resultCount.innerText = `Found ${counter} items`;
      } else {
        resultSection.innerHTML = '<p>No results found.</p>';
      }
    })
    .catch(error => console.error(error));

  }else
  {
    fetch(`${mode}=${searchTerm}&count=${count}`)
      .then(response => response.json())
      .then(data => {
        resultSection.innerHTML = '';
       
      foundCountMax=data.results.length;
      counter=1;
        for (const result of data.results) {

          const resultDiv = document.createElement('div');
          if (searchmode.includes("private")) {
            resultDiv.innerHTML = `
            <p><b>Username:</b> ${result.receiver}</p>
            <p><b>Message:</b> ${result.msg}</p>
            <p><b>Time Sent:</b> ${result.timesent}</p>
            <hr>
          `;
          } else {
            resultDiv.innerHTML = `
            <p><b>Username:</b> ${result.username}</p>
            <p><b>Message:</b> ${result.msg}</p>
            <p><b>Time Sent:</b> ${result.timesent}</p>
            <hr>
          `;
          }
          resultSection.appendChild(resultDiv);
          counter=counter+1;
          if(counter>=count){
            if(foundCountMaxTracker==true){
              resultCount.innerText = `Showing (${count})/${foundCountMax} items`;
              foundRefMax=foundCountMax;
              count=counter;
            }else{
              break;
            }

           
          }
        }

        searchResultsHeader.style.color = "black";
        searchResultsHeader.innerText = `Search Results`;

        if(counter==0){
          searchResultsHeader.style.color = "red";
          searchResultsHeader.innerText = `No Search Results`;
          resultCount.innerText ="";
          return;
        }else{
          searchResultsHeader.style.color = "black";
          searchResultsHeader.innerText = `Search Results`;
        }
      });
  }
}

window.addEventListener('load', function() {
  const urlParams = new URLSearchParams(window.location.search);
  searchmode = urlParams.get('typemode');
});

backButton.addEventListener('click', function() {
  window.history.back();
});

searchBtn.addEventListener('click', function(e) {
  e.preventDefault();
  searchForItemEntered(true);
});

loadMoreBtn.addEventListener('click', function(e) {
  if(counter<=0){
    searchResultsHeader.style.color = "red";
    searchResultsHeader.innerText = `No Search Results`;
    resultCount.innerText ="";
    return;
  }else{
    if(count<20){
      count += 1;
    }else{
      count+=10;
    }
    if(counter>count){
      searchResultsHeader.style.color = "green"; 
    }else{
      searchResultsHeader.style.color = "red";
    }
    loadMoreBtn.innerText = `Load More (+)`;
    resultCount.innerText = `Showing (${count})/${foundRefMax} items`;
  }
  searchForItemEntered(false);
});

loadLessBtn.addEventListener('click', function(e) {
  if(counter==0){
    searchResultsHeader.style.color = "red";
    searchResultsHeader.innerText = `No Search Results:`;
    resultCount.innerText ="";
    return;
  }else{
    if(count<=0){
      count==0;
      searchResultsHeader.style.color = "red";
    }else{   
      if(count>20){
        count-=10;
      }else{
        count-=1;
      }
      searchResultsHeader.style.color = "green";
    }
    loadLessBtn.innerText = `Load Less (-)`;
    resultCount.innerText =  `Showing (${count})/${foundRefMax} items`;
  }
  searchForItemEntered(false);

});

socket.on( "emit-set-inactive", async( data ) =>{
  await set_offline(username, data.username);
});


