var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/musical-octopotato';
var database = null;

function connect(callback) {
	MongoClient.connect(url, function(err, db) {
	    if (err) {
	    	console.log(err);
	    }
	    else {
	      	console.log("Connected to mongodb.");
	      	database = db;
	  	  	callback();
	    }
	});
}

function disconnect() {
  database.close();
  console.log("Closed connection to mongodb.");
}

function getDatabase() {
	if (database == null) {
		connect(function() {
			return database;
		});
	}
	else {
		return database;
	}
}

// Exports

exports.connect = connect;
exports.disconnect = disconnect;
exports.getDatabase = getDatabase;