//Author: Nnamdi Nwanze
//Description: This demo app demonstrates the use of modules, routes and database operations using the Express.js framework

var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const app = express();
const port = 3000;

//Get access to request body for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Apply CORS to allow cross origin access
app.use(cors());

//use routes modue for /
app.use('/', routes);

//Listen for connections on port 3000
app.listen(port, () => console.log("Server running on port: "+port));
