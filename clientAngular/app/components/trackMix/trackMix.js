angular.module('octopotato')
    .directive('trackMix', function ($rootScope, $location, mixService) {

        var bufferLoader,
            childElements = [],
            mixTracksURLs = [],
            buffers = [],
            ctx = window.AudioContext || window.webkitAudioContext,
            audioContext = new ctx(),
            nbEqualizer,
            trackVolumeNodes = [],
            samples = [],
            startedAt, timePlayed = 0,
            outputNodes = [],
            isPlaying = false;

        function buildOutputNode(context, element) {
            outputNodes.push(context.destination);

            var mainGainElt = element.find('input')[0];
            var mainGainNode = context.createGain();
            mainGainElt.oninput = function (evt) {
                mainGainNode.gain.value = evt.target.value;
            };

            var compressorNode = context.createDynamicsCompressor();
            compressorNode.connect(outputNodes[0]);
            outputNodes.unshift(compressorNode);

            mainGainNode.connect(outputNodes[0]);
            outputNodes.unshift(mainGainNode);
        }

        function loadSong(songURL, element) {
            bufferLoader = new BufferLoader(audioContext, [songURL],
                function (buffersResult) {
                    buffers = buffers.concat(buffersResult);

                    buffersResult.forEach(function (sample, i) {
                        var newSample = element.buildAudioGraph(sample);
                        samples = samples.concat(newSample);

                        if (isPlaying) {
                            var currentPlayingTime = timePlayed + Date.now() - startedAt;
                            newSample.start(0, currentPlayingTime / 1000);
                        } else if (timePlayed == 0){
                            startedAt = Date.now();
                            newSample.start(0)
                        }
                    });

                });
            bufferLoader.load();
        }

        function playAll() {

            buffers.forEach(function (sample, i) {
                samples[i] = childElements[i].buildAudioGraph(sample);
            });
            isPlaying = true;
            startedAt = Date.now();
            samples.forEach(function (s) {
                s.start(0, timePlayed / 1000);
            });
            playButton.disabled = true;
            pauseButton.disabled = false;
            stopButton.disabled = false;
        }

        function pauseAll() {
            var pausedAt = Date.now();
            timePlayed += pausedAt - startedAt;
            console.log("Played : " + timePlayed);

            isPlaying = false;
            samples.forEach(function (s) {
                s.stop();
            });
            playButton.disabled = false;
            pauseButton.disabled = true;
            stopButton.disabled = false;
        }

        function stopAll() {
            timePlayed = 0;

            isPlaying = false;
            samples.forEach(function (s) {
                s.stop();
            });
            playButton.disabled = false;
            pauseButton.disabled = true;
            stopButton.disabled = true;
        }


        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            templateUrl: "./components/trackMix/trackMix.html",
            controller: function ($scope) {

                this.isAlreadyRunning = function () {
                    return songIsAlreadyRunning;
                };

                this.getOutputNode = function () {
                    return outputNodes[0];
                };

                this.addTrackURL = function (url, element) {
                    mixTracksURLs.push(url);
                    childElements.push(element);
                    $scope.start();
                    loadSong(url, element);
                    $scope.complete();
                };

                this.toggleMuteOthers = function (elt) {
                    childElements.forEach(function (child) {
                        if (child != elt) {
                            child.mute();
                        } else {
                            child.unMute();
                        }
                    })
                };

                this.getAudioContext = function () {
                    return audioContext;
                };

                this.getTracksURLs = function () {
                    return mixTracksURLs;
                };

                this.getSamples = function () {
                    return samples;
                };

                $scope.$on('$locationChangeStart', function (event) {
                    if (isPlaying ) {
                        stopAll();
                    }
                });
            },

            link: function (scope, element, attrs, ctrl) {

                buildOutputNode(audioContext, element);

                var playButton = element.find("button")[0];
                var pauseButton = element.find("button")[1];
                var stopButton = element.find("button")[2];
                var saveButton = element.find("button")[3];
                var delButton = element.find("button")[4];
                var remixButton = element.find("button")[5];

                playButton.onclick = playAll;

                pauseButton.onclick = pauseAll;

                stopButton.onclick = stopAll;

                saveButton.onclick = function () {
                    scope.start();

                    mixService.updateMix(JSON.stringify(scope.track)).then(
                        function () {
                            scope.complete();
                        }, function (err) {
                            console.error(err);
                            scope.start();
                        });
                };

                delButton.onclick = function () {
                    scope.start();

                    mixService.deleteMix(scope.track.author, scope.track.title).then(
                        function () {
                            $location.path('/mixes');
                            scope.complete();
                        }, function (err) {
                            console.error(err);
                            alert(JSON.stringify(err));
                            scope.complete();
                        });
                };

                remixButton.onclick = function () {
                    var mix = scope.track;
                    scope.start();
                    mix.author = scope.nickname;
                    mixService.postMix(mix).then(
                        function (res) {
                            $location.path('/mixes/' + mix.author + '/' + mix.title);
                        }, function (err) {
                            console.error(err);
                            alert(JSON.stringify(err));
                        }
                    );
                };
            }

        };

    });