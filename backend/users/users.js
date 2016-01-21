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
	return new User(json.uid, json.pwd);
}

function toJSON(user) {
	var json = {};

	if (user.uid) json.uid = user.uid;
	if (user.pwd) json.pwd = user.pwd;
	return json;
}

function create(data, callback) {
	var user = fromJSON(data);

	mongoConnection.getDatabase().collection(USERS_COLLECTION).insertOne({
		_id: user.uid,
		uid: user.uid,
		pwd: user.pwd
	}, function(err, result) {
		if (err) {
			logger.warn(err);
			err = "could not persist user";
		}
		else {
			result = user;
		}
		callback(err, result);
	});
}

function get(callback, uid) {
	var json = toJSON(new User(uid, undefined));

	mongoConnection.getDatabase().collection(USERS_COLLECTION).find(json)
		.toArray(function(err, documents) {
		if (err) {
			logger.warn(err);
			err = "unable to retrieve users";
		}
		documents = documents.map(function(element) {
			return fromJSON(element);
		});
		callback(err, documents);
	});
}

function remove(uid, callback) {
	mongoConnection.getDatabase().collection(USERS_COLLECTION).deleteOne({
		_id: uid
	}, null, function(err, result) {
		if (err) {
			logger.warn(err);
			err = "unable to remove user";
		}
		callback(err, result);
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