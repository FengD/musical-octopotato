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
					assert(error);
				}
			});
		});

		suite("#toJSON()", function() {
			// TODO
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
					assert(error);
				}
			});
		});

		suite("#toJSON()", function() {
			// TODO
		});
	})

	suite("#create()", function() {
		// TODO
	});

	suite("#remove()", function() {
		// TODO
	});

	suite("#get()", function() {
		// TODO
	});
});
