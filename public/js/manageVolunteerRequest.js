//import {set_offline} from './set_offline.js';


$( document ).ready( function ()
{

    const socket = io( getUrl() );
    const token = getCookie( "access_token" );
    var tokens = token.split( "." );
    const decodedToken = JSON.parse( atob( tokens[ 1 ] ) );
    const user = decodedToken.username;
    console.log( "username:", user );

    // Click event for the "Fulfill this request" button
    $( '.fulfill-btn' ).click( function ()
    {
        // Get the request ID and username from the button's attributes
        var postID = $( this ).attr( 'id' );
        console.log("this is clicked postID: ", postID);
        $.ajax( {
            // Logout
            url: `/requests-fulfillment/${postID}`,
            type: "PUT",
            data:{},
            statusCode: {
                200: function ( data, t, jqXHR )
                {
                    console.log( "received fulfilled." );
                    $( '#fulfill' + postID ).text( 'Fulfilled: True' );
                    $('#'+postID).hide();
                    
                },
                400: function ( data, t, jqXHR ){
                    console.log( "id not found fulfilled." );
                    return;
                }
            },
            error: function ( data, t, jqXHR )
            {
                console.log( "Error when fulfilling" );
            },
        } );
        // TODO: Implement request fulfillment logic here

        // Display a success message
    } );

    $( '.apr-btn' ).click( function (){
        var postID = $( this ).attr( 'id' );
        const volunteer = $( this ).attr( 'name' );
        console.log("this is clicked postID: ", postID);
        const Jdata = {
            "postID": postID,
            "volunteer": volunteer
        }
        $.ajax( {
            // Logout
            url: `/volunteer-requests-update`,
            type: "PUT",
            data: JSON.stringify( Jdata ),
            contentType: "application/json; charset=utf-8",
            success: function ( data, t, jqXHR )
            {
                $( '.request-volunteers' ).append( '<div>'+volunteer+'</div>' );
                $( '.request-volunteers' ).append( '<br/>' );
                console.log( "received fulfilled." );
                delete_request();
            },
            error: function ( data, t, jqXHR )
            {
                console.log( "Error when updating" );
            },
        } );
    });

    $( '.deny-btn' ).click( function ()
    {
        var postID = $( this ).attr( 'id' );
        const volunteer = $( this ).attr( 'name' );
        console.log( "this is clicked postID: ", postID );
        const Jdata = {
            "postID": postID,
            "volunteer": volunteer
        }
        delete_request(postID, volunteer);
    } );
    // Click event for the "back to volunteer request page" button
    $( '#back-btn' ).click( function ()
    {

        window.location.href = '/volunteer-requests';
    } );
} );

function delete_request(id, volunteer){
    const Jdata = {
        "postID": id,
        "volunteer": volunteer
    }
    $.ajax( {
        // Logout
        url: `/volunteer-requests-deletion`,
        type: "PUT",
        data: JSON.stringify( Jdata ),
        contentType: "application/json; charset=utf-8",
        success: function ( data, t, jqXHR )
        {
            $( "#bubble" + postID ).remove();
            console.log( "join request deleted." );

            },
            error: function ( data, t, jqXHR )
            {
                console.log( "Error when deleting join request" );
            },
        } );
}
    // Click event for the "back to volunteer request page" button
    $( '#back-btn' ).click( function ()
    {

        window.location.href = '/volunteer-requests';
    } );

    socket.on( "emit-set-inactive", async ( data ) =>{
        await set_offline(user, data.username);

      });


function getUrl() {
    if (window.location.hostname === 'localhost') {
      return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    } else {
      return 'https://s23esnb3.onrender.com';
    }
  }


