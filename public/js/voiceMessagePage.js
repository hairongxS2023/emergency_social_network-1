//import {set_offline} from './set_offline.js';


const messages = document.getElementById("voice-message-container");
const back_btn = document.querySelector("#back");
const socket = io(getUrl());
const message = document.getElementById("message");
//const sendButton = document.getElementById("send");
const stopButton = document.getElementById("stop");
const info_name = document.getElementById("user-name");
const recordButton = document.getElementById("record-btn");
const record_popup = document.getElementById("record-popup");
const token = Cookies.get('access_token');
const decodedToken = JSON.parse(atob(token.split('.')[ 1 ]));
const username = decodedToken.username.toLowerCase();
const deleteButton = document.querySelector('.delete-button');
const confirmationPopup = document.getElementById('delete-confirmationPopup');
const submit_confirmationPopup = document.getElementById('submit-confirmationPopup');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');
const confirmSubmit = document.getElementById('confirmSubmit');
const cancelSubmit = document.getElementById('cancelSubmit');
const submit_announcement_Button = document.getElementById('submit_announcement');
const textPopup = document.getElementById('text-popup');
const text_message = document.getElementById('text-message');
const submitTextButton = document.getElementById('submitText');
const cancelTextButton = document.getElementById('cancelText');
const text_confirmationPopup = document.getElementById('text-confirmationPopup');
const confirmText = document.getElementById('confirmText');
const cancel_confirmText = document.getElementById('cancel_confirm_Text');
let mediaRecorder;

window.addEventListener("load", function () {
  info_name.innerText = `Username: ${username}`;
  user_online();
  get_voice_msg();
});

function back() {
  window.location.href = `/ESN_directory_page`;
}

function getUrl() {
  if (window.location.hostname === 'localhost') {
    return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
  } else {
    return 'https://s23esnb3.onrender.com';
  }
}
function user_online() {
  $.ajax({
    // Login
    url: `/users/${username}/online`,
    type: "PUT",
    data: username,
    success: async function (data, t, jqXHR) {
      console.log(`User ${username} is online`);
    },
    error: function (data, t, jqXHR) {
      console.log(`User ${username} is offline`);
    },
  });
}

function scrollToBottom() {
  const voiceMessagesContainer = document.getElementById('voice-message-container');
  voiceMessagesContainer.scrollTop = voiceMessagesContainer.scrollHeight;
}

function delete_http_call(e) {
  const msg = e.target.parentElement;
  const msg_id = msg.id;
  //console.log("delete message: " + msg_id);
  const Jdata = { id: msg_id };
  $.ajax({
    url: "/voice-messages",
    type: "DELETE",
    data: JSON.stringify(Jdata),
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      get_voice_msg();
      console.log('Voice message deleted');
      confirmationPopup.style.display = 'none';
    },
    error: function (err) {
      confirmationPopup.style.display = 'none';
      console.log(err);
    }
  });
  
}

function setupConfirmDeleteListener(e) {
  const wrappedDeleteVoiceMessage = () => delete_http_call(e);
  confirmDelete.onclick = wrappedDeleteVoiceMessage;
}
function perform_deletion(e){
      confirmationPopup.style.display = 'block';
      setupConfirmDeleteListener(e);
      cancelDelete.onclick = hide_confirmationPopup;
}

function delete_voice_msg() {
  const delete_btns = document.querySelectorAll(".delete-button");
  delete_btns.forEach((btn) => {
    btn.onclick= (e => {
      perform_deletion(e);
    });
  });
}

function hide_confirmationPopup() {
  confirmationPopup.style.display = 'none';
}

function renderVoiceMessages(data, messages, username) {
  messages.innerHTML = "";
  data.data.forEach((msg) => {
    const voice_msg = document.createElement("div");
    voice_msg.classList.add("voice-message");
    voice_msg.id = msg._id;
    const voiceDataBuffer = msg.voicedata; // Your OGG buffer
    const arr = new Uint8Array(voiceDataBuffer.data);
    const newblob = new Blob([arr], { type: "audio/ogg" });
    const objectUrl = URL.createObjectURL(newblob);
    const display_mode = msg.sender === username ? "block" : "none";
    voice_msg.innerHTML = `
      <div class="voice-message__header" mongoid="${msg._id}">
        <div class="voice-message__header__username">${msg.sender}
          <span class="status-dot" data-status="${msg.status}"></span>
        </div>
        <div class="voice-message__header__time">${msg.timesent}</div>
        <button class="delete-button" id="${msg._id}" style="display: ${display_mode};">
          <i class="fa fa-trash" aria-hidden="true"></i>
        </button>
      </div>
      <div class="voice-message__body" mongoid="${msg._id}">
        <audio controls preload="auto">
          <source src="${objectUrl}" type="${newblob.type}"; codecs=vorbis">
        </audio>
      </div>
    `;
    messages.appendChild(voice_msg);
  });
}

