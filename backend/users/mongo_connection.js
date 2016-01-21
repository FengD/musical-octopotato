/**
 * @author Marc Karassev
 */

var MongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	ObjectId = require('mongodb').ObjectID,
	logger = require("./logger"),
	url = 'mongodb://localhost:27017/musical-octopotato',
	database = null;

function connect(callback) {
	MongoClient.connect(url, function(err, db) {
	    if (err) {
	    	logger.error(err);
	    }
	    else {
	      	logger.info("Connected to mongodb.");
	      	database = db;
	  	  	callback();
	    }
	});
}

function disconnect() {
  database.close();
  logger.info("Closed connection to mongodb.");
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