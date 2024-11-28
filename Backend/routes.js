//Author: Nnamdi Nwanze
//Description: This routes module creates custom routes and demonstrates the use of routes using the database manager module

var express = require('express');
var router = express.Router();
//use database manager module
var mydb = require('./dbmgr.js');

//use the url module
const url = require('url');

//test variables
var a = 0;
var b = 0;

//Setup database, only need to run this once. Unblock to run once then block this line again
//mydb.setup();


//Demo / route to print hello
router.get('/', function (req, res) {
    res.send("Hello a is " + a + ", b  is " + b);
});

//Demo / route to print hello
router.post('/username', function (req, res) {
    //console.log(req.body);
    //res.send("Hello a is " + a + ", b  is " + b);
    const username = req.body.username;

    if (!username) {
        res.status(400).send("Username is required");
        return;
    }

    // Verificar si el usuario ya existe en la base de datos
    mydb.findRec({ username: username }, function (result) {
        if (result) {
            res.status(409).send("Username already exists");
        } else {
            // Si no existe, insertar el nombre de usuario
            mydb.insertRec({ username: username }, function () {
                res.status(201).send("Username added successfully");
            })
        }
    });
    // res.send("Username is " + username);
});

//Demo / route to print hello
router.get('/username', function (req, res) {
    let myURL = url.parse(req.url, true);
    console.log(myURL);
    res.send("Hello we're using a get");
});

router.get('/player1', function (req, res) {
    const username = req.query.username;
    const roundStatus = req.query.roundStatus;
    const walletAmount = parseInt(req.query.walletAmount, 10);

    if (!username || !roundStatus || isNaN(walletAmount)) {
        res.status(400).send("Missing required parameters: username, roundStatus, or walletAmount");
        return;
    }

    // Lleva el registro del número de rondas jugadas
    let roundsPlayed = parseInt(req.query.roundsPlayed, 10) || 0;

    if (roundStatus === "gameover") {
        // Verificar si el usuario existe en la base de datos
        mydb.findRec({ username: username }, function (existingUser) {
            if (!existingUser) {
                // Si no existe, agregarlo con los datos iniciales
                const newUser = { username: username, score: roundsPlayed };
                mydb.insertRec(newUser, function () {
                    res.status(201).send("New user added and score recorded");
                });
            } else {
                existingUser.score= (existingUser.score === undefined ? 0 : existingUser.score);
                // console.log(existingUser.score);
                // Si existe, verificar si la nueva puntuación es mejor
                if (roundsPlayed > existingUser.score) {
                    mydb.updateData(
                        { username: username },
                        { score: roundsPlayed },
                        function () {
                            res.status(200).send("Score updated with better score");
                        }
                    );
                } else {
                    res.status(200).send("Game over, but score not improved");
                }
            }
        });
    } else {
        // Continuar con la partida
        res.status(200).send("Round in progress for Player 1");
    }
});

router.get('/player2', function (req, res) {
    const username = req.query.username;
    const roundStatus = req.query.roundStatus;
    const walletAmount = parseInt(req.query.walletAmount, 10);

    if (!username || !roundStatus || isNaN(walletAmount)) {
        res.status(400).send("Missing required parameters: username, roundStatus, or walletAmount");
        return;
    }

    // Lleva el registro del número de rondas jugadas
    let roundsPlayed = parseInt(req.query.roundsPlayed, 10) || 0;

    if (roundStatus === "gameover") {
        // Verificar si el usuario existe en la base de datos
        mydb.findRec({ username: username }, function (existingUser) {
            if (!existingUser) {
                // Si no existe, agregarlo con los datos iniciales
                const newUser = { username: username, score: roundsPlayed };
                mydb.insertRec(newUser, function () {
                    res.status(201).send("New user added and score recorded for Player 2");
                });
            } else {
                // Si existe, verificar si la nueva puntuación es mejor
                existingUser.score= (existingUser.score === undefined ? 0 : existingUser.score);
                if (roundsPlayed > existingUser.score) {
                    mydb.updateData(
                        { username: username },
                        { score: roundsPlayed },
                        function () {
                            res.status(200).send("Score updated with better score for Player 2");
                        }
                    );
                } else {
                    res.status(200).send("Game over for Player 2, but score not improved");
                }
            }
        });
    } else {
        // Continuar con la partida
        res.status(200).send("Round in progress for Player 2");
    }
});

router.get('/highscores', function (req, res) {
    mydb.findAll(0, function (results) {
        if (!results || results.length === 0) {
            res.status(404).send("No high scores found");
        } else {
            // Ordenar los resultados por la puntuación en orden descendente
            const sortedResults = results.sort((a, b) => b.score - a.score);
            res.status(200).json(sortedResults);
        }
    });
});

//Demo /p1 route to insert record into the database
router.get('/p1', function (req, res) {
    a++;
    mydb.insertRec({username: 'Player1', 'score': a});
    res.send("Hello Player1! Inserting score b: " + b);
});
//Demo /p2 route to insert a different record into the database
router.get('/p2', function (req, res) {
    b++;
    mydb.insertRec({username: 'Player2', 'score': b});
    res.send("Hello Player2! Inserting score a: " + a);
});
//Demo /p3 route to find a record in the database
router.get('/p3', function (req, res) {
    mydb.findRec();
    res.send("Finding 1 record");
});
//Demo /p route to find all records in the database
router.get('/p4', function (req, res) {
    mydb.findAll(0);
    res.send("Finding all records");
});
//Demo /p5 route to update record the database
router.get('/p5', function (req, res) {
    queryData = {username: 'Player1'};
    upData = {'score': 100};
    mydb.updateData(queryData, upData);
    res.send("Updating " + JSON.stringify(queryData) + " score to " + JSON.stringify(upData));
});
//Demo /p6 route to delete collection in the database
router.get('/p6', function (req, res) {
    mydb.deleteCollection();
    res.send("Deleted Collection");
});

module.exports = router;