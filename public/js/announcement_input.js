//import {set_offline} from './set_offline.js'

const input = document.getElementById("user-text");
const submit_btn = document.getElementById("submit-btn");
const close_btn2 = document.getElementById("close-btn");
const announcement_popup = document.querySelector(".popup-container");

const token = Cookies.get('access_token');
const decodedToken = JSON.parse(atob(token.split('.')[1]));
const username = decodedToken.username.toLowerCase();

function end_post(){
    announcement_popup.style.display = "none";
    input.value = "";
}
submit_btn.onclick = function (){
    if (input.value == ""){
        return;
    }
    const Jdata = {
        username: username,
        announcement_content: input.value
    }
    $.ajax({
        url: "/announcements",
        type: "POST",
        data: JSON.stringify(Jdata),
        contentType: "application/json; charset=utf-8",
        statusCode:{
            201: function (data, t, jqXHR) {
                console.log("Post success.");
                end_post();
            },
            403: function (data, t, jqXHR) {
                console.log("Post failed.");
                alert("Sorry, only coordinators or above are allowed to post announcement.");
                end_post();
            },
            400: function (data, t, jqXHR) {
                console.log("Post failed.");
                end_post();

            },
            500: function (data, t, jqXHR) {
                console.log("Post failed.");
                end_post();
            }
        },
      })    
}

close_btn2.onclick = function (){
    end_post();
}
