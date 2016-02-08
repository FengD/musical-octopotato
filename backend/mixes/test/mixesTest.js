/**
 * @author Marc Karassev
 */

var assert = require('assert'),
	async = require("async"),
	mixes = require("../mixes"),
	logger = require("../logger");

var Track = mixes.Track,
	Mix = mixes.Mix;

var track1 = new Track("daTrack", "daPath", 0, 1, 2, 3, 4, 5, 6, 7),
	track1Json = {
		name: "daTrack",
		trackPath: "daPath",
		gain: 0,
		balance: 1,
		highFilterLevel: 2,
		midFilterLevel: 3,
		lowFilterLevel: 4,
		highFilterFreq: 5,
		midFilterFreq: 6,
		lowFilterFreq: 7
	},
	track2 = new Track("daOtherTrack", "daOtherPath", 8, 9, 10, 11, 12, 13, 14, 15),
	track2Json = {
		name: "daOtherTrack",
		trackPath: "daOtherPath",
		gain: 8,
		balance: 9,
		highFilterLevel: 10,
		midFilterLevel: 11,
		lowFilterLevel: 12,
		highFilterFreq: 13,
		midFilterFreq: 14,
		lowFilterFreq: 15
	};

var superDate = new Date();

var superMix = new Mix("daSuperMix", "daSuperDJ", superDate, "/daPath", [track1, track2]),
	superMixJson = {
		title: "daSuperMix",
		author: "daSuperDJ",
		date: superDate,
		coverPath: "/daPath",
		tracks: [track1Json, track2Json]
	};

