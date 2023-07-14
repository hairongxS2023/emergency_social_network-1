//import {set_offline} from './set_offline.js';
const socket = io( getUrl() );
const body = document.querySelector( "body" );
const logout_btn = document.querySelector( "#logout-button" );
const chat_btn = document.querySelector( "#chat-button" );
const administrator_btn = document.querySelector( "#administrator-button" );
const sharestatus_btn = document.querySelector( "#sharestatus-button" );
const cur_user = document.querySelector( "#cur-user" );
const url = window.location.href;
const private_btn = document.querySelector( "#private-chat-button" );
const announcement_btn = document.querySelector( "#announcement-button" );
const popupElement = document.querySelector( ".popup" );
const announcement_popup = document.querySelector( ".popup-container" );
const announce_container = document.getElementById( "announcement-container" );
const emergency_announce_container = document.getElementById( "emergency-announcement-container" );
const voice_button = document.querySelector( "#voice-button" );
const flood_report_btn = document.getElementById( "flood-report-button" );
const search_btn = document.querySelector( "#searchButton" );
const search_name_btn = document.querySelector( "#search_nameButton" );
const search_status_btn = document.querySelector( "#search_statusButton" );
const searchBox = document.getElementById( 'searchBox' );
const searchInput = document.querySelector( '#searchBox input' );
const search_after_btn = document.querySelector( "#searchBox button" );
const searchBox_status = document.getElementById( 'searchBox_status' );
const searchInput_status = document.querySelector( '#searchBox_status input' );
const search_after_btn_status = document.querySelector( "#searchBox_status button" );
const searchResult = document.getElementById( "searchResult" );
const searchstop_btn = document.querySelector( "#stopsearchButton" );
const search_announcement = document.querySelector( "#searchBox_announcement" );
const search_announcement_input = document.querySelector( '#searchBox_announcement input' );
const search_announcement_btn = document.querySelector( "#searchBox_announcement button" );
const search_result_announcement = document.getElementById( 'searchAnnouncementsResult' )
const show_more_announcement_btn = document.getElementById( 'show_announcement_more_btn' );
const searchResultContainer = document.getElementById( "announcement-search-container" );
const searchinformation_button = document.querySelector( "#searchinformation-button" );
const tabButtons = document.querySelectorAll(".announcement-tab-button");
const textPopup = document.getElementById('text-popup');
const text_message = document.getElementById('text-message');
const submitTextButton = document.getElementById('submitText');
const cancelTextButton = document.getElementById('cancelText');
const donation_button = document.querySelector( "#donation-button" ); 
const assessment_button = document.getElementById("assessment-button");
const volunteer_button = document.querySelector( "#volunteer-button" ); 

const private_popup = document.getElementById( "private-popup" );

let selectedUser="";
var search_btn_new = document.getElementById("search-button");

if ( searchinformation_button )
{
  searchinformation_button.addEventListener( "click", ( event ) => 
  {
    showMenu( false );
    serachMessage();

  } );
}

if (search_btn_new) {
  search_btn_new.addEventListener("click", () => {
    //var pathMode=`/user_search`;
    window.location.href = `/InformationSearchCitizenPage`;
    console.log('search button clicked');
  });
}

// var span = document.getElementsByClassName("close")[0];
// const msgbox = document.getElementById("msgbox-content");
// var popupbox = document.getElementById("popupbox");
const token = Cookies.get( 'access_token' );
const decodedToken = JSON.parse( atob( token.split( '.' )[ 1 ] ) );
const username = decodedToken.username.toLowerCase();
cur_user.innerHTML = `Username: ${ username }`;


function updateUserName(ausername)
{
  cur_user.innerHTML = `Username: ${ ausername }`;

}
//================================================================================================
//=====================================  Functions  ==============================================
//================================================================================================

