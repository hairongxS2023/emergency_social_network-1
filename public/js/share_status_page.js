//import {set_offline} from './set_offline.js';

const overlay = document.getElementById("overlay");
const close_btn = document.getElementById("close_btn");
let socket = io(getUrl());

function getuserjwt()
{
  const token = Cookies.get('access_token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const username = decodedToken.username.toLowerCase();
  return username;
}
function asmurl()
{
  return `/share_status_page`;
}

function serachMessage()
{

    //Handles the window for mobile mode
    const width = 300;
    const height = 500;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);
    const url = `/InformationSearchPage`;
    const username =getuserjwt();
    const title = "ShareStatus";
    const popupWindow = window.open(url, title, `width=${width}, height=${height}, left=${left}, top=${top}`);
}

function checkBrowser() {
  return  ['mobile', 'android', 'iphone', 'ipad', 'windows phone'].some(keyw => navigator.userAgent.toLowerCase().includes(keyw));
}

function openPopupWindowM() {
  //Handles the window for mobile mode
  const width = 300;
  const height = 500;
  const left = (screen.width / 2) - (width / 2);
  const top = (screen.height / 2) - (height / 2);
  const url = asmurl();
  const username =getuserjwt();
  const title = "ShareStatus";
  const popupWindow = window.open(url, title, `width=${width}, height=${height}, left=${left}, top=${top}`);

  popupWindow.onload = () => {
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
    const doneButton = popupWindow.document.getElementById("done_btn");
    doneButton.addEventListener("click", () =>{
      if (window.top && window.top.location) {
        window.top.location.reload();
        popupWindow.close();
      }
    });

    const ok_btn = popupWindow.document.getElementById("ok_btn");
    ok_btn.addEventListener("click", () => {
       electToShareStatus("OK"); 
      });

    const help_btn = popupWindow.document.getElementById("help_btn");
    help_btn.addEventListener("click", () => { 
      electToShareStatus("Help");
     });

    const emergency_btn = popupWindow.document.getElementById("emergency_btn");
    emergency_btn.addEventListener("click", () => { 
      electToShareStatus("Emergency");
     });
  };

  function electToShareStatus(status) {
    const url = `/users/${username}/EmergencyLevels`;
    console.log("redundant function");
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emergencyStatus: status, citizens: username }),
    };
    return fetch(url, options)
      .then((response) => {
        if (response.ok) 
        {
          const feedbackElement = document.getElementById('feedback');
          if (feedbackElement) {
          feedbackElement.textContent = `${username} selected ${status}!`;
          if (status === 'OK') 
          {
            feedbackElement.style.color = '#FFF';
            feedbackElement.style.backgroundColor = '#005937';
          } else if (status === 'Help') 
          {
            feedbackElement.style.color = '#000';
            feedbackElement.style.backgroundColor = '#FFE13A';
          } else if (status === 'Emergency') 
          {
            feedbackElement.style.color = '#FFF';
            feedbackElement.style.backgroundColor = '#FF0000';
          }
        }
          return;
        } 
        else {
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  }
}


function openPopupWindowNM() 
{
  const xhr = new XMLHttpRequest();
  const url = asmurl();
  const username =getuserjwt();
  
  xhr.onreadystatechange = function()
   {
    if (this.readyState == 4 && this.status == 200) 
    {
      const popupContent = document.createElement("div");
      popupContent.innerHTML = this.responseText;
      const popupElement = document.getElementById("sharestatuspopup");
      popupElement.innerHTML = "";
      popupElement.appendChild(popupContent);

      const doneButton = document.getElementById("done_btn");
      doneButton.addEventListener("click", () => {
        window.close();
        window.location.href = window.location.href;

        if(window.opener!=null)
          window.opener.location.reload();
      });

      const ok_btn = document.getElementById("ok_btn");
      ok_btn.addEventListener("click", () => { 
        electToShareStatus("OK"); 
      });

      const help_btn = document.getElementById("help_btn");
      help_btn.addEventListener("click", () => {
         electToShareStatus("Help"); 
        });

      const emergency_btn = document.getElementById("emergency_btn");
      emergency_btn.addEventListener("click", () => { 
        electToShareStatus("Emergency"); 
      });

    }
  
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";

    async function electToShareStatus(status) 
    {
      const url = `/users/${username}/EmergencyLevels`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emergencyStatus: status, citizens: username }),
      };
      return fetch(url, options).then((response) => 
      {

          if (response.ok) 
          {
            const feedbackElement = document.getElementById('feedback');
            if (feedbackElement) {
            feedbackElement.textContent = `${username} selected ${status}!`;
            if (status === 'OK') 
            {
              feedbackElement.style.color = '#FFF';
              feedbackElement.style.backgroundColor = '#005937';
            } else if (status === 'Help') 
            {
              feedbackElement.style.color = '#000';
              feedbackElement.style.backgroundColor = '#FFE13A';
            } else if (status === 'Emergency') 
            {
              feedbackElement.style.color = '#FFF';
              feedbackElement.style.backgroundColor = '#FF0000';
            }
          }
            return Promise.resolve(200);
          } 
          else 
          {
            return Promise.reject(400);
          }
          
        }).catch((error) =>
         {
          console.log(error);
          return Promise.reject(400);
        });
    }
  };


  
  xhr.open("GET", url, true);
  xhr.send();

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

// async function set_off_status(curr_user, username) {
//   console.log("this username:",username)
//   console.log("data.username:",curr_user)
//   const Jdata = { username: username };
  
//   $.ajax({
//     url: "/users/offline",
//     type: "PUT",
//     data: JSON.stringify( Jdata ),
//     statusCode:{
//       200: function (data) {
//         console.log(username + " is offline");
//         alert("you have been logged out due to status set to inactive");
//         window.location.replace( "/" );
//       },
//     } ,
//     error: function (data) {
//       console.log("error setting it "+ username+ " is offline");
//     },
//   });
// }

// socket.on( "emit-set-inactive", async ( data ) =>{
//   console.log( "emit-set-inactive to",data.username );
//   let curr_user = data.username;
//   await set_off_status(username, curr_user);
// });