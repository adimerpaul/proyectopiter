//Author: Nnamdi Nwanze
//Description: This demo app demonstrates the use of modules, routes and database operations using the Express.js framework

var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const app = express();
const port = 3000;
var http = require('http').Server(app);
const io = require("socket.io")(http, {cors: {origin: "*", methods: ["GET", "POST"]}});

const config = require('./config.json');
const mydb = require("./dbmgr");
const mycollection = config.mycollection;
const myDB = config.myDB;
var myMongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://"+config.username+":" + config.pwd +"@cluster0.yjzs4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";



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
        // console.log(data);
        // mydb.findRec({ username: 'player1' }, function (result) {
        //     data.score = result.score;
            io.sockets.emit('player1', data);
        // });
    });
    socket.on('player2', function (data) {
        // mydb.findRec({ username: 'player2' }, function (result) {
        //     data.score = result.score;
            io.sockets.emit('player2', data);
        // });
    });
});
http.listen(3000, function () {
    console.log('listening on http://127.0.0.1:3000');
});