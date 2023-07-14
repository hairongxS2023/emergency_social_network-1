const token = Cookies.get('access_token');
const decodedToken = JSON.parse(atob(token.split('.')[1]));
const username = decodedToken.username.toLowerCase();
//import {set_offline} from './set_offline.js'

async function get_user_info(){
    $.ajax({
        url: "/user-profiles",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        statusCode:{
            200: function (data, t, jqXHR) {
                alert("Get user info success");
                console.log("get user info success", data);
            },
            400: function (data, t, jqXHR) {
                alert("Get user info failed with code 400");
                console.log("Bad request.", data);
            },
            500: function(data, t, jqXHR){
                alert("Get user info failed with code 500");
                console.log("Internal server error.", data);
            }
        },
        
    });
}

async function get_user_info_administrator(username){
    const Jdata ={
        username: username,
    }
    $.ajax({
        url: "/user-profiles/${username}",
        type: "GET",
        data: JSON.stringify(Jdata),
        contentType: "application/json; charset=utf-8",
        statusCode:{
            200: function (data, t, jqXHR) {
                alert("Get user info success");
                console.log("get user info success", data);
            },
            404: function (data, t, jqXHR) {
                alert("Get user info failed");
                console.log("Bad request.", data);
            },
            500: function(data, t, jqXHR){
                alert("Get user info failed");
                console.log("Internal server error.", data);
            }
        },
    });
}

async function change_account_status(username, account_status){
    const Jdata ={
        username: username,
        account_status: account_status,
    }
    $.ajax({
        url: "user-profiles/account-statuses",
        type: "PUT",
        data: JSON.stringify(Jdata),
        contentType: "application/json; charset=utf-8",
        statusCode:{
            200: function (data, t, jqXHR) {
                alert("Change account status success");
                console.log("change account status success", data);
            },
            400: function (data, t, jqXHR) {
                alert("Change account status failed");
                console.log("Bad request detected at administer.js ", data);
            },
            404: function(data, t, jqXHR){
                alert("Change account status failed");
                console.log("User not found at administer.js ", data);
            },
        },

    });
    window.reload();
}




async function change_username(username, new_username){
    const Jdata ={
        username: username,
        new_username: new_username,
    }
    $.ajax({
        url: "user-profiles/usernames",
        type: "PUT",
        data: JSON.stringify(Jdata),
        contentType: "application/json; charset=utf-8",
        statusCode:{
            200: function (data, t, jqXHR) {
                alert("Change username success");
                console.log("change username success", data);
            },
            400: function (data, t, jqXHR) {
                alert("Change username failed");
                console.log("Bad request detected at administer.js 22", data);
            },
            404: function(data, t, jqXHR){
                alert("Change username failed");
                console.log("User not found at administer.js 25", data);
            },
            422: function(data, t, jqXHR){
                alert("Change username failed");
                console.log("User not found at administer.js 28", data);
            }
        },

    });
    window.reload();
}

async function change_password(username, new_password){
    const Jdata ={
        username: username,
        new_password: new_password,
    }
    $.ajax({
        url: "user-profiles/passwords",
        type: "PUT",
        data: JSON.stringify(Jdata),
        contentType: "application/json; charset=utf-8",
        statusCode:{
            200: function (data, t, jqXHR) {
                alert("Change password success");
                console.log("change password success", data);
            },
            400: function (data, t, jqXHR) {
                alert("Change password failed");
                console.log("Bad request detected at administer.js 51", data);
            },
            404: function(data, t, jqXHR){
                alert("Change password failed");
                console.log("User not found at administer.js 54", data);
            },
            422: function(data, t, jqXHR){
                alert("Change password failed");
                console.log("User not found at administer.js 57", data);
            }
        },  
    });
}

async function change_privilege(username, privilege){
    const Jdata ={
        username: username,
        privilege: privilege,
    }
    $.ajax({
        url: "user-profiles/privilege-levels",
        type: "PUT",
        data: JSON.stringify(Jdata),
        contentType: "application/json; charset=utf-8",
        statusCode:{
            200: function (data, t, jqXHR) {
                alert("Change privilege success");
                window.reload();
                console.log("change privilege success", data);
            },
            400: function (data, t, jqXHR) {
                alert("Change privilege failed");
                console.log("Bad request detected at administer.js 89", data);
            },
            404: function(data, t, jqXHR){
                alert("Change privilege failed");
                console.log("User not found at administer.js 93", data);
            },
        },  
    });
}

socket.on( "emit-set-inactive", async ( data ) =>{
    await set_offline(username,data.username);
  });