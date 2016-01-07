var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/musical-octopotato';
var database;

function connect(callback) {
	MongoClient.connect(url, function(err, db) {
    if (err) {
      callback(err);  
    }
    else {
      console.log("Connected correctly to server.");
      database = db;
  	  callback(null);
    }
	});
}

function disconnect() {
  database.close();
}

// exports

exports.connect = connect;
exports.disconnect = disconnect;