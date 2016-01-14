"use strict";

var mongoConnection = require("./mongo_connection"),
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
		callback(err, result);
	});
}

function get(uid) {
	var json = toJSON(new User(uid, undefined));

	return mongoConnection.getDatabase().collection(USERS_COLLECTION).find(json);
}

// Exports

exports.create = create;
exports.get = get;