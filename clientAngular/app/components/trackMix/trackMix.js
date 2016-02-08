angular.module('octopotato')
    .directive('trackMix', function(){

        var bufferLoader,
            childElements = [],
            mixTracksURLs = [],
            buffers = [],
            ctx = window.AudioContext || window.webkitAudioContext,
            audioContext= new ctx(),
            nbEqualizer,
            trackVolumeNodes=[],
            samples = [],
            startedAt, timePlayed = 15000,
            outputNodes = [],
            isPlaying = false;

        function buildOutputNode(context, element){
            outputNodes.push(context.destination);

            var mainGainElt = element.find('input')[0];
            var mainGainNode = context.createGain();
            mainGainElt.oninput = function(evt){
                mainGainNode.gain.value = evt.target.value;
            };

            var compressorNode = context.createDynamicsCompressor();
            compressorNode.connect(outputNodes[0]);
            outputNodes.unshift(compressorNode);

            mainGainNode.connect(outputNodes[0]);
            outputNodes.unshift(mainGainNode);
        }

        function loadSong(songURL, element) {
            bufferLoader = new BufferLoader(audioContext,[songURL],
                function(buffersResult){
                    buffers = buffers.concat(buffersResult);

                    buffersResult.forEach(function(sample, i) {
                        var newSample = element.buildAudioGraph(sample);
                        samples = samples.concat(newSample);

                        if (isPlaying) {
                            var currentPlayingTime = timePlayed +  Date.now() - startedAt;
                            newSample.start(0, currentPlayingTime/1000);
                        }
                    });

                });


            bufferLoader.load();
        }


        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            templateUrl: "./components/trackMix/trackMix.html",
            controller: function($scope){

                this.isAlreadyRunning = function() {
                    return songIsAlreadyRunning;
                };

                this.getOutputNode = function() {
                    return outputNodes[0];
                };

                this.addTrackURL = function(url, element){
                    mixTracksURLs.push(url);
                    childElements.push(element);

                    loadSong(url, element);
                };

                this.getAudioContext = function(){
                    return audioContext;
                };

                this.getTracksURLs = function(){
                    return mixTracksURLs;
                };

                this.getSamples = function () {
                    return samples;
                }
            },

            link: function (scope, element, attrs, ctrl) {

                buildOutputNode(audioContext, element);

                var playButton = element.find("button")[0];
                var pauseButton = element.find("button")[1];
                var stopButton = element.find("button")[2];
                var saveButton = element.find("button")[3];

                playButton.onclick = function(){
                    buffers.forEach(function(sample, i) {
                        samples[i] = childElements[i].buildAudioGraph(sample);
                    });
                    isPlaying = true;
                    startedAt = Date.now();
                    samples.forEach(function(s) {
                        s.start(0, timePlayed/1000);
                    });
                    playButton.disabled=true;
                    pauseButton.disabled=false;
                };

                pauseButton.onclick = function(){
                    var pausedAt = Date.now();
                    timePlayed += pausedAt-startedAt;
                    console.log("Played : " + timePlayed);

                    isPlaying = false;
                    samples.forEach(function(s) {
                        s.stop();
                    });
                    playButton.disabled=false;
                    pauseButton.disabled=true;
                };

                stopButton.onclick = function(){
                    timePlayed = 0;

                    isPlaying = false;
                    samples.forEach(function(s) {
                        s.stop();
                    });
                    playButton.disabled=false;
                    pauseButton.disabled=true;
                };

                saveButton.onclick = function() {
                    console.log(scope);
                    //save scope.track
                }

            }
        };

    });