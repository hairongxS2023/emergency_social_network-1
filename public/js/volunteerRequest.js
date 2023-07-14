
//import {set_offline} from './set_offline.js';

const back_btn = document.querySelector( "#back" );
const manage_btn = document.querySelector( "#manage-btn" );
const post_btn = document.querySelector( "#post-btn" );
const join_btn = document.getElementsByClassName( "join-btn" );

const socket = io( getUrl() );
const token = Cookies.get( 'access_token' );
const decodedToken = JSON.parse( atob( token.split( '.' )[ 1 ] ) );
const username = decodedToken.username.toLowerCase();
let clicked = false;
//cur_user.innerHTML = `Username: ${ username }`;


function closePopup ()
{
    var popup = document.getElementById( "my-popup" );
    popup.style.display = "none";
}

if ( back_btn )
{
    back_btn.addEventListener( "click", () =>
    {
        console.log( "back" );
        window.location.href = `/ESN_directory_page`;
    } );
}

if ( manage_btn )
{
    manage_btn.addEventListener( "click", ( event ) =>
    {
        $.ajax( {
            // Chat
            url: `/volunteer-requests-management/${username}`,
            type: "GET",
            success: function ( data, t, jqXHR )
            {
                console.log( "manage" );
                window.location.href = `/volunteer-requests-management/${username}`;
            },
            error: function ( data, t, jqXHR )
            {
                console.log( "Error when redirecting" );
            },
        } );
    } );
}

if ( post_btn )
{
    post_btn.addEventListener( "click", ( event ) =>
    {   
    


        // Otherwise, set clicked state to true and disable the button
        //$( this ).prop( 'disabled', true );
        // Wait for 1 minute (60000 milliseconds)
        
        $.ajax( {
            // Chat
            url: `/volunteer-request-posts`,
            type: "GET",
            success: function ( data, t, jqXHR )
            {
                window.location.href = `./volunteer-request-posts`;
            },
            error: function ( data, t, jqXHR )
            {
                console.log( "Error when redirecting" );
            },
        } );
    } );
}




$( document ).on( 'click', '.join-btn', function ()
{
    var id = $( this ).attr( 'id' );
    console.log( 'Button with ID ' + id + ' was clicked' );
    const requestUser = $( this ).attr( 'name' ).toLowerCase();
    if ( requestUser === username )
    {
        $( '#popup-message' ).text( 'You cannot join as a volunteer on your own post.' );
        $( '#popup' ).fadeIn();
        return;
    }
    else{
        window.location.href = `/volunteer-join-requests/${ id }`;
    }
    // Perform additional logic here

} );

$('#close-button').click( function ()
{
    console.log( "close button clicked" );
    $( '#popup' ).fadeOut();
} );

socket.on( "emit-set-inactive", async ( data ) =>{
    console.log( "emit-set-inactive to",data.username );
    await set_offline(username, data.username );
  });







