/////////////////////////////////////////////////////////////////////////////////
//Author: Nnamdi Nwanze
//Purpose: Demonstrate bidirectional sockets
/////////////////////////////////////////////////////////////////////////////////
//mySocket.js
var myURL = "http://127.0.0.1:3000";
// let username = "User" + Math.floor(Math.random() * 1000);
// showUsername(username);

//connect to socket
var socket = io(myURL, {secure: true});
// $.ajax({
//     url: myURL,
//     type: 'GET',
//     success: function (data) {
//         socket.emit('emit_from_here');
//     }
// });
//show number of players
// socket.on('broadcast', function (data) {
// 	showNumberOfPlayers(data.description);
// });
//show button was clicked
socket.on('player2', function (data) {
    const dealerCards = document.getElementById("dealer-cards2");
    const playerCards = document.getElementById("player-cards2");
    dealerCards.innerHTML = data.dealerCards;
    playerCards.innerHTML = data.playerCards;
});

