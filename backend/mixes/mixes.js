/**
 * @author Marc Karassev
 */

"use strict";

var mongoConnection = require("./mongo_connection"),
	logger = require("./logger"),
	MIXES_COLLECTION = "mixes";

class Track {

	constructor (name, trackPath, gain, balance, highFilterLevel, midFilterLevel,
		lowFilterLevel, highFilterFreq, midFilterFreq, lowFilterFreq) {
		this._name = name;
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

	get name() { return this._name; }
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
			&& json.midFilterFreq != undefined && json.lowFilterFreq != undefined
			&& json.name != undefined)) {
			var err = new Error("invalid json");

			err.invalidJson = true;
			throw err;
		}
		return new Track(json.name, json.trackPath, json.gain, json.balance,
			json.highFilterLevel, json.midFilterLevel, json.lowFilterLevel,
			json.highFilterFreq, json.midFilterFreq, json.lowFilterFreq);
	}

	static toJSON (track) {
		var json = {};

		if (track.trackPath != undefined) json.trackPath = track.trackPath;
		else {
			var err = new Error("invalid Track object");

			err.invalidTrack = true;
			throw err;
		}
		if (track.name != undefined) json.name = track.name;
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

	constructor (title, author, date, coverPath, tracks, plays, likes) {
		this._title = title;
		this._author = author;
		this._date = date;
		this._coverPath = coverPath;
		this._tracks = tracks;
		this._plays = plays;
		this._likes = likes;
	}

	get title() { return this._title; }
	set title(title) { this._title = title; }

	get author() { return this._author; }
	set author(author) { this._author = author; }

	get date() { return this._date; }
	set date(date) { this._date = date; }

	get coverPath() { return this._coverPath; }
	set coverPath(coverPath) { this._coverPath = coverPath; }

	get tracks() { return this._tracks; }
	set tracks(tracks) { this._tracks = tracks; }

	get plays() { return this._plays; }
	set plays(plays) { this._plays = plays; }

	get likes() { return this._likes; }
	set likes(likes) { this._likes = likes; }

	static fromJSON (json) {
		if (!(json.title && json.author && json.date && json.coverPath && json.tracks
			&& Array.isArray(json.tracks) && json.plays != undefined
			&& json.likes != undefined)) {
			var err = new Error("invalid json");

			err.invalidJson = true;
			throw err;
		}
		return new Mix(json.title, json.author, json.date, json.coverPath,
			json.tracks.map(Track.fromJSON), json.plays, json.likes);
	}

	static toJSON (mix) {
		var json = {};

		if (mix.title != undefined && mix.author != undefined) {
			json.title = mix.title;
			json.author = mix.author;
		}
		else {
			var error = new Error("invalid Mix object");

			error.invalidMix = true;
			throw error;
		}
		if (mix.date) json.date = mix.date;
		if (mix.coverPath) json.coverPath = mix.coverPath;
		if (mix.tracks != undefined) {
			json.tracks = [];
			for (var i = 0; i < mix.tracks.length; i++) {
				json.tracks.push(Track.toJSON(mix.tracks[i]));
			}
		}
		if (mix.plays != undefined) json.plays = mix.plays;
		if (mix.likes != undefined) json.likes = mix.likes;
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

function remove(title, author, callback) {
	mongoConnection.getDatabase().collection(MIXES_COLLECTION).deleteOne({
		title: title,
		author: author
	}, null, function(err, result) {
		if (err) {
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

function replace(data, callback) {
	try {
		var mix = Mix.fromJSON(data);

		mongoConnection.getDatabase().collection(MIXES_COLLECTION).replaceOne({
			title: mix.title,
			author: mix.author
		}, Mix.toJSON(mix), null, function (error, result) {
			if (error) {
				logger.warn(error);
				callback(error, null);
			}
			else {
				if (result.result.n == 0) {
					error = new Error("nonexistent mix");
					error.nonexistentMix = true;
					callback(error, null);
				}
				else callback(null, result.result);
			}
		});
	}
	catch(err) {
		logger.warn(err);
		callback(err, null);
	}
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

function clean(callback) {
	mongoConnection.disconnect(function (err, result) {
		callback(err, result);
	});
}

// Exports

exports.Track = Track;
exports.Mix = Mix;
exports.create = create;
exports.get = get;
exports.remove = remove;
exports.replace = replace;
exports.init = init;
exports.clean = clean;