suite("mixes", function() {

	suiteSetup(function(done) {
		mixes.init(function() {
			done();
		});
	});

	suiteTeardown(function() {
		mixes.clean();
	});

	suite("Track class", function () {

		suite("#fromJSON()", function() {

			test("it should produce a track equal to track1", function() {
				assert.deepEqual(track1, Track.fromJSON(track1Json));
			});

			test("it should produce a track not equal to track1", function() {
				assert.notDeepEqual(track1, Track.fromJSON(track2));
			});

			test("it should throw an error", function() {
				var error = null;

				try {
					Track.fromJSON({
						trackPath: "daPath",
						gain: 0,
						balance: 1,
						highFilterLevel: 2,
						midFilterLevel: 3,
						lowFilterLevel: 4,
						highFilterFreq: 5
					});
				}
				catch(e) {
					error = e;
				}
				finally {
					assert(error.invalidJson);
				}
			});
		});

		suite("#toJSON()", function() {

			test("it should produce a JSON equal to track1Json", function () {
				assert.deepEqual(track1Json, Track.toJSON(track1));
			});

			test("it should produce a JSON not equal to track1Json", function () {
				assert.notDeepEqual(track1Json, Track.toJSON(track2));
			});

			test("it should throw an error", function() {
				var error = null;

				try {
					Track.toJSON(superMix);
				}
				catch(e) {
					error = e;
				}
				finally {
					assert(error.invalidTrack);
				}
			});
		});
	});

	suite("Mix class", function() {

		suite("#fromJSON()", function() {

			test("it should produce a mix equal to superMix", function() {
				assert.deepEqual(superMix, Mix.fromJSON(superMixJson));
			});

			test("it should produce a mix not equal to superMix", function() {
				assert.notDeepEqual(superMix, Mix.fromJSON({
					title: "daOtherSuperMix",
					author: "daSuperDJ",
					date: new Date(),
					coverPath: "/daOtherPath",
					tracks: [track1Json, track2Json]
				}));
			});

			test("it should throw an error", function() {
				var error = null;

				try {
					Mix.fromJSON({
						titlle: "daOtherSuperMix",
						author: "daSuperDJ",
						date: new Date(),
						coverPath: "/daOtherPath",
						tracks: [track1Json, track2Json]
					});
				}
				catch(e) {
					error = e;
				}
				finally {
					assert(error.invalidJson);
				}
			});
		});

		suite("#toJSON()", function() {

			test("it should produce a JSON equal to superMixJson", function () {
				assert.deepEqual(superMixJson, Mix.toJSON(superMix));
			});

			test("it should produce a JSON not equal to superMixJson", function () {
				assert.notDeepEqual(superMixJson, Mix.toJSON(new Mix("daOtherSuperMix",
					"daSuperDJ", [track1, track2])));
			});

			test("it should throw an error", function () {
				var error = null;

				try {
					Mix.toJSON(track1);
				}
				catch(e) {
					error = e;
				}
				finally {
					assert(error.invalidMix);
				}
			});
		});
	})

	suite("#create()", function() {

		test("should create SuperMix without error", function(done) {
			mixes.create(Mix.toJSON(superMix), function(err, result) {
				if (err) {
					logger.error(err);
					throw err;
				}
				assert.deepEqual(result, {
					ok: 1,
					n: 1
				});
				done();
			});
		});

		test("should send error when recreating SuperMix", function(done) {
			mixes.create(Mix.toJSON(superMix), function(err, result) {
				//assert.ifError(err);
				assert(err.duplicate);
				done();
			});
		});

		test("should send error when creating invalid mix", function(done) {
			mixes.create({ invalid: "invalid" }, function(err, result) {
				//assert.ifError(err);
				assert(err.invalidJson);
				done();
			});
		});
	});

	suite("#remove()", function() {

		test("should remove SuperMix without error", function(done) {
			mixes.remove(superMix.title, superMix.author, function(err, result) {
				if (err) {
					logger.error(err);
					throw err;
				}
				assert.deepEqual({
					ok: 1,
					n: 1
				}, result);
				done();
			});
		});

		test("should reremove SuperMix with error", function(done) {
			mixes.remove(superMix.title, superMix.author, function(err, result) {
				//assert.ifError(err);
				assert(err.nonexistentMix);
				done();
			});
		});
	});

	suite("#get()", function() {

		var mix1 = new Mix("mix1", "auth1", new Date(), "/path", [track1]),
		 	mix2 = new Mix("mix2", "auth1", new Date(), "/path", [track2]);
		var createdMixes = [superMix, mix1, mix2],
			auth1Mixes = [mix1, mix2];

		suiteSetup(function(done) {
			async.parallel([
				function(callback) {
					mixes.create(Mix.toJSON(superMix), function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					mixes.create(Mix.toJSON(mix1), function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					mixes.create(Mix.toJSON(mix2), function(err, result) {
						callback(err, result);
					});
				}
			], function(err, results) {
				assert.equal(null, err);
				done();
			});
		});
		
		suiteTeardown(function(done) {
			async.parallel([
				function(callback) {
					mixes.remove(superMix.title, superMix.author, function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					mixes.remove(mix1.title, mix1.author, function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					mixes.remove(mix2.title, mix2.author, function(err, result) {
						callback(err, result);
					});
				}
			], function(err, results) {
				assert.equal(null, err);
				done();
			});
		});

		test("should get all mixes", function(done) {
			mixes.get(null, null, function(err, data) {
				assert.equal(null, err);
				assert(data.length >= 3);
				for (var i = 0; i < createdMixes.length; i++) {
					assert(data.find(function(element, index, array) {
						return element.tilte === createdMixes[i].tilte
							&& element.author === createdMixes[i].author;
					}));
				}
				done();
			});
		});
		
		test("should get SuperMix", function(done) {
			mixes.get(superMix.title, superMix.author, function(err, data) {
				assert.equal(null, err);
				assert.equal(1, data.length);
				assert.deepEqual([superMix], data);
				done();
			});
		});
		
		test("should get all auth1 mixes", function(done) {
			mixes.get(null, "auth1", function(err, data) {
				assert.equal(null, err);
				assert(data.length >= 2);
				for (var i = 0; i < auth1Mixes.length; i++) {
					assert(data.find(function(element, index, array) {
						return element.tilte == auth1Mixes[i].tilte
							&& element.author == auth1Mixes[i].author;
					}));
				}
				done();
			});
		});
		
		test("should get an error with nonexistent mix", function(done) {
			mixes.get("nonexistentMix", "nonexistentAuthor", function(err, data) {
				//assert.ifError(err);
				assert(err.nonexistentMix);
				done();
			});
		});
	});

	suite("#replace()", function() {

		var mix1 = new Mix("mix1", "auth1", new Date(), "/path", [track1]),
		 	mix2 = new Mix("mix2", "auth1", new Date(), "/path", [track2]);
		var update = mix1, createdMixes = [superMix, mix1, mix2],
			auth1Mixes = [mix1, mix2];

		update.coverPath = "/updatedPath";

		suiteSetup(function(done) {
			async.parallel([
				function(callback) {
					mixes.create(Mix.toJSON(superMix), function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					mixes.create(Mix.toJSON(mix1), function(err, result) {
						callback(err, result);
					});
				}
			], function(err, results) {
				assert.equal(null, err);
				done();
			});
		});
		
		suiteTeardown(function(done) {
			async.parallel([
				function(callback) {
					mixes.remove(superMix.title, superMix.author, function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					mixes.remove(mix1.title, mix1.author, function(err, result) {
						callback(err, result);
					});
				}
			], function(err, results) {
				assert.equal(null, err);
				done();
			});
		});
		
		test("should replace mix1", function(done) {
			mixes.replace(Mix.toJSON(update), function(err, result) {
				assert.equal(null, err);
				assert.deepEqual(result,  {
					ok: 1,
					n: 1,
					nModified: 1
				});
				done();
			});
		});
		
		test("should get an error while replacing nonexistent mix", function(done) {
			mixes.replace(Mix.toJSON(mix2), function(err, result) {
				//assert.ifError(err);
				assert(err.nonexistentMix);
				done();
			});
		});
	});
});
