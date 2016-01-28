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
			var err = new Error("invalid Track object");

			err.invalidTrack = true;
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
		var json = {};

		if (mix.title != undefined) json.title = mix.title;
		else {
			var error = new Error("invalid Mix object");

			error.invalidMix = true;
			throw error;
		}
		if (mix.author != undefined) json.author = mix.author;
		if (mix.tracks != undefined) {
			json.tracks = [];
			for (var i = 0; i < mix.tracks.length; i++) {
				json.tracks.push(Track.toJSON(mix.tracks[i]));
			}
		}
		return json;
	}
}

function create(data, callback) {
	try {
		var mix = Mix.fromJSON(data);

		mongoConnection.getDatabase().collection(MIXES_COLLECTION).find({
			author: mix.author,
			title: mix.title
		}).toArray(function (err, documents) {
			if (err) {
				logger.warn(err);
				callback(err, documents)
			}
			else if (documents.length != 0) {
				err = new Error("duplicate mix for author " + mix.author);
				err.duplicate = true;
				callback(err, null);
			}
			else {
				mongoConnection.getDatabase().collection(MIXES_COLLECTION).insertOne(Mix.toJSON(mix),
					function(err, result) {
					if (err) {
						logger.warn(err);
						if (err.code == 11000)
							err.duplicate = true;
						callback(err, null);
					}
					else {
						callback(null, result.result);
					}
				});
			}
		});
	}
	catch(err) {
		logger.warn(err);
		callback(err, null);
	}
}

function get(title, author, callback) {
	var json = {};

	if (title) json.title = title;
	if (author) json.author = author;
	mongoConnection.getDatabase().collection(MIXES_COLLECTION).find(json)
		.toArray(function(err, documents) {
		if (err) {
			logger.warn(err);
			callback(err, documents);
		}
		else {
			if (documents.length === 0 && title && author) {
				err = new Error("nonexistent mix");
				err.nonexistentMix = true;
				callback(err, null);
			}
			else {
				documents = documents.map(function(element) {
					return Mix.fromJSON(element);
				});
				callback(err, documents);
			}
		}
	});
}

function remove(tilte, author, callback) {
	mongoConnection.getDatabase().collection(MIXES_COLLECTION).deleteOne({
		title: tilte,
		author: author
	}, null, function(err, result) {
		if (err) {
			logger.warn(err);
			callback(err, result);
		}
		else {
			result = JSON.parse(result);
			if (result.n == 0) {
				err = new Error("nonexistent mix");
				err.nonexistentMix = true;
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