function get_voice_msg() {
  $.ajax({
    url: "/voice-messages",
    type: "GET",
    success: function (data) {
      const audio = document.createElement('audio');
      if (!audio.canPlayType('audio/ogg')) {
        console.warn('Your browser does not support the OGG audio format.');
        return
      }
      renderVoiceMessages(data, messages, username);
      scrollToBottom();
      delete_voice_msg();
    },
    error: function (err) {
      console.log(err);
    }
  });
}

async function submitVoiceMessage(chunks) {
  console.log("submit");
  const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
  const formData = new FormData();
  formData.append("username", username);
  formData.append("voice-message", blob, "voice-message.ogg");
  submit_confirmationPopup.style.display = 'none';
  const response = await fetch("/voice-messages", {
    method: "POST",
    body: formData,
  });
  if (response.status === 429) {
    alert("You are sending messages too quickly. Please wait before sending another message.");
    return;
  }
  const data = await response.json();
  console.log("data", data);
}

function setupConfirmSubmitListener(chunks) {
  const wrappedSubmitVoiceMessage = () => submitVoiceMessage(chunks);

  // Assign the new event handler to the onclick attribute, replacing any existing handler
  confirmSubmit.onclick = wrappedSubmitVoiceMessage;
}

function hide_record_popup(timerInterval, recordingTime) {
  record_popup.style.display = "none";
  clearInterval(timerInterval);
  recordButton.style.display = "block";
  recordingTime.textContent = "0:00";
}

function hide_submit_confirmationPopup() {
  submit_confirmationPopup.style.display = 'none';
}

function stop_media_recorder(mediaRecorder, timerInterval, recordingTime) {
  submit_confirmationPopup.style.display = "none";
  clearInterval(timerInterval);
  recordingTime.textContent = "0:00";
  recordButton.style.display = "block";
  record_popup.style.display = "none";
  console.log("mediaRecorder.state: ", mediaRecorder.state);
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
}

function hide_text_confirmation_popup() {
  text_confirmationPopup.style.display = 'none';
  textPopup.style.display = 'block';
}

function hide_text_popup() {
  textPopup.style.display = 'none';
}

function announcement_http_call(text){
  const Jdata = {
    "username": username,
    "announcement_content":text,
  };
  $.ajax({
    url: "/emergency-events",
    type: "POST",
    data: JSON.stringify(Jdata),
    contentType: "application/json; charset=utf-8",
    statusCode: function (data , status, xhr) {
      
      console.log("Announcement sent");
    },
    error: function (err) {
      console.log(err);
    }
  });
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
function submit_announcement(Jdata){
  text_message.value = ""; //clear text message
  textPopup.style.display = 'block';
  submitTextButton.onclick = function () {
    textPopup.style.display = 'none';
    text_confirmationPopup.style.display = 'block';
    confirmText.onclick = function () {
      text_confirmationPopup.style.display = 'none';
      const text = text_message.value;
      check_text_length(text);
      announcement_http_call(text);
      console.log('Text message submitted');
      textPopup.style.display = 'none';
    };//end of confirmText.onclick

    console.log(cancel_confirmText);
    cancel_confirmText.onclick = hide_text_confirmation_popup;//end of cancelText.onclick  
  };//end of submitTextButton.onclick
  cancelTextButton.onclick = hide_text_popup;
}



if (back_btn) {
  back_btn.onclick = back;
}

if (submit_announcement_Button){
  submit_announcement_Button.onclick = submit_announcement;
}

if (recordButton) {
  recordButton.addEventListener("click", async (event) => {
    record_popup.style.display = "block";
    recordButton.style.display = "none";
    const stopButton = record_popup.querySelector(".stop-btn");
    const closeButton = record_popup.querySelector(".close-btn");
    const recordingTime = record_popup.querySelector("#recording-time");

    let startTime = Date.now();
    let minutes = 0;
    let seconds = 0;
    let timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      minutes = Math.floor(elapsedTime / 60000);
      seconds = Math.floor((elapsedTime % 60000) / 1000);
      recordingTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
    if (closeButton) {
      closeButton.onclick = () => hide_record_popup(timerInterval, recordingTime);
    }
    event.preventDefault();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      if (minutes === 0 && seconds < 2) {
        alert("Please record at least 2 seconds");
        return;
      }
      else if (minutes > 0) {
        alert("Please record less than 1 minute");
        return;
      }
      submit_confirmationPopup.style.display = "block";
      setupConfirmSubmitListener(chunks);
      cancelSubmit.onclick = hide_submit_confirmationPopup;
    });

    mediaRecorder.start();
    // recordButton.disabled = true;
    // stopButton.disabled = false;
    stopButton.onclick = () => stop_media_recorder(mediaRecorder, timerInterval, recordingTime);
  });//recordButton
}

//================================================================================================
//======================================== socket.io =============================================
//================================================================================================

socket.on("voice-message", (data) => {
  get_voice_msg();
});
socket.on("delete-voice-message", (data) => {
  get_voice_msg();
});

socket.on( "emit-set-inactive", async ( data ) =>{
  console.log( "emit-set-inactive to",data.username );
  await set_offline(username, data.username );
});
