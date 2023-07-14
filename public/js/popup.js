document.addEventListener("DOMContentLoaded", function(){
    const socket = io(getUrl());
    var span = document.querySelector(".close");
    const msgbox = document.getElementById("msgbox-content");
    var popupbox = document.getElementById("popupbox");
    const token = Cookies.get('access_token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const username = decodedToken.username.toLowerCase();
    var sender_list = [];
    console.log("username = ", username);

    $.ajax({
        url: `/notificationStatus`,
        type: "GET",
        statusCode: {
            200: function (data, t, jqXHR) {
                if(!data.sender_list){
                    console.log("no notification to display");
                    return;
                }
                sender_list = data.sender_list;
                sender_list.forEach(sender_name => {
                    appendSender(sender_name);
                });
                if (data.displayStatus) {
                    popupbox.style.display = "flex";
                }
            },
        },
        error: function (data, t, jqXHR) {
            console.log("cannot get display status");
        },
    });

    socket.on("push-notification", (data)=>{
        //data format {sender:"user1", receiver:"this.user"}
        if (data.receiver == username){
            if (!sender_list.includes(data.sender)){
                appendSender(data.sender);
            }
            popupbox.style.display = "flex";
        }
    })

    span.onclick = function () {
        popupbox.style.display = "none";
        $.ajax({
            url: '/receiver/notification',
            type: 'DELETE',
            success: function (data, t, jqXHR){
            console.log("successfully deleted notification for user, hide popup box")
            },
            error: function (data, t, jqXHR){
            console.log("Delete notification records failed");
            }
        })
    };


    function appendSender(sender_name){
        sender_list.push(sender_name);
        const sender = document.createElement("div");
        sender.classList.add("sender-name");
        sender.innerText = sender_name;
        msgbox.appendChild(sender);
    }
    function getUrl() {
          if (window.location.hostname === 'localhost') {
            return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
          } else {
            return 'https://s23esnb3.onrender.com';
          }
        }
        
});
