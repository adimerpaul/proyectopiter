//Author: Nnamdi Nwanze
//Description: This database manager demonstrates the use of database operations including creating/deleting collections and inserting, searching and updating entries.
const config = require('./config.json');

const mycollection = config.mycollection;
const myDB = config.myDB;
var myMongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://"+config.username+":" + config.pwd +"@cluster0.yjzs4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


//set up the database
exports.setup = function () {
    let cbackfunc;
    testConnection(cbackfunc);
    createMyCollection(cbackfunc);
};
//create the database
let testConnection = function (callbackFn) {
    console.log("Attempting connection to database...");
    myMongoClient.connect(url)
    .then(db => {
        console.log("Connected to database!");
        db.close();
    })
    .catch(function (err) {
        throw err;
    })
};

//creates collection
let createMyCollection = function (callbackFn) {
    if (!myDB) {
        console.log("ERROR: Collection undefind. Fix myDB in config file");
        return;
    }
    myMongoClient.connect(url)
    .then(db => {
      var dbo = db.db(myDB);
      dbo.createCollection(mycollection)
      .then(()=>{
        console.log("Collection created!");
        db.close();
      })
    })
    .catch(function (err) {
        throw err;
    })
};

//inserts a record of myobj into the database
exports.insertRec = function (myobj, callbackFn) {
  myMongoClient.connect(url)
  .then(db => {
      var dbo = db.db(myDB);
      dbo.collection(mycollection).insertOne(myobj)
      .then(() => {
          console.log("1 document inserted");
          db.close();
          if (callbackFn) callbackFn();
      })
      .catch(err => {
          console.error("Error inserting record:", err);
          db.close();
          if (callbackFn) callbackFn(err);
      });
  })
  .catch(err => {
      console.error("Database connection error:", err);
      if (callbackFn) callbackFn(err);
  });
};

//finds a single record with information contained in data
exports.findRec = function (data, callbackFn) {
  myMongoClient.connect(url)
  .then(db => {
      const dbo = db.db(myDB);
      dbo.collection(mycollection).findOne(data)
      .then(result => {
          console.log("Record found:", result);
          db.close();
          callbackFn(result); // Devuelve el resultado al callback
      })
      .catch(err => {
          console.error("Error finding record:", err);
          db.close();
          callbackFn(null); // Devuelve null si no encuentra nada
      });
  })
  .catch(err => {
      console.error("Database connection error:", err);
      callbackFn(null);
  });
};

//finds all records using a limit (if limit is 0 all records are returned)
exports.findAll = function (limit, callbackFn) {
  myMongoClient.connect(url)
  .then(db => { 
      const dbo = db.db(myDB);
      const query = {};
      dbo.collection(mycollection).find(query).limit(limit || 0).toArray()
      .then(results => {
          console.log("Records found:", results);
          db.close();
          callbackFn(results); // Devuelve los resultados al callback
      })
      .catch(err => {
          console.error("Error finding records:", err);
          db.close();
          callbackFn([]);
      });
  })
  .catch(err => {
      console.error("Database connection error:", err);
      callbackFn([]);
  });
};

//deletes a collection
exports.deleteCollection = function (callbackFn) {
    myMongoClient.connect(url)
    .then(db => { 
      var dbo = db.db(myDB);
      dbo.collection(mycollection).drop()
      .then(isDeleted=>{
        if (isDeleted)
            console.log("Collection deleted");
        db.close();
      })
    })
    .catch(function (err) {
        throw err;
    })
};

//updates queryData's data in the database to newdata
exports.updateData = function (queryData, newdata, callbackFn) {
  myMongoClient.connect(url)
  .then(db => {
      const dbo = db.db(myDB);
      dbo.collection(mycollection).updateOne(queryData, { $set: newdata })
      .then(() => {
          console.log("1 document updated");
          db.close();
          if (callbackFn) callbackFn();
      })
      .catch(err => {
          console.error("Error updating record:", err);
          db.close();
          if (callbackFn) callbackFn(err);
      });
  })
  .catch(err => {
      console.error("Database connection error:", err);
      if (callbackFn) callbackFn(err);
  });
};

