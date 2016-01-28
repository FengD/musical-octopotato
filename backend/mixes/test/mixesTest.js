/**
 * @author Marc Karassev
 */

var assert = require('assert'),
	async = require("async"),
	mixes = require("../mixes"),
	logger = require("../logger");

var Track = mixes.Track,
	Mix = mixes.Mix;

var track1 = new Track("daPath", 0, 1, 2, 3, 4, 5, 6, 7),
	track1Json = {
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
	track2 = new Track("daOtherPath", 8, 9, 10, 11, 12, 13, 14, 15),
	track2Json = {
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

var superMix = new Mix("daSuperMix", "daSuperDJ", [track1, track2]),
	superMixJson = {
		title: "daSuperMix",
		author: "daSuperDJ",
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
					tracks: [track1Json, track2Json]
				}));
			});

			test("it should throw an error", function() {
				var error = null;

				try {
					Mix.fromJSON({
						titlle: "daOtherSuperMix",
						author: "daSuperDJ",
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
				assert.deepEqual(superMix,  {
					ok: 1,
					n: 1
				});
			});
			done();
		});

		test("should send error when recreating SuperMix", function(done) {
			mixes.create(Mix.toJSON(superMix), function(err, result) {
				assert.ifError(err);
				assert(err.duplicate);
			});
			done();
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
			});
			done();
		});

		test("should reremove SuperMix with error", function(done) {
			mixes.remove(superMix.title, superMix.author, function(err, result) {
				assert.ifError(err);
				assert(err.nonexistentMix);
			});
			done();
		});
	});

	suite("#get()", function() {
		// TODO
	});
});
