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
	    	callback(err)
	    }
	    else {
	      	logger.info("Connected to mongodb.");
	      	database = db;
	  	  	callback(null);
	    }
	});
}

function disconnect(callback) {
  	database.close(false, function (err, result) {
  		if (err) {
  			logger.warn(err);
  		}
  		else {
		  	logger.info("Closed connection to mongodb.");
  		}
  		callback(err, result);
  	});
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