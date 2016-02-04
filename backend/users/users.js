/**
 * @author Marc Karassev
 */

"use strict";

var mongoConnection = require("./mongo_connection"),
	logger = require("./logger"),
	USERS_COLLECTION = "users";

class User {

	constructor (uid, pwd) {
		this._uid = uid;
		this._pwd = pwd;
	}

	get uid() { return this._uid; }
	get pwd() { return this._pwd; }
}

function fromJSON(json) {
	if (!(json.uid && json.pwd)) {
		var err = new Error("invalid json");

		err.invalidJson = true;
		throw err;
	}
	return new User(json.uid, json.pwd);
}

function toJSON(user) {
	var json = {};

	if (user.uid) json.uid = user.uid;
	if (user.pwd) json.pwd = user.pwd;
	return json;
}

function create(data, callback) {
	try {
		var user = fromJSON(data);
		mongoConnection.getDatabase().collection(USERS_COLLECTION).insertOne({
			_id: user.uid,
			uid: user.uid,
			pwd: user.pwd
		}, function(err, result) {
			if (err) {
				logger.warn(err);
				if (err.code == 11000)
					err.duplicate = true;
			}
			else {
				result = user;
			}
			callback(err, result);
		});
	}
	catch(err) {
		logger.warn(err);
		callback(err, null);
	}
}

function get(uid, pwd, callback) {
	var json = toJSON(new User(uid, pwd));

	mongoConnection.getDatabase().collection(USERS_COLLECTION).find(json)
		.toArray(function(err, documents) {
		if (err) {
			logger.warn(err);
			callback(err, documents);
		}
		else {
			if (documents.length === 0 && (uid || pwd)) {
				err = new Error("nonexistent user");
				err.nonexistentUser = true;
				callback(err, null);
			}
			else {
				documents = documents.map(function(element) {
					return fromJSON(element);
				});
				callback(err, documents);
			}
		}
	});
}

function remove(uid, callback) {
	mongoConnection.getDatabase().collection(USERS_COLLECTION).deleteOne({
		_id: uid
	}, null, function(err, result) {
		if (err) {
			logger.warn(err);
			callback(err, result);
		}
		else {
			result = JSON.parse(result);
			if (result.n == 0) {
				err = new Error("nonexistent user");
				err.nonexistentUser = true;
				callback(err, null);
			}
			else callback(err, result);
		}
	});
}

function init(callback) {
	mongoConnection.connect(function(err) {
		if (err) {
			logger.warn(err);
		}
		else {
			logger.info("users initialized");
		}
		callback(err);
	});
}

function clean() {
	mongoConnection.disconnect();
}

// Exports

exports.User = User;
exports.toJSON = toJSON;
exports.fromJSON = fromJSON;
exports.create = create;
exports.get = get;
exports.remove = remove;
exports.init = init;
exports.clean = clean;