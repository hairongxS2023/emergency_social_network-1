const form = document.querySelector('form');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-input-btn');
const stopBtn = document.getElementById('stop-btn');

const resultSection = document.querySelector('.result');
const backButton = document.getElementById('back-btn');

const searchResult = document.getElementById( "searchResult" );
const resultCount = document.getElementById('result-count');
const searchResultsHeader = document.getElementById('searchResultsHeader');
const search_result_announcement = document.getElementById( 'searchAnnouncementsResult' )
const searchResultContainer = document.getElementById( "announcement-search-container" );
const show_more_announcement_btn = document.getElementById( 'show_announcement_more_btn' );

const citizenCriteria = document.getElementById("citizen_criteria");
const token = Cookies.get( 'access_token' );
const decodedToken = JSON.parse( atob( token.split( '.' )[ 1 ] ) );
const username = decodedToken.username.toLowerCase();

let announcement_count = 0;


if (backButton) {
    backButton.addEventListener('click', function (e) {
        console.log("back");
        window.location.href = `/ESN_directory_page`;
    });
}

async function search_success(data){
  //console.log(data);
  var users = data.userlist;
  //console.log(users);
  if ( users.length === 0 )
  {
  alert( "No user found!" );
  return;
  }
  if ( users.length > 1 )
  {
  user_sort_name( users )
  user_sort( users )
  }
  console.log("esarch user");
  searchResult.style.display = 'block';
  $( "#searchResultTable > tbody" ).empty();
  $.each( users, function ( index, item )
  {
    //console.log()
    var row = $( "<tr>" ).append(
      $( '<td align="center">' ).html( '<a href="#" class="username" data-url="' + item.username + '">' + item.username + '</a>' ),
      $( '<td align="center">' ).html( '<span class="' + ( item.status === 'online' ? 'online' : 'offline' ) + '">' + item.status + '</span>' ),
      $( '<td align="center">' ).html( function ()
      {
        if ( item.emergency_status === "Emergency" )
        {
          return '<img src="asset/EMERGENCY.png" alt="Emergency icon" style="width: 20px; height: 20px;"> ' + item.emergency_status;
        } else if ( item.emergency_status === "undefined" )
        {
          return '<img src="asset/undefined.png" alt="undefined icon" style="width: 20px; height: 20px;"> ' + item.emergency_status;
        } else if ( item.emergency_status === "OK" )
        {
          return '<img src="asset/OK.png" alt="OK icon" style="width: 20px; height: 20px;"> ' + item.emergency_status;
        } else if ( item.emergency_status === "Help" )
        {
          return '<img src="asset/HELP.png" alt="Help icon" style="width: 20px; height: 20px;"> ' + item.emergency_status;
        } else
        {
          return '';
        }
      } )
    );
    $( "#searchResultTable > tbody" ).append( row );
  } );
}

if (searchBtn) {
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const searchValue = searchInput.value;
        console.log(searchValue);
        console.log(citizenCriteria.value);
        if (searchValue) {
            if (citizenCriteria.value === "username") {
            $.ajax({
                url: `/users/${searchValue}`,
                type: 'GET',
                contentType: 'application/json;charset=UTF-8',
                success: async function (data) {
                    await search_success(data);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
        else if (citizenCriteria.value === "status") {
            const search_value = searchInput.value;
            console.log(search_value);
            $.ajax({
                type: 'GET',
                url: `/users/statuses/${ search_value }`,
                contentType: 'application/json;charset=UTF-8',
                success: async function (data) {
                    await search_success(data);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }else if(citizenCriteria.value==='announcement'){
          const search_value = searchInput.value;
          console.log(search_value);
          searchResult.style.display = 'none';
          announcement_count = 10;
          //$( "#announcement-search-container" ).empty();
          //console.log( search_announcement_input.value );
          post_announcement_search(announcement_count, search_value);
          
        }
    }
    else {
        alert("Please enter a search value");
    }
});
}
      
show_more_announcement_btn.addEventListener( "click", ( event ) =>
{
  const search_value = searchInput.value;
  announcement_count += 10;
  post_announcement_search(announcement_count, search_value);
            
} );

function user_sort_name ( users )
{
  users.sort( function ( a, b )
  {
    if ( a.username < b.username )
    {
      return -1;
    } else if ( a.username > b.username )
    {
      return 1;
    } else
    {
      return 0;
    }
  } )
}

function user_sort ( users )
{
  users.sort(
    function ( a, b )
    {
      if ( a.status === 'online' && b.status === 'offline' )
      {
        return -1;
      } else if ( a.status === 'offline' && b.status === 'online' )
      {
        return 1;
      } else
      {
        return 0;
      }
    }
  )
}

function appendAnnouncement ( object, data ){
  object.innerHTML = "";
  for ( let i = data.length - 1; i >= 0; i-- )
  {
    
    const item = data[ i ];
    const display_mode = (item.sender === username) ? "block" : "none";
    // Create a new announce-bubble div
    const announceBubble = document.createElement( "div" );
    announceBubble.className = "announce-bubble";

    // Create the sender and content elements
    const sender = document.createElement( "p" );
    sender.className = "announce-sender";
    sender.textContent = item.sender;
    const bubble_header = document.createElement( "div" );
    const tool_section = document.createElement( "div" );
    tool_section.className = "announce-bubble-tool-section";
    bubble_header.className = "announce-bubble-header";
    const delete_button = document.createElement( "button" );
    const modify_button = document.createElement( "button" );
    const content = document.createElement( "p" );
    content.className = "announce-text";
    content.textContent = item.announcement_content;
    const timeSent = document.createElement( "p" );
    timeSent.className = "announce-time";
    timeSent.textContent = item.timesent;
    // Append the sender, content, and time to the announce-bubble
    announceBubble.appendChild( bubble_header );
    bubble_header.appendChild( sender );
    bubble_header.appendChild( tool_section );
    
    if (object.id === "emergency-announcement-container"){
      announceBubble.id = "emergency-announce-bubble";
      modify_button.className = "modify-button";
      delete_button.className = "delete-button";
      delete_button.id = item._id;
      modify_button.id = item._id;
      delete_button.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;
      modify_button.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i>`
      delete_button.style.display = display_mode;
      modify_button.style.display = display_mode;
      tool_section.appendChild( delete_button );
      tool_section.appendChild( modify_button );
      bubble_header.appendChild( tool_section );
      
    }
    announceBubble.appendChild( content );
    announceBubble.appendChild( timeSent );

    // Append the announce-bubble to the announcement-container
    object.appendChild( announceBubble );
  }
}

async function post_announcement_search(announcement_count, search_announcement_input) {
  console.log("inside post announcement search announcement count is " + announcement_count + " search input is " + search_announcement_input);
  const Jdata = {
     count: announcement_count, 
     searchval: search_announcement_input,
  }
  $.ajax( {
    type: 'POST',
    url: '/announcement_search',
    contentType: 'application/json;charset=UTF-8',
    data: JSON.stringify(Jdata),
    statusCode: {
      200: function ( data, t, jqXHR )
      {
        console.log( "THIS is inside success message:" + data.message );
        var announcements = data.announcements;
        console.log( "these are" + announcements[ 0 ] );
        if ( announcements.length === 0 )
        {
          alert( "No announcement found!" );
          return;
        }
        console.log( "should be visible here" );
        search_result_announcement.style.display = 'block';
        $( "#announcement-search-container" ).empty();
        appendAnnouncement( searchResultContainer,announcements );
      },
      error: function ()
      {
        console.error( 'error when receiving the data from the server.' );
      }
    }
  } );
}

