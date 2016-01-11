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
	if (uid == undefined) {
		return getAll();
	}
	else {
		return getByUid(uid);
	}
}

function getAll() {
	return mongoConnection.getDatabase().collection(USERS_COLLECTION).find();
}

function getByUid(uid) {
	return mongoConnection.getDatabase().collection(USERS_COLLECTION).find({ uid: uid });
}

// Exports

exports.create = create;
exports.get = get;