function get_users(){
  $.ajax( {

    
    //get the updated user list
    url: "/users",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
      200: function ( data, t, jqXHR ){
        const users = data.users;
        user_sort_name(users);
        user_sort(users);

        $("#online-users > tbody").empty();

        $.each(users, function (index, item) {

          var row = $("<tr>").append(
            $('<td align="center">').html('<a href="#" class="username" data-url="' + item.username + '">' + item.username + '</a>'),
            $('<td align="center">').html('<span class="' + (item.status === 'online' ? 'online' : 'offline') + '">' + item.status + '</span>'),
            $('<td align="center">').html(function () {
              if (item.emergency_status === "Emergency") {
                return '<img src="asset/EMERGENCY.png" alt="Emergency icon" style="width: 20px; height: 20px;"> ' + item.emergency_status;
              } else if ( item.emergency_status === "undefined" ){
                return '<img src="asset/undefined.png" alt="undefined icon" style="width: 20px; height: 20px;"> ' + item.emergency_status;
              } else if ( item.emergency_status === "OK" ){
                return '<img src="asset/OK.png" alt="OK icon" style="width: 20px; height: 20px;"> ' + item.emergency_status;
              } else if ( item.emergency_status === "Help" ){
                return '<img src="asset/HELP.png" alt="Help icon" style="width: 20px; height: 20px;"> ' + item.emergency_status;
              } else{
                return '';
              }
            } )
          );

          $( "#online-users > tbody" ).append( row );
        } );

        /* $("#online-users").text(str);
            }, */
      },
      error: function ( data, t, jqXHR ){
        console.log( "Error when receiving ESN directory data from backend." );
      },
    },
  } );
}

function showMenu ( hideMode ){
  if ( hideMode ){
    popupElement.style.display = "block"; // show the popup
  } else{
    popupElement.style.display = "none"; // hide the popup
  }

}
function getUrl (){
  if ( window.location.hostname === 'localhost' ){
    return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
  } else{
    return 'https://s23esnb3.onrender.com';
  }
}

