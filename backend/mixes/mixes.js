/**
 * @author Marc Karassev
 */

"use strict";

var mongoConnection = require("./mongo_connection"),
	logger = require("./logger"),
	MIXES_COLLECTION = "mixes";

class Mix {
	// TODO
}

function fromJSON(json) {
	// TODO
}

function toJSON(user) {
	// TODO
}

function create(data, callback) {
	// TODO
}

function get(callback, uid) {
	// TODO
}

function remove(uid, callback) {
	// TODO
}

function init(callback) {
	mongoConnection.connect(function(err) {
		if (err) {
			logger.warn(err);
		}
		else {
			logger.info("mixes initialized");
		}
		callback(err);
	});
}

function clean() {
	mongoConnection.disconnect();
}

// Exports

exports.Mix = Mix;
exports.toJSON = toJSON;
exports.fromJSON = fromJSON;
exports.create = create;
exports.get = get;
exports.remove = remove;
exports.init = init;
exports.clean = clean;