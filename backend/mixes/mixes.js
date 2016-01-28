/**
 * @author Marc Karassev
 */

"use strict";

var mongoConnection = require("./mongo_connection"),
	logger = require("./logger"),
	MIXES_COLLECTION = "mixes";

class Track {

	constructor (trackPath, gain, balance, highFilterLevel, midFilterLevel,
		lowFilterLevel, highFilterFreq, midFilterFreq, lowFilterFreq) {
		this._trackPath = trackPath;
		this._gain = gain;
		this._balance = balance;
		this._highFilterLevel = highFilterLevel;
		this._midFilterLevel = midFilterLevel;
		this._lowFilterLevel = lowFilterLevel;
		this._highFilterFreq = highFilterFreq;
		this._midFilterFreq = midFilterFreq;
		this._lowFilterFreq = lowFilterFreq; 
	}

	get trackPath() { return this._trackPath; }
	get gain() { return this._gain; }
	get balance() { return this._balance; }
	get highFilterLevel() { return this._highFilterLevel; }
	get midFilterLevel() { return this._midFilterLevel; }
	get lowFilterLevel() { return this._lowFilterLevel; }
	get highFilterFreq() { return this._highFilterFreq; }
	get midFilterFreq() { return this._midFilterFreq; }
	get lowFilterFreq() { return this._lowFilterFreq; }

	static fromJSON (json) {
		if (!(json.trackPath && json.gain != undefined && json.balance != undefined
			&& json.highFilterLevel != undefined && json.midFilterLevel != undefined
			&& json.lowFilterLevel != undefined && json.highFilterFreq != undefined
			&& json.midFilterFreq != undefined && json.lowFilterFreq != undefined)) {
			var err = new Error("invalid json");

			err.invalidJson = true;
			throw err;
		}
		return new Track(json.trackPath, json.gain, json.balance, json.highFilterLevel,
			json.midFilterLevel, json.lowFilterLevel, json.highFilterFreq,
			json.midFilterFreq, json.lowFilterFreq);
	}

	static toJSON (track) {
		var json = {};

		if (track.trackPath != undefined) json.trackPath = track.trackPath;
		else {
			var err = new Error("not a valid track object");

			err.notValidTrack = true;
			throw err;
		}
		if (track.gain != undefined) json.gain = track.gain;
		if (track.balance != undefined) json.balance = track.balance;
		if (track.highFilterLevel != undefined) json.highFilterLevel = track.highFilterLevel;
		if (track.midFilterLevel != undefined) json.midFilterLevel = track.midFilterLevel;
		if (track.lowFilterLevel != undefined) json.lowFilterLevel = track.lowFilterLevel;
		if (track.highFilterFreq != undefined) json.highFilterFreq = track.highFilterFreq;
		if (track.midFilterFreq != undefined) json.midFilterFreq = track.midFilterFreq;
		if (track.lowFilterFreq != undefined) json.lowFilterFreq = track.lowFilterFreq;
		return json;
	}

}

class Mix {

	constructor (title, author, tracks) {
		this._tilte = title;
		this._author = author;
		this._tracks = tracks;
	}

	get title() { return this._tilte; }
	get author() { return this._author; }
	get tracks() { return this._tracks; }

	static fromJSON (json) {
		if (!(json.title && json.author && json.tracks
			&& Array.isArray(json.tracks))) {
			var err = new Error("invalid json");

			err.invalidJson = true;
			throw err;
		}
		return new Mix(json.title, json.author, json.tracks.map(Track.fromJSON));
	}

	static toJSON (mix) {
		// TODO
	}
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

exports.Track = Track;
exports.Mix = Mix;
exports.create = create;
exports.get = get;
exports.remove = remove;
exports.init = init;
exports.clean = clean;