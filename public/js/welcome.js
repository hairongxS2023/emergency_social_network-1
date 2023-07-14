const welcome_btn = document.querySelector("#ack-button");
const url = window.location.href;
const token = Cookies.get('access_token');
const decodedToken = JSON.parse(atob(token.split('.')[1]));
const username = decodedToken.username.toLowerCase();

if (welcome_btn) {
  welcome_btn.addEventListener("click", (event) => {
    window.location.href = `/ESN_directory_page`;
  });
};

// actually not used right now, but it's a good idea to have this
// if user closes the browser, send a logout request to the server
window.onbeforeunload = function () {
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

socket.on( "emit-set-inactive", ( data ) =>{
  console.log( "emit-set-inactive to",data.username );
  let curr_user = data.username;
  const Jdata = { username: curr_user };
  if(username!=data.username){
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