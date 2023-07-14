
//import {set_offline} from './set_offline.js';

const socket = io( getUrl() );
const start_test_btn = document.querySelector("#start-test");
const stop_test_btn = document.querySelector("#stop-test");
const progress_bar = document.querySelector('#progress-bar');
const back_btn = document.querySelector("#back");
const warningMsg = document.getElementById("warning-msg");
const MAX_TASK = 1000;
const MAX_DURATION = 5;
let post_remainingTime;
let get_remainingTime;
let interval;
let duration;
let ajaxInterval;
let task_count = 0;
let task_total = 0;
let post_success_count = 0;
let get_success_count = 0;
let post_fail_count = 0;
let get_fail_count = 0;
let post_total_ajax_calls = 0;
let post_completed_ajax_calls = 0;
let get_total_ajax_calls = 0;
let get_completed_ajax_calls = 0;
let STOP = false;
const token = Cookies.get('access_token');
const decodedToken = JSON.parse(atob(token.split('.')[1]));
const username = decodedToken.username.toLowerCase();
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
if (back_btn) {
  back_btn.addEventListener("click", () => {
    window.location.href = `/ESN_directory_page`;
  });
}

if (stop_test_btn) {
  stop_test_btn.addEventListener("click", () => {
    stop_test();
  });
}

if (start_test_btn) {
  start_test_btn.addEventListener("click", () => {
    progress_bar.value = 0;
    task_count = 0;
    task_total = 0;
    duration = document.getElementById("duration").value <= MAX_DURATION ? document.getElementById("duration").value : MAX_DURATION;
    interval = document.getElementById("interval").value;
    post_remainingTime = duration;
    get_remainingTime = duration;
    task_total = duration / interval * 1000;
    if(task_total > MAX_TASK){
      warningMsg.innerHTML = "Task total should not be greater than 1000";
      return
    }
    if (!duration || !interval) {
      warningMsg.innerHTML = "Input values should not be empty";
      //warningMsg.innerHTML = random_string(20);
      return
    }
    warningMsg.innerHTML = "";
    console.log("Total task: ", task_total);
    progress_bar.style.display = "block";
    start_speed_test();

    //console.log("start_test_btn");
  });
}
 
function stop_test() {
    progress_bar.value = 0;
    STOP = true;
    $.ajax({
      // Login
      url: `/test-mode`,
      type: "DELETE",
      success: async function (data, t, jqXHR) {
        //console.log("Exit test mode");
        post_remainingTime= Infinity;
        get_remainingTime= 0;
        interval= 0;
        duration= 0;
        task_count = 0;
        task_total = 0;
        post_success_count = 0;
        get_success_count = 0;
        post_fail_count = 0;
        get_fail_count = 0;
        post_total_ajax_calls = 0;
        post_completed_ajax_calls = 0;
        get_total_ajax_calls=0;
        get_completed_ajax_calls=0;
        stopAjaxInterval();
      },
      error: function (data, t, jqXHR) {
        console.log("Error when redirecting");
      },
    });
}
  
function start_speed_test() {
  $.ajax({
    // Login
    url: "/test-mode",
    type: "PUT",
    success: async function (data, t, jqXHR) {
      console.log(data);
      //console.log("Entered test mode");
      STOP=false;
      POST_test();
    },
    error: function (data, t, jqXHR) {
      console.log("Error when redirecting 12");
    },
  }); 
}
 
function POST_test() {
  // start the AJAX interval
  startAjaxInterval("POST");
  warningMsg.innerHTML = "Doing POST tests... ";
  // update remaining time every second
  const timer = setInterval(function () {
    post_remainingTime--;
    if(STOP){
      console.log("from POST_test STOPSTOP");
      stopAjaxInterval(); 
      clearInterval(timer);
      warningMsg.innerHTML = "Test interrupted";
      return;
    }
    //console.log("Time remaining: " + post_remainingTime);
    if (post_remainingTime <= 0) {
      clearInterval(timer);
      stopAjaxInterval();
      //report_result();
      GET_test();
      task_count = 0;
    }
  }, 1000);
}

function GET_test() {
  // start the AJAX interval
  //console.log("start GET test");
  startAjaxInterval("GET");
  warningMsg.innerHTML = "Doing GET tests... ";
  // update remaining time every second
  const timer = setInterval(function () {
    get_remainingTime--;
    if(STOP){
      console.log("from GET_test STOPSTOP");
      stopAjaxInterval();
      clearInterval(timer);
      warningMsg.innerHTML = "Test interrupted";
      return;
    }
    //console.log("Time remaining: " + get_remainingTime);
    if (get_remainingTime <= 0) {
      clearInterval(timer);
      stopAjaxInterval();
      warningMsg.innerHTML = "GET tests finished.";
      console.log("Finished getting messages");
      console.log("total: ",get_total_ajax_calls,"complete: ",get_completed_ajax_calls);
      // if (get_total_ajax_calls === get_completed_ajax_calls) {
      //   report_result();
      // }
      report_result(); 
    } 
  }, 1000);
}

  

function startAjaxInterval(type) {
  ajaxInterval = setInterval(function () {
    if(STOP){
      console.log("from startAjaxInterval STOPSTOP");
      stopAjaxInterval();
    }
    sendAjaxMessage(type);
  }, interval)
}
 
function sendAjaxMessage(type) {
  task_count++;
  const barvalue = (task_count / task_total) * 100 == Infinity? 0 :(task_count / task_total) * 100;

  //console.log("Bar value: ",barvalue);
  progress_bar.value = barvalue;
  const message = random_string(20); // generate a random message of 20 characters
  const Jdata = {
    user: "TEST",
    msg: message,
    //status: find user status in ESN directory, using username
  };

  if (type === "POST") {
    post_total_ajax_calls++;
    $.ajax({
      url: "/message/public",
      type: "POST",
      data: JSON.stringify(Jdata),
      contentType: "application/json; charset=utf-8",
      success: function (data) {
        //console.log("Message sent: " + message);
        post_completed_ajax_calls++;
        post_success_count++;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        post_completed_ajax_calls++;
        console.log("Error sending message: " + errorThrown);
        post_fail_count++;
      },
    });
  }
  else if (type === "GET") {
    get_total_ajax_calls++;
    $.ajax({
      url: "/message/public",
      type: "GET",
      success: function (data) {
        //console.log("Message recieved: " +  data);
        get_completed_ajax_calls++;
        get_success_count++;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error when getting messages: " + errorThrown);
        get_completed_ajax_calls++;
        get_fail_count++;
      },
    });
  }  

}

function report_result() {
  $(document).ready(function () {
    console.log("Test finished");
    //POST Performance: Number of POST requests completed per second
    //GET Performance: Number of GET requests completed per second	
    const POST_perform = post_success_count / duration;
    const GET_perform = get_success_count / duration;
    var popup = $(`<div class='popup'><span class='close'>&times;</span><p>POST: ${POST_perform} requests completed per second.</p>
    <p>GET: ${GET_perform} requests completed per second.</p></div>`);
    $("body").append(popup);

    $(".close").click(function () {
      // remove popup window
      stop_test();
      popup.remove();
    });

  });  
 
} 
function random_string(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result; 
}
function stopAjaxInterval() {
  clearInterval(ajaxInterval);
}

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

function getUrl ()
{
  if ( window.location.hostname === 'localhost' )
  {
    return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
  } else
  {
    return 'https://s23esnb3.onrender.com';
  }
}

socket.on( "emit-set-inactive", async ( data ) =>{
  console.log( "emit-set-inactive to",data.username );
  await set_offline( username,data.username );
});