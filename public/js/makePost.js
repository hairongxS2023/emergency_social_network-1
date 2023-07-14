//import {set_offline} from './set_offline.js';

$( document ).ready( function ()
{
    const socket = io( getUrl() );
    const token = getCookie( "access_token" );
    var tokens = token.split( "." );
    const decodedToken = JSON.parse( atob( tokens[ 1 ] ) );
    const username = decodedToken.username;
    console.log( "username:", username );

    $( 'button[type="submit"]' ).click( function ( e )
    {
        e.preventDefault();
        var requestType = $( '#request-type' ).val();
        var requestDetails = $( '#request-details' ).val();
        var volunteersNeeded = $( '#volunteers-needed' ).val();

        if ( requestType === "" || requestDetails === "" || volunteersNeeded === "" )
        {
            $( "#popup-message" ).text( "Please fill out all fields." );
            $( "#popup" ).fadeIn();
            return;
        }
        console.log( "SUBMIT BUTTON CLICKED" );

        const Jdata = {
            user: username,
            type: requestType,
            details: requestDetails,
            volunteers_needed: volunteersNeeded,
            volunteers_joined: [],
            fulfilled: false
            //status: find user status in ESN directory, using username
        };

        $.ajax( {
            url: '/request-submissions',
            type: 'POST',
            data: JSON.stringify( Jdata ),
            contentType: "application/json; charset=utf-8",
            statusCode: {
                200: function ( data )
                {
                    console.log( "Request sent success, this is nested ajax", data );
                    $.ajax( {
                        // Chat
                        url: `/volunteer-requests`,
                        type: "GET",
                        success: function ( data, t, jqXHR )
                        {
                            window.location.href = `./volunteer-requests`;
                        },
                        error: function ( data, t, jqXHR )
                        {
                            console.log( "Error when redirecting" );
                        },
                    } );
                },
                400: function ( data ){
                    console.log("filled out all fields");
                    return;
                },
                429: function ( data ){
                    $( "#popup-message" ).text( "You have already submitted a request in minute." );
                    $( "#popup" ).fadeIn();
                }
            },
            error: function ( xhr, status, error )
            {
                // Handerwerle error
            }
        } );
    } );

    $( "#cancel-button" ).click( function ()
    {
        window.location.href = `/volunteer-requests`;
    } );

    $( '#close-button' ).click( function ()
    {
        console.log( "close button clicked" );
        $( '#popup' ).fadeOut();
    } );




} );

socket.on( "emit-set-inactive",async ( data ) =>{
    await set_offline( username, data.username );
  });