function appendAnnouncement ( object, data ){
  object.innerHTML = "";
  for ( let i = data.length - 1; i >= 0; i-- )
  {
    
    const item = data[ i ];
    const display_mode = (item.sender === username) ? "block" : "none";
    // Create a new announce-bubble div
    const announceBubble = document.createElement( "div" );
    announceBubble.className = "announce-bubble";

    // Create the sender and content elements
    const sender = document.createElement( "p" );
    sender.className = "announce-sender";
    sender.textContent = item.sender;
    const bubble_header = document.createElement( "div" );
    const tool_section = document.createElement( "div" );
    tool_section.className = "announce-bubble-tool-section";
    bubble_header.className = "announce-bubble-header";
    const delete_button = document.createElement( "button" );
    const modify_button = document.createElement( "button" );
    const content = document.createElement( "p" );
    content.className = "announce-text";
    content.textContent = item.announcement_content;
    const timeSent = document.createElement( "p" );
    timeSent.className = "announce-time";
    timeSent.textContent = item.timesent;
    // Append the sender, content, and time to the announce-bubble
    announceBubble.appendChild( bubble_header );
    bubble_header.appendChild( sender );
    bubble_header.appendChild( tool_section );
    
    if (object.id === "emergency-announcement-container"){
      announceBubble.id = "emergency-announce-bubble";
      modify_button.className = "modify-button";
      delete_button.className = "delete-button";
      delete_button.id = item._id;
      modify_button.id = item._id;
      delete_button.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;
      modify_button.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i>`
      delete_button.style.display = display_mode;
      modify_button.style.display = display_mode;
      tool_section.appendChild( delete_button );
      tool_section.appendChild( modify_button );
      bubble_header.appendChild( tool_section );
      
    }
    announceBubble.appendChild( content );
    announceBubble.appendChild( timeSent );

    // Append the announce-bubble to the announcement-container
    object.appendChild( announceBubble );
  }
  delete_emergency_announcement();
  modify_emergency_announcement();
}

function get_announcement_history (){
  $.ajax( {
    url: `/announcements`,
    type: "GET",
    statusCode: {
      200: function ( data, t, jqXHR )
      {
        appendAnnouncement(announce_container, data.data);
      },
    },
    error: function ( data, t, jqXHR ){
      console.log( "Error when getting announcement history" );
    },
  } );
}

function user_sort ( users )
{
  users.sort(
    function ( a, b )
    {
      if ( a.status === 'online' && b.status === 'offline' )
      {
        return -1;
      } else if ( a.status === 'offline' && b.status === 'online' )
      {
        return 1;
      } else
      {
        return 0;
      }
    }
  )
}

function user_sort_name ( users )
{
  users.sort( function ( a, b )
  {
    if ( a.username.toLowerCase() < b.username.toLowerCase() )
    {
      return -1;
    } else if ( a.username.toLowerCase() > b.username.toLowerCase() )
    {
      return 1;
    } else
    {
      return 0;
    }
  } )
}

function redirect_voice_page(){
  $.ajax({
    url: "/voice-message-page",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    statusCode: {
      200: function (data, t, jqXHR) {
        window.location.href = "/voice-message-page";
      }
    }
});
}

function start_private_chat(Jdata){
  $.ajax( {
    url: `/privateChatPage`,
    type: 'PUT',
    data: JSON.stringify( Jdata ),
    contentType: "application/json; charset=utf-8",
    statusCode: {
      204: function ( data, t, jqXHR ){
        console.log( "receive 204 at esn 79" );
        $.ajax( {
          url: `/privateChatPage`,
          type: 'GET',
          data: JSON.stringify( Jdata ),
          contentType: "application/json; charset=utf-8",
          success: function ( data, t, jqXHR ){
            window.location.href = "/privateChatPage"
          },
          error: function ( data, t, jqXHR ){
            console.log( "Error when redirecting" );
          },
        } );
      }
    }
    // window.location.href = `/privateChatPage`;
  } );
}

function get_emergency_announcement (){
  $.ajax({
    url: `/emergency-events`,
    type: "GET",
    statusCode: {
      200: function (data, t, jqXHR) {
        appendAnnouncement(emergency_announce_container, data.data);
        //data sent back is an array of objects
        //each object has 3 properties: username and announcement_content and time
        //to access announcement_content of the first object in the array, use data[0].announcement_content
      },
    },
    error: function (data, t, jqXHR) {
      console.log("Error when redirecting");
    },
  });
}

function delete_http_call(e) {
  const msg = e.target.parentElement;
  const msg_id = msg.id;
  console.log(msg);
  console.log("delete message: " + msg_id);
  const Jdata = { id: msg_id };
  $.ajax({
    url: "/emergency-events",
    type: "DELETE",
    data: JSON.stringify(Jdata),
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      get_emergency_announcement();
    },
    error: function (err) {
      console.log(err);
    }
  });
  console.log('Voice message deleted');
  //confirmationPopup.style.display = 'none';
}

function setupConfirmDeleteListener(e) {
  // confirmDelete.onclick = wrappedDeleteVoiceMessage;
  delete_http_call(e);
}

function delete_emergency_announcement() {
  const delete_btns = document.querySelectorAll(".delete-button");
  delete_btns.forEach((btn) => {
    btn.onclick = (e) => {
      setupConfirmDeleteListener(e);
    }
  });
}

function hide_text_popup() {
  textPopup.style.display = 'none';
}

function modify_http_call(e,text) {
  const msg = e.target.parentElement;
  const msg_id = msg.id;
  const Jdata = { 
    id: msg_id ,
    new_content: text,
  };
  $.ajax({
    url: "/emergency-events",
    type: "PUT",
    data: JSON.stringify(Jdata),
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      get_emergency_announcement();
    },
    error: function (err) {
      console.log(err);
    }
  });
  console.log('Voice message modified');
  //confirmationPopup.style.display = 'none';
}
function wordCount(str) {
  return str.trim().split(/\s+/).length;
}
function check_text_length(text){
  const length = wordCount(text);
  console.log("word count",length);
  if(length > 200){
    alert("Text message is too long");
    return false;
  }
  else if(text === ""){
    alert("Please enter a message");
    return false;
  }
  return true;
}

function modify_emergency_announcement() {
  const modify_btns = document.querySelectorAll(".modify-button");
  modify_btns.forEach((btn) => {
    btn.onclick = (e) => {
      const grandParent = e.target.parentElement.parentElement.parentElement.parentElement;
      const text_element = grandParent.querySelector('.announce-text');
      text_message.value = text_element.textContent;
      textPopup.style.display = 'block';

      submitTextButton.onclick = () => 
      {
        if (check_text_length(text_message.value)) {
          modify_http_call(e, text_message.value);
          hide_text_popup();
        }
      };
      cancelTextButton.onclick = hide_text_popup;
    }
  });
}

function user_online(){
  $.ajax({
    url: `/users/${username}/online`,
    type: "PUT",
    data: username,
    success: async function (data, t, jqXHR) {
      console.log("index.js go to esndirectory");
    },
    error: function (data, t, jqXHR) {
      console.log("Error when redirecting");
    },
  });
}

async function get_privilege() {
  let privilege;
  console.log("here is username"+username);

  try {
    const response = await $.ajax({
      url: `/user-profiles/${username}`,
      type: "GET"
    });
    console.log("here is reponse"+response.username);
    privilege = response.privilege;
  } 
  catch (error) {
  }
  return privilege;
}

async function change_username(currentUserName,newusername) {
  

  const Jdata = {
    username: currentUserName,
    newusername: newusername,
  }
  try {
    $.ajax({
      url: `/user-profiles/usernames`,
      type: "PUT",
      data: JSON.stringify(Jdata),
      contentType: "application/json; charset=utf-8",
      success: function (data) {
        console.log("index.js go to esndirectory");
      }
    });
  }
  catch (error) {
    console.log(error);
  }

  updateUserName(newusername); 
 // location.reload(true);
}

async function change_password(currentUserName,newpassword) {
  const Jdata = {
    username: currentUserName,
    newpassword: newpassword,
  }
  try {
    $.ajax({
      url: `/user-profiles/passwords`,
      type: "PUT",
      data: JSON.stringify(Jdata),
      contentType: "application/json; charset=utf-8",
      success: function (data) {
        console.log("index.js go to esndirectory");
      }
    });
  }
  catch (error) {
    console.log(error);
  }
}

async function change_privilege(aim_user,aim_privilege) {
  console.log("aim user"+aim_user);
  const Jdata = {
    username_t: username,
    username: aim_user,
    privilege: aim_privilege,
  }
  try {
    $.ajax({
      url: `/user-profiles/privilege-levels`,
      type: "PUT",
      data: JSON.stringify(Jdata),
      contentType: "application/json; charset=utf-8",
      statusCode: {
        200:function (data) {
          console.log("index.js go to esndirectory");
          $("#change-privilege-popup").css("display", "none");
        },
        403:function (data) {
          alert("there has to be at least one admin");
          $("#change-privilege-popup").css("display", "none");
        }
      }
    });
  }
  catch (error) {
    console.log(error);
  }
}

async function change_account_status(aim_user,aim_status) {

  const Jdata = {
    username: aim_user,
    username_t:username,
    status: aim_status,
  }

  try {
    $.ajax({
      url: `/user-profiles/account-statuses`,
      type: "PUT",
      data: JSON.stringify(Jdata),
      contentType: "application/json; charset=utf-8",
      statusCode:{
        200:function (data) {
          console.log("index.js go to esndirectory");
          $("#change-statuses-popup").css("display", "none");
        }
      }
    });
  }
  catch (error) {
    console.log(error);
  }
}

async function set_off(data) {
  console.log( "emit-set-inactive to",data.username );
  let curr_user = data.username;
  console.log("this username:",username)
  console.log("data.username:",data.username)
  const Jdata = { username: curr_user };
  
  $.ajax({
    url: "/users/offline",
    type: "PUT",
    data: JSON.stringify( Jdata ),
    statusCode:{
      200: function (data) {
        console.log(curr_user + " is offline");
        get_users();
        if(username!=curr_user){
          get_users();
          console.log("not the same")
          return;
        }
        alert("you have been logged out due to status set to inactive");
        window.location.replace( "/" );
        //const logoutJdata = { active_status: 'inactive' };
        
        // $.ajax({
        //   url: "/",
        //   type: "GET",
        //   data:JSON.stringify(logoutJdata),
        //   statusCode:{
        //     200: function (data) {
        //       console.log("informed");
        //     }
        //   }
        // });
      },
    } ,
    error: function (data) {
      console.log("error setting it "+ data.username+ " is offline");
    },
  });


}

//================================================================================================
//=====================================   Instructions  ==========================================
//================================================================================================

document.addEventListener("DOMContentLoaded", function() {
  user_online();
  get_announcement_history();
  get_emergency_announcement();
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".announce-container").forEach((container) => {
      container.parentElement.style.display = "none";
    });
    const targetContainer = document.getElementById(button.dataset.target);
    targetContainer.parentElement.style.display = "block";
  });
});

if ( search_btn )
{
  search_btn.addEventListener( "click", ( event ) =>
  {
    search_announcement.style.display = 'block';
    let announcement_count = 10;
    if ( search_announcement_btn )
    {

      search_announcement_btn.addEventListener( "click", ( event ) =>
      {
        searchResult.style.display = 'none';
        announcement_count = 10;
        $( "#announcement-search-container" ).empty();

        console.log( search_announcement_input.value );
        post_announcement_search(announcement_count, search_announcement_input);
      } );

      show_more_announcement_btn.addEventListener( "click", ( event ) =>
      {
        announcement_count += 10;
        post_announcement_search(announcement_count, search_announcement_input);
      } );
    }
  });
}

async function post_announcement_search(announcement_count, search_announcement_input) {
  $.ajax( {
    type: 'POST',
    url: '/announcement_search',
    contentType: 'application/json;charset=UTF-8',
    data: JSON.stringify( { count: announcement_count, data: search_announcement_input.value } ),
    statusCode: {
      200: function ( data, t, jqXHR )
      {
        console.log( "THIS is inside success message:" + data.message );
        var announcements = data.announcements;
        console.log( "these are" + announcements[ 0 ] );
        if ( announcements.length === 0 )
        {
          alert( "No announcement found!" );
          return;
        }
        console.log( "should be visible here" );
        search_result_announcement.style.display = 'block';
        $( "#announcement-search-container" ).empty();
        appendAnnouncement( searchResultContainer,announcements );
      },
      error: function ()
      {
        console.error( 'error when receiving the data from the server.' );
      }
    }
  } );
}

if ( searchstop_btn ){
  searchstop_btn.addEventListener( "click", ( event ) =>
  {
    searchResult.style.display = 'none';
    $( "#searchResultTable > tbody" ).empty();
    search_announcement.style.display = 'none';
    search_result_announcement.style.display = 'none';
    $( "#announcement-search-container" ).empty();
  } );
}

announcement_btn.onclick = function (){
  announcement_popup.style.display = "flex";
  popupElement.style.display = "none";
}
if ( sharestatus_btn )
{
  sharestatus_btn.addEventListener( "click", ( event ) =>
  {

    showMenu( false );

    if ( checkBrowser() )
    {
      openPopupWindowM();//mobile//
    } else
    {
      openPopupWindowNM();//regular//
    }
  } );
}

if ( logout_btn ){
  logout_btn.addEventListener( "click", ( event ) =>
  {
    const Jdata = { username: username };
    $.ajax( {
      // Logout
      url: `/users/offline`,
      type: "PUT",
      data: JSON.stringify( Jdata ),
      success: function ( data, t, jqXHR )
      {
        console.log( "receive logout." );
        window.location.replace( "/" );
      },
      error: function ( data, t, jqXHR )
      {
        console.log( "Error when redirecting" );
      },
    } );
  } );
}


if (chat_btn) {
  chat_btn.addEventListener("click", (event) => {
    $.ajax({
      // Chat
      url: `/publicChatPage`,
      type: "GET",
      success: function (data, t, jqXHR) {
        window.location.href = `./publicChatPage`;
      }
    });
  });
}


if ( donation_button ){
  donation_button.addEventListener( "click", ( event ) =>{
        console.log('redirecting to donation page');
        window.location.href = `/donationPage`;

})}

if ( volunteer_button ){
  volunteer_button.addEventListener( "click", ( event ) =>{
        console.log('redirecting to volunteer page');
        window.location.href = `/volunteer-requests`;
})}

if ( administrator_btn ){
  administrator_btn.addEventListener( "click", async  ( event ) =>{
    $.ajax({
      url: "/user-authorities",
      type: "GET",
      success: function (data, t, jqXHR) {
        console.log("Verification success");
        window.location.href = "/speed_test";
      },
      error: function (data, t, jqXHR) {
        console.log("Verification failed");
        alert("Only administrator can perform speed test!");
        return;
      }
    });
  },
)};
 
// if user closes the browser, send a logout request to the server
window.onbeforeunload = function (){
  const Jdata = { username: username };
  $.ajax( {
    // Logout
    url: `/users/offline`,
    type: "PUT",
    data: JSON.stringify( Jdata ),
    success: function ( data, t, jqXHR )
    {
      console.log( "receive logout." );
    },
    error: function ( data, t, jqXHR )
    {
      console.log( "Error when redirecting" );
    },
  } );
};

if ( searchinformation_button ){
  searchinformation_button.addEventListener( "click", ( event ) => {
    showMenu( false );
    serachMessage();
  } );
}

if (assessment_button) {
  assessment_button.addEventListener("click", (event) => {
    $.ajax({
      url: `/selfAssessment`,
      type: "GET",
      success: function (data, t, jqXHR) {
        window.location.href = `./selfAssessment`;
      },
      error: function (data, t, jqXHR) {
        console.log("Error when redirecting");
      },
    });

  });
}


$(document).on('click', '.username', async function (e) {
  const privilege = await get_privilege();

  e.preventDefault(); // prevent the default behavior of the anchor tag
  // make an AJAX call to the associated URL
  var user2 = $(this).data('url');
  selectedUser=user2;

    const Jdata = {
      user1: username,
      user2: user2
    };
    console.log("user1: "+username+" user2: "+user2);
    private_popup.style.display = "block";
    $("#private-popup-text").css("display", "block");
    $("#start-private-chat").click(function () {
      start_private_chat(Jdata);
    });
    //if (privilege === "administrator") {
    
      if (user2 != username){
        $("#private-popup-text").text("Start a private chat with " + user2);
        $("#start-private-chat").css("display", "block");
        // Start private chat button click event
        $("#start-private-chat").click(function () {
          start_private_chat(Jdata);
        });
      }else{
        $("#private-popup-text").text("Perform an action to yourself");
        $("#start-private-chat").css("display", "none");
      }
      if (privilege === "administrator") {
        $("#private-popup-text").text("Perform an administrative action or chat with " + user2);
        // Show the change username and change password buttons
        $("#change-username").css("display", "block");
        $("#change-password").css("display", "block");
        $("#change-privilege").css("display", "block");
        $("#change-statuses").css("display", "block");
        $('#change-privilege').attr('name', user2);
        $('#change-statuses').attr('name', user2);

      }
    $("#start-private-chat").css("background", "#53bb53");

});


$("#private-close").click(function () {
  private_popup.style.display = "none";
});

// Change username button click event
$("#change-username").click(function () {
  console.log("change username");
  private_popup.style.display = "none";
  $("#change-profile-popup").css("display", "block");
  $("#change-profile-popup-text").text("Change username");
  $("#change-profile-input").attr("placeholder", "Enter new username");
  $("#change-profile-input").attr("type", "text");
  $("#change-profile-input").val("");
  $("#change-profile-input").focus();
  
});


$("#submit-profile-change").click(function () {
  var new_username = $("#change-profile-input").val();
  if (new_username === "") {
    alert("Please enter a new username!");
  }
  else {


    if ( $("#change-profile-popup-text").text() === "Change username") {
      change_username(selectedUser,new_username);
      $("#change-profile-popup").hide();
     location.reload();

    }
    else {
      change_password(selectedUser,new_username);
      $("#change-profile-popup").hide();
     // location.reload();
  
    }

  }

}
);

//$("#change-profile-popup").css("display", "none");

$("#cancel-profile-change").click(function () {
  $("#change-profile-popup").css("display", "none");
});

// Change password button click event
$("#change-password").click(function () {
  console.log("change password");
  private_popup.style.display = "none";
  $("#change-profile-popup").css("display", "block");
  $("#change-profile-popup-text").text("Change password");
  $("#change-profile-input").attr("placeholder", "Enter new password");
  $("#change-profile-input").attr("type", "password");
  $("#change-profile-input").val("");
  $("#change-profile-input").focus();
});



$("#change-privilege").click(function () {
  console.log("change privilege");
  private_popup.style.display = "none";
  $("#change-privilege-popup").css("display", "block");
  $("#change-privilege-popup-text").text("Change privilege");
});

$("#submit-privilege-change").click(function () {
  // get the value from input
  //var user2 = $(this).data('url');
  const options = document.getElementsByName('option');
  let new_privilege;
  var user2 = $('#change-privilege').attr('name');

  for (let i = 0; i < options.length; i++) {
    if (options[i].checked) {
      new_privilege = options[i].value;
      break;
    }
  }
  if (new_privilege) {
    console.log('Selected option:', new_privilege);
    change_privilege(user2,new_privilege);
  } else {
    alert('Please select an option before submitting.');
  }
});

$("#cancel-privilege-change").click(function () {
  $("#change-privilege-popup").css("display", "none");
});

$("#change-statuses").click(function () {
  console.log("change statuses");
  private_popup.style.display = "none";
  $("#change-statuses-popup").css("display", "block");
  $("#change-statuses-popup-text").text("Change statuses");
});

$("#submit-statuses-change").click(function () {
  // get the value from input
  const options = document.getElementsByName('option');
  let new_status;
  let user2 = $('#change-statuses').attr('name');
  for (let i = 0; i < options.length; i++) {
    if (options[i].checked) {
      new_status = options[i].value;
      break;
    }
  }
  if (new_status) {
    console.log('Selected option:', new_status);
    change_account_status(user2,new_status);
  } else {
    alert('Please select an option before submitting.');
  }
});

$("#cancel-statuses-change").click(function () {
  $("#change-statuses-popup").css("display", "none");
});


var sender_list = [];
const voice_notification = document.getElementById( "voice-message-notification" );
if ( voice_notification )
{
  voice_notification.addEventListener( "click", (event) => {
    event.preventDefault();
    redirect_voice_page();
  } );
}

if (voice_button){
  voice_button.addEventListener("click", (event) => {
    event.preventDefault();
    redirect_voice_page();
});
}

flood_report_btn.addEventListener("click", (event) => {
  window.location.href = "/flood_report_page";
});

//================================================================================================
//=======================================Socket.io===============================================
//================================================================================================

socket.on( "new_online", function ( )
{
  get_users();
} );
socket.on( "new_offline", function ( req, res )
{
  get_users();
} );
socket.on("new_announcement", ()=>{
  get_announcement_history();
} )

socket.on("new-voice-message", function (data) {
  voice_notification.style.display = "block";
});

socket.on("new_emergency_announcement", function (data) {
  get_emergency_announcement();
  
} );

socket.on("delete_emergency_announcement", function (data) {
  console.log("delete_emergency_announcement");
  get_emergency_announcement();
} );

socket.on( "emit-set-inactive", ( data ) =>{
  set_off(data);
  
});


