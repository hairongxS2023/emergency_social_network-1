async function set_offline(curr_user, username) {
    //console.log( "emit-set-inactive to",data.username );
    //let curr_user = data.username;
    console.log("this username:",username)
    console.log("data.username:",curr_user)
    const Jdata = { username: username };
    
    $.ajax({
      url: "/users/offline",
      type: "PUT",
      data: JSON.stringify( Jdata ),
      statusCode:{
        200: function (data) {
          console.log(username + " is offline");
          alert("you have been logged out due to status set to inactive");
          window.location.replace( "/" );
        },
      } ,
      error: function (data) {
        console.log("error setting it "+ username+ " is offline");
      },
    });
  
  
  }