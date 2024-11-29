//Author: Nnamdi Nwanze
//Description: This demo app demonstrates the use of modules, routes and database operations using the Express.js framework

var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const app = express();
const port = 3000;
var http = require('http').Server(app);
const io = require("socket.io")(http, {cors: {origin: "*", methods: ["GET", "POST"]}});

//Get access to request body for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Apply CORS to allow cross origin access
app.use(cors());

//use routes modue for /
app.use('/', routes);

// var users = 0;
io.on('connection', function (socket) {

    socket.on('player1', function (data) {
        console.log(data);
        io.sockets.emit('player1', data);
    });

    //increment number of users
    // users++;
    // //broadcast number of users when users connect
    // io.sockets.emit('broadcast', {description: users + ' users are here!'});
    // //listen for and broadcast clicks
    // socket.on('clicks', function(clicks){
    //     console.log("clicked "+clicks+" times");
    //     io.sockets.emit('clicked', {data: clicks});
    // });
    // //broadcast number of users when users disconnect
    // socket.on('disconnect', function () {
    //     users--;
    //     io.sockets.emit('broadcast', {description: users + ' users  are here!'});
    // });
});
http.listen(3000, function () {
    console.log('listening on http://127.0.0.1:3000');
});