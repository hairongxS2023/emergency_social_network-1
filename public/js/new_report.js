//import {set_offline} from './set_offline.js';

const token = Cookies.get( 'access_token' );
const decodedToken = JSON.parse( atob( token.split( '.' )[ 1 ] ) );
const username = decodedToken.username.toLowerCase();
const backBtn = document.getElementById( 'back' );
const image_area = document.getElementById( 'img-area' );
const cameraInput = document.getElementById( 'camera-input' );
const image_taken = document.getElementById( 'taken-image' );
const clickme_prompt = document.getElementById( "clickme-prompt" );
const locate_btn = document.getElementById( "locate-me" );
const location_detail = document.getElementById( "location-detail" );
const submit_report_btn = document.getElementById( "submit-report-btn" );
let socket = io( getUrl() );
// this function is used to get the latitude and longtitude location of the user
// then transfer the location into a readable address
async function getAddrFromLocation ( lat, lng )
{
  return new Promise( ( resolve, reject ) =>
  {
    const geocoder = new google.maps.Geocoder();
    const position = { lat: lat, lng: lng };
    geocoder.geocode( { location: position }, ( result, status ) =>
    {
      if ( status == "OK" )
      {
        if ( result[ 0 ] )
        {
          resolve( result[ 0 ].formatted_address );
        }
        else
        {
          reject( "error" );
        }
      }
      else
      {
        reject( "Geocoder failed: " + status );
      }
    } );
  } );
}

backBtn.addEventListener( 'click', () =>
{
  const message = 'If you go back, you will lose all your input. Are you sure you want to continue?';
  const shouldNavigate = window.confirm( message );

  if ( shouldNavigate )
  {
    window.location.href = '/flood_report_page';
  }
} );

image_area.addEventListener( "click", () =>
{
  console.log( "clicked" );
  take_picture();
} );
async function take_picture ()
{
  cameraInput.click();
}


cameraInput.addEventListener( 'change', ( e ) =>
{
  const file = e.target.files[ 0 ];
  const reader = new FileReader();
  reader.onload = ( e ) =>
  {
    image_taken.src = e.target.result;
    image_taken.hidden = false;
  };
  reader.readAsDataURL( file );
  clickme_prompt.style.display = "none";
} );


locate_btn.addEventListener( "click", async () =>
{
  location_detail.innerHTML = "Locating...";
  if ( navigator.geolocation )
  {
    navigator.geolocation.getCurrentPosition(
      async ( position ) =>
      {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        await get_text_addr( lat, lng );
      },
      () =>
      {
        location_detail.innerHTML = "Error: The Geolocation service failed.";
      }
    );
  } else
  {
    location_detail.innerHTML = "Error: Your browser doesn't support geolocation.";
  }
} );


submit_report_btn.addEventListener( "click", async () =>
{
  if ( image_taken.src == "" || location_detail.innerHTML == "" || location_detail.innerHTML == "Error: The Geolocation service failed." || location_detail.innerHTML == "Error: Your browser doesn't support geolocation." || location_detail.innerHTML == "Locating..." )
  {
    alert( "You need to make sure a picture is taken for verification purpose and you have allowed the website to access your location." );
    return;
  }
  const formData = new FormData();
  formData.append( "image", image_taken.src );
  formData.append( "location", location_detail.innerHTML );
  formData.append( "poster", username );
  $.ajax( {
    url: "/flood_reports",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: ( data, t, jqXHR ) =>
    {
      alert( "Thanks for your report! We will look into it as soon as possible." );
      window.location.href = '/flood_report_page';
    },
    error: ( xhr, status, error ) =>
    {
      console.log( error );
    },
  } )
} );

socket.on( "emit-set-inactive", async ( data ) =>
{
  await set_offline( username, data.username );
} );

async function get_text_addr(lat, lng){
  try {
    const address = await getAddrFromLocation(lat, lng);
    location_detail.innerHTML = address;
  } catch (error) {
    location_detail.innerHTML = "Error: " + error;
  }
}


function getUrl() {
  if (window.location.hostname === 'localhost') {
    return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
  } else {
    return 'https://s23esnb3.onrender.com';
  }
}