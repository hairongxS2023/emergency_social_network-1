const modal = document.getElementById("registerMsgBox");
const span = document.getElementsByClassName("close")[0];
const reg_btn = document.querySelector("#register-button");
const yes_btn = document.querySelector("#yes-btn");
const no_btn = document.querySelector("#no-btn");
const inactiveBox = $("#inactive-popup");
const closeButton = $(".close-button");


function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    //console.log("in index.js Cookie: ",cookie);
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return null;
}
if (reg_btn) {
  reg_btn.addEventListener("click", () => {
    modal.style.display = "block";
  });
}

if (yes_btn) {
  yes_btn.addEventListener("click", () => {
    modal.style.display = "none";
    const username_t = document.getElementById("username").value.toLowerCase();
    const password_t = document.getElementById("password").value;
    
    const Jdata = {
      username: username_t,
      password: password_t,
    };
    console.log("at  index.js: ", Jdata);
    $.ajax({
      // Try to Register New User
      url: "/users",
      type: "POST",
      data: JSON.stringify(Jdata),
      contentType: "application/json; charset=utf-8",
      xhrFields: {
        withCredentials: true
      },
      statusCode: {
        201: function (responseObject, textStatus, jqXHR) {
          window.location.href = `/Welcome`;
        },
        200: function (responseObject, textStatus, errorThrown) {
          $.ajax({
            // Login
            url: `/users/${username_t}/online`,
            type: "PUT",
            data: username_t,
            success: async function (data, t, jqXHR) {
              console.log("index.js go to esndirectory");
              window.location.href = `/ESN_directory_page`;
            },
            error: function (data, t, jqXHR) {
              console.log("Error when redirecting");
            },
          });
        },
        400: function (responseObject, textStatus, errorThrown) {
          let idRecieved = responseObject.responseText;
          let messageRev = JSON.parse(idRecieved);
          console.log(messageRev);
          let warningMsg = document.getElementById("warning-msg");
          warningMsg.innerHTML = messageRev;
        },
        401: function(){
          console.log("token Invalid");
        },
        403: function(){
          console.log("Account is inactive, please contact admin");
          inactiveBox.css("display", "flex");

          closeButton.on("click", function () {
              inactiveBox.css("display", "none");
          });
        }
      },
    });
  });
}

if (no_btn) {
  no_btn.addEventListener("click", (event) => {
    modal.style.display = "none";
    window.location.replace("/");
  });
}

span.onclick = function () {
  modal.style.display = "none";
};



