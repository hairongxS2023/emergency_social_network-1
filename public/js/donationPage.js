const socket = io(getUrl());
const token = getCookie("access_token");
var send_btn = document.querySelector("#send-btn");
var tokens = token.split(".");
const decodedToken = JSON.parse(atob(tokens[1]));
//const decodedToken = jwtDecode(token);
const user = decodedToken.username;
const username = user.toLowerCase();
console.log("username:",username);
//default port for this project is 5003
//cannot use socket.on to hear data from client

const back_btn = document.querySelector("#back");
// Get the dropdown lists by their IDs
const resourcesDropdown = document.getElementById("resources");
const resourcesQuantityDropdown = document.getElementById("resources_quantity");
const selectedResource = resourcesDropdown.value;
const selectedResourceQuantity = resourcesQuantityDropdown.value;
const msg_container = document.getElementById( "message-container" );
const modify_btn = document.querySelector("#modify");
const find_me_btn = document.querySelector('#find-me');
const cur_user = document.querySelector( "#cur-user" );
const delete_btn = document.querySelector('#delete');

// cur_user.innerHTML = `${username}`;


if (back_btn) {
    back_btn.addEventListener("click", () => {
      console.log("back");
      window.location.href = `/ESN_directory_page`;
    });
}

if (find_me_btn){
  find_me_btn.addEventListener('click', geoFindMe);
}

if (send_btn){
  send_btn.addEventListener("click", () => {
      post_resource_msg();
      //window.location.reload(true);
  });
}

if(delete_btn){
  delete_btn.addEventListener("click",()=>{
    popup_display("popup-container-delete");
  });
  const deleteForm = document.getElementById("delete-form");
  deleteForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const choice = document.querySelector('input[name="delete"]:checked').value;
    const popupContainer = document.getElementById("popup-container-delete");
    popupContainer.style.display = "none";
    const Jdata = {
      user: user,
      delete_msg: choice,
    };
    donation_delete(Jdata);
  });
}

if (modify_btn){
    modify_btn.addEventListener("click", () => {
      popup_display("popup-container");
    });
    const statusForm = document.getElementById("status-form");
    statusForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = document.querySelector('input[name="status"]:checked').value;
      // send status to server and update message status in main container
      const popupContainer = document.getElementById("popup-container");
      popupContainer.style.display = "none";
      const Jdata = {
        user: user,
        donation_status: status,
      };
      donation_update(Jdata);
      //window.location.reload(true);
    });
}

socket.on('resource-delete',()=>{
  console.log('here delete-resource');
  window.location.reload(true);
})

socket.on('resource-update', () => {
  console.log('here resource-update');
  window.location.reload(true);
  get_donations_call();
})

function post_resource_msg(){
  // Get the selected values from the dropdown lists
  const selectedResource = resourcesDropdown.value;
  const selectedResourceQuantity = resourcesQuantityDropdown.value;
  const mapLink = document.querySelector('#map-link');
  //console.log(mapLink.textContent);
  if (selectedResource === "" || selectedResourceQuantity === "" ){
    alert("please select resource and quantity.")
  }else{
    const Jdata = {
      user: user,
      resource: selectedResource,
      resource_quantity: selectedResourceQuantity,
      donation_status: "available",
      location_info: mapLink.textContent,
    };
    // Send the data to the server
    $.ajax({
      url: `/donations`,
      type: "POST",
      data: JSON.stringify(Jdata),
      contentType: "application/json; charset=utf-8",
      statusCode:{
        200: function(data){
          console.log("success", data);
          // Clear the input fields
          resourcesDropdown.value = "";
          resourcesQuantityDropdown.value = "";
          window.location.reload(true);
        }
      },
      error: function(data){
        console.log("error", data);
        let idRecieved = data.responseText;
        let messageRev = JSON.parse( idRecieved );
        console.log( messageRev );
      },
    });
  }
}

// data format {user: 'test_user', resource: 'water', resource_quantity:'5', time: '2023-02-19 19:58:17'}
socket.on("emit-donation-msg", (data, time_sent, user_status) => {
  get_donations_call();
  window.location.reload(true);
});

function get_donations_call(){
  $.ajax({
    url:`/donations`,
    type: "GET",
    statusCode:{
      200: function (data, t, jqXHR){
        $( "#message-container").empty();
        const donations = data.donations;
        //console.log(donations);
        $.each(donations , function(index, item)
        {
          append_donation(item["username"], item["resource"], item["resource_quantity"], item["timesent"], item["sender_emg_status"], item["msg_status"], item["location_info"]);
        });
      }
    }
  });
}

function getUrl() {
  if (window.location.hostname === 'localhost') {
    return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
  } else {
    return 'https://s23esnb3.onrender.com';
  }
}

function createElementWithClassAndText(elementType, className, innerText) {
  const element = document.createElement(elementType);
  element.classList.add(className);
  element.innerText = innerText;
  return element;
}

