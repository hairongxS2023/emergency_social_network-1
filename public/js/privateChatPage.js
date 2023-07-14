//default port for this project is 5003
//cannot use socket.on to hear data from client
//import {set_offline} from './set_offline.js';

const socket = io(getUrl());
const msg_container = document.getElementById( "message-container" );
const chat_msg = document.getElementById( "message-input" );
// here we could use the username in private chat page.
const token = Cookies.get('access_token');
const decodedToken = JSON.parse(atob(token.split('.')[1]))
const username = decodedToken.username;
console.log("username", username);
const user1 = document.getElementById("user1").textContent.trim();
const user2 = document.getElementById("user2").textContent.trim();
const roomID = document.getElementById("roomID").textContent.trim();
const back_btn = document.getElementById("back");
const search_btn = document.getElementById("button-btn");
window.onload = function () {
  $.ajax({
    // Login
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
};
if (search_btn) {
  search_btn.addEventListener("click", () => {
    var pathMode=`/privateChatPage?privateMessage`;
    window.location.href = `/InformationSearchPage?typemode=${pathMode}`;
  });
}

if (back_btn) {
    back_btn.addEventListener("click", () => {
      window.location.href = `/ESN_directory_page`;
    });
  }
console.log("user1" + user1 + "user2" + user2);
const targetUser = user2; // Access the value at the randomly generated index
//targetUser is receiver, each page have distinguish targetUser
//for example, when making an API for sender "jason", receiver "hakan" e.g. /privateChatPage?user1=jason?user2=hakan
//on jason's side, hakan is receiver, on hakan's side, jason is receiver.

//data format {user: 'test_user', msg: '54121312', time: '2023-02-19 19:58:17'}
socket.on( "emit-private-msg", ( data ) =>{
    if (data.roomID == roomID){
        if (data.sender == username){
            //send by myself
            append_msg( "Me", data.msg, data.timesent, data.sender_emg_status );
        }
        if (data.receiver == username){
            append_msg( data.sender, data.msg, data.timesent, data.sender_emg_status );
        }
    }
});


function ShareStatus() 
{
    window.location.href = `/ShareStatusPage?username=${username}`;
}

function post_msg(){
    const user_msg = chat_msg.value;
    if ( user_msg.length == 0 ){
        alert( "Text cannot be empty" );
        return;
    }
    const Jdata = {
        sender: username,
        msg: user_msg,
        receiver: targetUser,
        roomID: roomID,
        //status: find user status in ESN directory, using username
    };
    //send post request to server
    $.ajax( {
        url: `/message/private`,
        type: "POST",
        data: JSON.stringify( Jdata ),
        contentType: "application/json; charset=utf-8",
        statusCode:{
            200: function (response, textStatus, err){
                $.ajax({
                    url: "/receiver/notification",
                    type: "PUT",
                    data: JSON.stringify({sender: response.sender, receiver: response.receiver}),
                    contentType: "application/json; charset=utf-8",
                    success: function(success_res){
                        console.log("success on PUT at receiver/notification URL");
                    },
                    error: function(err){
                        console.log("Error PUT at receiver/notification URL");
                    }
                });
            }
        },
        error: function ( data )
        {
            console.log( "Recieved Error code", data );
            let idRecieved = data.responseText;
            let messageRev = JSON.parse( idRecieved );
            console.log( messageRev );
            let p = document.getElementById( "warning-msg" );
            p.innerHTML = messageRev.message;
        },
    } );

    chat_msg.value = "";
    $( '#message-container' ).scrollTop( $( '#message-container' )[ 0 ].scrollHeight );
}

function append_msg ( user, msg, time_sent, sender_status )
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

    chat_sender.innerText = user + " Emergency Status: " + sender_status;
    chat_time.innerText = time_sent;
    chat_text.innerText = msg;
    //chat_sender_status.innerText = "User status:undefined";

    chat_sender_and_time.appendChild( chat_sender );
    chat_sender_and_time.appendChild( chat_time );
    chat_bubble.appendChild( chat_sender_and_time );
    chat_bubble.appendChild( chat_text );
    //chat_bubble.appendChild( chat_sender_status );
    msg_container.appendChild( chat_bubble );
};

// if user closes the browser, send a logout request to the server
window.onbeforeunload = function () {
  const Jdata = { username: username.toLowerCase()};
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

  const voice_notification = document.getElementById( "voice-message-notification" );
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

  socket.on( "emit-set-inactive", async ( data ) =>{
    console.log( "emit-set-inactive to",data.username );
    await set_offline(user, data.username );
  });