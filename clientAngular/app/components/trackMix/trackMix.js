angular.module('octopotato')
    .directive('trackMix', function($timeout){

        var bufferLoader,
            childElements = [],
            mixTracksURLs = [],
            buffers,
            ctx = window.AudioContext || window.webkitAudioContext,
            audioContext= new ctx(),
            nbEqualizer,
            trackVolumeNodes=[],
            samples = [],
            startedAt, timePlayed = 10000,
            outputNodes = [];

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
        };


        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            templateUrl: "./components/trackMix/trackMix.html",
            controller: function($scope){

                this.mute


                this.getOutputNode = function() {
                    return outputNodes[0];
                };

                this.addTrackURL = function(url, element){
                    mixTracksURLs.push(url);
                    childElements.push(element);
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

                $timeout( function(){
                    nbEqualizer = element.find("equalizer").length;
                    bufferLoader = new BufferLoader(ctrl.getAudioContext(),ctrl.getTracksURLs(),
                        function(buffersResult){
                            buffers = buffersResult;

                            buffers.forEach(function(sample, i) {
                                samples[i] = childElements[i].buildAudioGraph(sample);
                            });

                            samples.forEach(function(s) {
                               // s.start(0);
                            });


                            //
                            //buildGraph(buffers, audioContext, function(){
                            //        samples.forEach(function(s) {
                            //            s.start(0);
                            //        });
                            //    });
                    });


                    bufferLoader.load();
                },0);


                var playButton = element.find("button")[0];
                var pauseButton = element.find("button")[1];
                var stopButton = element.find("button")[2];

                playButton.onclick = function(){
                    buffers.forEach(function(sample, i) {
                        samples[i] = childElements[i].buildAudioGraph(sample);
                    });
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
                    samples.forEach(function(s) {
                        s.stop();
                    });
                    playButton.disabled=false;
                    pauseButton.disabled=true;
                };
                stopButton.onclick = function(){
                    timePlayed = 0;
                    samples.forEach(function(s) {
                        s.stop();
                    });
                    playButton.disabled=false;
                    pauseButton.disabled=true;
                };




                console.log("###End trackMix link");
            }
        };

    });