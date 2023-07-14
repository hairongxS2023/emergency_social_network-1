//import {set_offline} from './set_offline.js'

const socket = io( getUrl() );
const token = Cookies.get( 'access_token' );
const decodedToken = JSON.parse( atob( token.split( '.' )[ 1 ] ) );
const username = decodedToken.username.toLowerCase();
var requestor = $( '#submit-btn' ).attr( 'name' ); 
console.log( "reuqestor is: " + requestor );
//cur_user.innerHTML = `Username: ${ username }`;
$( document ).ready( function ()
{
    // Click event handler for submit button
    $( "#submit-btn" ).click( function ( event )
    {
        // Prevent default form submission behavior
        event.preventDefault();
        const joinReason = $( '#join-reason' ).val();
        
        if ( joinReason == "" )
        {
            $( '#popup-message' ).text( 'Please enter a reason for wanting to help.' );
            $( '#popup' ).fadeIn();
            return;
        } 

        const id = $( ".request-id" ).text().trim().split( "#" )[ 1 ];
        const Jdata = {
            username: username,
            postID: id,
            requestor: requestor,
            reason: joinReason,

        };
        // Show popup with success message
        $.ajax( {
            // Chat
            url: `/volunteer-join-requests`,
            type: "POST",
            data: JSON.stringify( Jdata ),
            contentType: "application/json; charset=utf-8",
            statusCode: {
                201:function ( data, t, jqXHR )
                {
                    window.location.href = `/volunteer-requests`;
                    
                },
                429: function ( data ){
                    $( "#popup-message" ).text( "You have already submitted a request in hour." );
                    $( "#popup" ).fadeIn();
                }
            },
            error: function ( data, t, jqXHR )
            {
                console.log( "Error when redirecting" );
            },
        } );
        $( "#popup-message" ).text( "Your request to volunteer has been submitted successfully." );
        $( "#popup" ).show();
    } );

    // Click event handler for cancel button
    $( "#cancel-button" ).click( function ()
    {
        console.log("clicked");
        window.location.href = `/volunteer-requests`;
    } );

    // Click event handler for close button in popup
    $( "#close-button" ).click( function ()
    {
        // Hide popup
        $( "#popup" ).hide();
    } );
} );

socket.on( "emit-set-inactive",async ( data ) =>{
    await set_offline(username,data.username);
    console.log("set offline");
  });


  function getUrl() {
    if (window.location.hostname === 'localhost') {
      return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    } else {
      return 'https://s23esnb3.onrender.com';
    }
  }
