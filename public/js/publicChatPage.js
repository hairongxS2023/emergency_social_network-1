//import {set_offline} from './set_offline.js';

const socket = io(getUrl());
const token = getCookie("access_token");
var send_btn = document.querySelector("#send-btn");
var tokens = token.split(".");
const decodedToken = JSON.parse(atob(tokens[1]));
//const decodedToken = jwtDecode(token);
const user = decodedToken.username;
console.log("username:",user);
//default port for this project is 5003
//cannot use socket.on to hear data from client
const msg_container = document.getElementById( "message-container" );
const chat_msg = document.getElementById( "message-input" );
const ShareStatusbtn = document.getElementById( "ShareStatus-btn" );
const back_btn = document.querySelector("#back");
var search_btn = document.getElementById("button-btn");
const voice_notification = document.getElementById( "voice-message-notification" );

if (search_btn) {
    search_btn.addEventListener("click", () => {
      var pathMode=`/publicChatPage?publicMessage`;
      window.location.href = `/InformationSearchPage?typemode=${pathMode}`;
    });
}
 
if (back_btn) {
    back_btn.addEventListener("click", () => {
      console.log("back");
      window.location.href = `/ESN_directory_page`;
    });
}

if (send_btn){
    send_btn.addEventListener("click", () => {
        post_msg();
    });
}
//don't use database in frontend, instead, send request with ajax,
//let backend use database


//const user = Math.random().toString();
//data format {user: 'test_user', msg: '54121312', time: '2023-02-19 19:58:17'}
socket.on( "emit-public-msg", ( data,time_sent,user_status ) =>{

    const status = user_status;

    if ( data[ 'user' ] != user ){
        append_msg( data[ "user" ], data[ "msg" ], time_sent,status);
    
    }
    else{
        append_msg( data[ "user" ], data[ "msg" ], time_sent,status);
    }
} )

socket.on( "exist-msg", ( result ) =>{
   
    for ( const msg of result ){
        if (msg["username"] == user){
            append_msg( "Me", msg[ 'msg' ], msg[ 'timesent' ] , msg[ 'status' ]);
            console.log("Height ", $( '#message-container' ).scrollHeight)
        }
        else{
            append_msg( msg[ 'username' ], msg[ 'msg' ], msg[ 'timesent' ] , msg[ 'status' ]);
            console.log("Height ", $( '#message-container' ).scrollHeight)
        }; //$( "#message-container" ).scrollTop( $( '#message-container' ).scrollHeight)
    }
    console.log("Height ", $( '#message-container' ).scrollHeight)
    
    //$( "#message-container" ).scrollTop( $( '#message-container' ).scrollHeight)
} )


function showWindow() {
    var popup = document.getElementById("ShareStatusMenu");
    popup.classList.toggle("show");
}
function getUrl() {
    if (window.location.hostname === 'localhost') {
      return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    } else {
      return 'https://s23esnb3.onrender.com';
    }
  }

function post_msg()
{
    const user_msg = chat_msg.value;
    if ( user_msg.length == 0 )
    {
        alert( "Text cannot be empty" );
        return;
    }
    const Jdata = {
        user: user,
        msg: user_msg,
        //status: find user status in ESN directory, using username
    };
    //send post request to server
    $.ajax( {
        url: `/message/public`,
        type: "POST",
        data: JSON.stringify( Jdata ),
        contentType: "application/json; charset=utf-8",
        statusCode: {
            200:function(data){
                console.log("Message sent success", data );
            }
        },
        error: function ( data )
        {
            console.log( "Recieved Error code", data );
            let idRecieved = data.responseText;
            let messageRev = JSON.parse( idRecieved );
            console.log( messageRev );
        },
    } );

    chat_msg.value = "";
    $( '#message-container' ).scrollTop( $( '#message-container' )[ 0 ].scrollHeight);
}


function append_msg(user,msg,time_sent,status)
{
    const chat_sender = document.createElement( "div" );
    const chat_text = document.createElement( "div" );
    const chat_time = document.createElement( "div" );
    const chat_sender_and_time = document.createElement( "div" );
    const chat_bubble = document.createElement( "div" );
    //const chat_sender_status = document.createElement( "div" );

    chat_sender.classList.add( "chat-sender" );
    chat_text.classList.add( "chat-text" );
    chat_time.classList.add( "chat-time" );
    chat_sender_and_time.classList.add( "chat-sender-and-time" );
    chat_bubble.classList.add( "chat-bubble" );
    //chat_sender_status.classList.add("chat-sender-status");

    chat_sender.innerText = user + " Status:"+status;
    chat_time.innerText = time_sent;
    chat_text.innerText = msg;
    //chat_sender_status.innerText = "User status:undefined";

    chat_sender_and_time.appendChild( chat_sender );
    chat_sender_and_time.appendChild( chat_time );
    chat_bubble.appendChild( chat_sender_and_time );
    chat_bubble.appendChild( chat_text );
    //chat_bubble.appendChild( chat_sender_status );
    msg_container.appendChild( chat_bubble );
}

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
voice_notification.addEventListener("click", function () {
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
});
socket.on("new-voice-message", function (data) {
  console.log("new-voice-message");
  voice_notification.style.display = "block";
});
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

  socket.on( "emit-set-inactive",async ( data ) =>{
    console.log( "emit-set-inactive to",data.username );
    await set_offline( user,data.username );
  });