function append_donation(user, resource, resource_quantity, time_sent, user_status, donation_status, location_info) {
  const donation_sender = createElementWithClassAndText("div", "donation-sender", user + " /Status:" + user_status);
  const donation_text = createElementWithClassAndText("div", "donation-text", "Resource: " + resource + " /Quantity:" + resource_quantity + " /Resource Status:" + donation_status);
  const donation_time = createElementWithClassAndText("div", "donation-time", time_sent);
  const donation_location = createElementWithClassAndText("div", "donation-location", location_info);

  const donation_sender_and_time = document.createElement("div");
  donation_sender_and_time.classList.add("donation-sender-and-time");
  donation_sender_and_time.append(donation_sender, donation_time);

  const donation_bubble = document.createElement("div");
  donation_bubble.classList.add("donation-bubble");
  donation_bubble.append(donation_sender_and_time, donation_text, donation_location);

  msg_container.appendChild(donation_bubble);
}


async function geoFindMe() {

  const status = document.querySelector('#status');
  const mapLink = document.querySelector('#map-link');

  mapLink.href = '';
  mapLink.textContent = '';

  async function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    try {
      status.textContent = '';
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;  
      const address = await getAddrFromLocation(latitude, longitude);
      mapLink.textContent = `${address}`;
    }catch (error) {
      mapLink = "Error: " + error;
    }
  }

  function error() {
    status.textContent = 'cannot get your location';
  }

  if (!navigator.geolocation) {
    status.textContent = 'Your browser does not support getting location information.';
  } else {
    status.textContent = 'navigating……';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

async function getAddrFromLocation(lat,lng){
  return new Promise((resolve, reject)=>{
    const geocoder = new google.maps.Geocoder();
    const position = {lat: lat, lng: lng};
    geocoder.geocode({location:position}, (result, status)=>{
      if(status='OK'){
        if(result[0]){
          resolve(result[0].formatted_address);
        }
        else{
          reject("error");
        }
      }
      else{
        reject("Geocoder failed: " + status);
      }
    });
  });
}

$(document).on('click', '.username-button', function (e){
  e.preventDefault();
  var user2 = $(this).text();
  //console.log(user2);
  if (user2 == username)
  {
    var popup = $( "<div class='popup'><span class='close'>&times;</span><p>You are not allowed to chat to yourself fool</p></div>" );
    $( "body" ).append( popup );
    $( ".close" ).click( function ()
    {
      // remove popup window
      popup.remove();
    } );
  }
  else
  {
    const Jdata = {
      user1 : username,
      user2 : user2
    }
    console.log('sending')
    $.ajax( {
      url: `/privateChatPage`,
      type: 'PUT',
      data: JSON.stringify( Jdata ),
      contentType: "application/json; charset=utf-8",
      statusCode: {
        204: function ( data, t, jqXHR )
        {
          console.log( "receive 204 at esn 79" );
          $.ajax( {
            url: `/privateChatPage`,
            type: 'GET',
            data: JSON.stringify( Jdata ),
            contentType: "application/json; charset=utf-8",
            success: function ( data, t, jqXHR )
            {
              window.location.href = "/privateChatPage"
            },
            error: function ( data, t, jqXHR )
            {
              console.log( "Error when redirecting" );
            },
          } );
        }
      }
      // window.location.href = `/privateChatPage`;
    } );
  }
})


// if user closes the browser, send a logout request to the server
window.onbeforeunload = function () {
    const token = Cookies.get('access_token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const username = decodedToken.username.toLowerCase();
    const Jdata = { username: username };
    $.ajax({
      // Logout
      url: `/users/offline`,
      type: "PUT",
      data: JSON.stringify(Jdata),
      success: function (data, t, jqXHR) {
        console.log("receive logout.");
      },
      error: function (data, t, jqXHR) {
        console.log("Error when redirecting");
      },
    });
};
  
  window.onload = function () {
    $.ajax({
      // Login
      url: `/users/${user}/online`,
      type: "PUT",
      data: user,
      success: async function (data, t, jqXHR) {
        console.log("index.js go to esndirectory");
      },
      error: function (data, t, jqXHR) {
        console.log("Error when redirecting");
      },
    });
};

async function popup_display(id){
  const popupContainer = document.getElementById(id);
  popupContainer.style.display = "block";
}

async function donation_delete(Jdata){
  $.ajax({
    url:`/donations`,
    type:"DELETE",
    data:JSON.stringify(Jdata),
    contentType: "application/json; charset=utf-8",
    statusCode:{
      200: function(data){
        console.log('success');
      }
    },
    error: function(data){
      console.log('error', data);
    },
  });
}

async function donation_update(Jdata){
  $.ajax({
    url:`/donation_statuses`,
    type: "PUT",
    data: JSON.stringify(Jdata),
    contentType: "application/json; charset=utf-8",
    statusCode:{
      200: function(data){
        console.log('success');
      }
    },
    error: function(data){
      console.log('error', data);
    },
  });
}

socket.on( "emit-set-inactive", ( data ) =>{
  console.log( "emit-set-inactive to",data.username );
  let curr_user = data.username;
  const Jdata = { username: curr_user };
  if(username!=curr_user){
    console.log("not the same")
    return;
  }
  $.ajax({
    url: "/users/offline",
    type: "PUT",
    data: JSON.stringify( Jdata ),
    statusCode:{
      200: function (data) {
        console.log(curr_user + " is offline");
        window.location.replace( "/" );
      },
    } ,
    error: function (data) {
      console.log("error setting it "+ data.username+ " is offline");
    },
  });
});