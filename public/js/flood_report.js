//import {set_offline} from './set_offline.js';

const token = Cookies.get( 'access_token' );
const decodedToken = JSON.parse( atob( token.split( '.' )[ 1 ] ) );
const username = decodedToken.username.toLowerCase();
const submit_button = document.getElementById( 'submit-btn');
const backBtn = document.getElementById('back');
const report_section = document.getElementById('report-section');
const socket = io(getUrl());


submit_button.addEventListener( 'click', ()=>{window.location.href = "/flood_report/new_report_page"});
backBtn.addEventListener('click', () => {window.location.href = '/ESN_directory_page';});
// image_area.addEventListener('click', () => {take_picture()});
window.onload = function(){
    //request report history
    get_report_history();
};

function get_report_history(){
    $.ajax({
        url: '/flood_reports',
        type: 'GET',
        statusCode:{
            200: (data) =>{
                load_report_history(data.report_history);
            },
            error: (err)=>{
                console.log(err);
            },
        }
    });
}



function handleDeleteButtonClick(report_id, poster){
    if (poster != username){
        alert("You are not the poster of this report, you can't delete it");
        return;
    }
    console.log("delete button clicked")
    $.ajax({
        url: '/flood_reports',
        type: 'DELETE',
        data: {report_id: report_id},
        statusCode:{
            204: (data) =>{
                console.log(data.message);
                window.location.reload();
            },
            error: (err)=>{
                console.log("error when sending request" + err);
            },
        }
    });
}

async function handleVoteClick(username, report_id, vote_type){
    return new Promise((resolve, reject) => {
    $.ajax({
        url: '/flood_reports',
        type: 'PATCH',
        data: {username: username, report_id: report_id, vote_type: vote_type},
        statusCode:{
            200: (data) =>{
                console.log("update vote successfully");
                resolve();
                //window.location.reload();
            },
            409:(data)=>{
                alert("You have already voted for this report, you can't vote again");
                reject();
            },
            400: (data)=>{
                console.log("Error when voting" + data.message);
                reject();
            },
        }
    });
});
}



async function load_report_history(data){
    report_section.innerHTML = "";
    // report type:{
    //     image_source: {data: {data: Array (type buffer)}, contentType: "image/png"},
    //     location: "3355 Scott Blvd #110, Santa Clara, CA 95054",
    //     poster: "hakan",
    //     time: "3/31/2023, 6:30:56pm"
    //     upvote: 0,
    //     downvote: 0}
    data.forEach((report)=>{
        let article = document.createElement('article');
        let img = document.createElement('img');
        let flood_detail = document.createElement('div');
        let flood_location = document.createElement('h2');
        let flood_time = document.createElement('p');
        let flood_poster = document.createElement('p');
        let delete_button = document.createElement('button');
        let upvote_button = document.createElement('button');
        let downvote_button = document.createElement('button');
        let upvote_count = document.createElement('span');
        let downvote_count = document.createElement('span');
        let button_container = document.createElement('div');
        let vote_container = document.createElement('div');
        let upvote_count_database = report['upvote'];
        let downvote_count_database = report['downvote'];
        append_icon({
            del: delete_button,
            up: upvote_button,
            down: downvote_button,
            img: img,
            article: article,
            flood_detail: flood_detail,
            flood_location: flood_location,
            flood_time: flood_time,
            flood_poster: flood_poster,
            upCount: upvote_count,
            downCount: downvote_count,
            button_container: button_container,
            vote_container: vote_container,
            upvote_count_database: report['upvote'],
            downvote_count_database: report['downvote']
          });
          ``
                  flood_location.innerHTML = report['location'];
        flood_time.innerHTML = report['time'];
        flood_poster.innerHTML = "Poster: " + report['poster'];
        const binaryData = report["image_source"]["data"]["data"];
        const contentType = report["image_source"]["contentType"];
        let uint8Array = new Uint8Array(binaryData);
        const base64Decoded = Array.from(uint8Array).map(char => String.fromCharCode(char)).join('');
        // const base64Data = btoa(binaryStr)
        // const base64Decoded = atob(base64Data);
        img.src = base64Decoded;
        report_section.appendChild(article);
        delete_button.addEventListener('click', () => handleDeleteButtonClick(report['_id'], report['poster']));
        upvote_button.addEventListener('click', async () => {
            handleVoteClick(username, report['_id'], 'upvote')
                .then(()=> upvote_count.innerHTML = parseInt(upvote_count.innerHTML) + 1);
        });
        downvote_button.addEventListener('click', async () => {
            handleVoteClick(username, report['_id'], 'downvote')
                .then(()=> downvote_count.innerHTML = parseInt(downvote_count.innerHTML) + 1);
        });
        //downvote_button.addEventListener('click', () => handleDownvoteButtonClick(report['_id']));

    });
}


function createIcon(iconClass) {
    let icon = document.createElement('i');
    icon.className = iconClass;
    return icon;
  }
  
  function createButtonWithIcon(buttonClass, iconClass) {
    let button = document.createElement('div');
    let icon = createIcon(iconClass);
    button.className = buttonClass;
    button.appendChild(icon);
    return button;
  }
  
  function createElementWithClass(elementType, className) {
    let element = document.createElement(elementType);
    element.className = className;
    return element;
  }
  

  function createIcons(trashClass, upvoteClass, downvoteClass) {
    let trashIcon = createIcon(trashClass);
    let upvoteIcon = createIcon(upvoteClass);
    let downvoteIcon = createIcon(downvoteClass);
    return { trashIcon, upvoteIcon, downvoteIcon };
  }
  
  function assignClassNames(elements, classNames) {
    elements.forEach((element, index) => {
      element.className = classNames[index];
    });
  }
  
  function append_icon(options) {
    const { del, up, down, img, article, flood_detail, flood_location, flood_time, flood_poster, upCount, downCount, button_container, vote_container, upvote_count_database, downvote_count_database } = options;
  
    const { trashIcon, upvoteIcon, downvoteIcon } = createIcons('fa fa-trash', 'fa fa-arrow-up', 'fa fa-arrow-down');
    
    assignClassNames(
      [del, up, down, upCount, downCount, vote_container, button_container],
      ['delete-btn', 'upvote-btn', 'downvote-btn', 'vote-count', 'vote-count', 'vote-container', 'button-container']
    );
  
    up.appendChild(upvoteIcon);
    down.appendChild(downvoteIcon);
    del.appendChild(trashIcon);
    vote_container.append(up, upCount, down, downCount);
    button_container.append(del, vote_container);
  
    assignClassNames(
      [img, article, flood_detail, flood_location, flood_time, flood_poster],
      ['flood-image', 'flood-report', 'flood-detail', 'flood-location', 'flood-time', 'flood-poster']
    );
    upCount.innerHTML = upvote_count_database;
    downCount.innerHTML = downvote_count_database;
    flood_detail.append(flood_location, flood_time, flood_poster);
    article.append(img, flood_detail, button_container);
  }
  

socket.on( "emit-set-inactive", async( data ) =>{
    await set_offline(username,data.username);
  });

socket.on( "new_flood_report", async( data ) =>{
    get_report_history();
  });

  function getUrl() {
    if (window.location.hostname === 'localhost') {
      return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    } else {
      return 'https://s23esnb3.onrender.com';
    }
  }
