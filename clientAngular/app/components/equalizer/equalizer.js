angular.module('octopotato')
    .directive('equalizer', function ($http) {


        function visualize(canvas, analyser) {
            clearCanvas(canvas);
            drawVolumeMeter(canvas, analyser);

            // call again the visualize function at 60 frames/s
            requestAnimationFrame(function () {
                visualize(canvas, analyser)
            });
        }

        function drawVolumeMeter(canvas, analyser) {
            var canvasCtx = canvas.getContext('2d'),
                bufferLength = analyser.frequencyBinCount,
                dataArray = new Uint8Array(bufferLength),
                average,
                height = canvas.height;

            canvasCtx.save();
            analyser.getByteFrequencyData(dataArray);

            average = getAverageVolume(dataArray);

            canvasCtx.fillStyle = buildGradient(canvasCtx, height);

            canvasCtx.fillRect(0, height - average, 25, height);

            canvasCtx.restore();
        }

        function getAverageVolume(array) {
            var values = 0,
                average,
                length = array.length;

            // get all the frequency amplitudes
            for (var i = 0; i < length; i++) {
                values += array[i];
            }

            average = values / length;
            return average;
        }

        function buildGradient(canvasCtx, height) {
            var gradient = canvasCtx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(1, '#2980b9');  //black
            gradient.addColorStop(0.75, '#2BC0E4'); //red
            gradient.addColorStop(0.25, '#ffff00');  //yellow
            gradient.addColorStop(0, '#EAECC6');  //white

            return gradient
        }

        function clearCanvas(canvas) {
            var canvasContext = canvas.getContext('2d'),
                width = canvas.width,
                height = canvas.height;

            canvasContext.save();

            canvasContext.fillStyle = 'rgba(212,218,217, 0.3)';
            canvasContext.fillRect(0, 0, width, height);

            canvasContext.restore();
        }

        function visuTimeDomain(canvas, analyser) {
            var width = canvas.width,
                height = canvas.height,
                canvasCtx = canvas.getContext('2d'),
                bufferLength = analyser.frequencyBinCount,
                dataArray = new Uint8Array(bufferLength),
                sliceWidth = width / bufferLength,
                x = 0;

            clearCanvas(canvas);

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = '#2980b9';

            canvasCtx.beginPath();

            for (var i = 0; i < bufferLength; ++i) {
                var val = dataArray[i] / 255;
                var y = val * height;
                if (i == 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            canvasCtx.lineTo(width, height / 2);

            canvasCtx.stroke();

            requestAnimationFrame(function () {
                visuTimeDomain(canvas, analyser)
            })

        }

        function visuFrequencyDomain(canvas, analyser) {
            var width = canvas.width,
                height = canvas.height,
                canvasCtx = canvas.getContext("2d"),
                bufferLength = analyser.frequencyBinCount,
                dataArray = new Uint8Array(bufferLength),
                barWidth = width / bufferLength,
                barHeight, heightScale,
                x = 0;


            clearCanvas(canvas);

            analyser.getByteFrequencyData(dataArray);

            barWidth = 10 * width / bufferLength;

            heightScale = height / 256;

            for (var i = 0; i < bufferLength / 10; i++) {
                barHeight = dataArray[i];

                canvasCtx.fillStyle = buildGradient(canvasCtx, height);//'rgb(' + (barHeight * 2 + 100) + ',50,50)';
                barHeight *= heightScale;
                canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }


            requestAnimationFrame(function () {
                visuFrequencyDomain(canvas, analyser)
            });

        }

        function buildGraph(sample, context, endNode, element, attrs) {

            var oldGainValue, isMute;

            var timeCanvasElt = element.find('canvas')[0];
            var freqCanvasElt = element.find('canvas')[0];
            var gainElt = element.find('input')[0];
            var lowFilterElt = element.find('input')[1];
            var midFilterElt = element.find('input')[2];
            var highFilterElt = element.find('input')[3];
            var muteButton = element.find('button')[1];


            var noiseSourceNode = context.createBufferSource();
            noiseSourceNode.buffer = sample;

            var gainNode = context.createGain();
            gainNode.gain.value = attrs.gain;
            gainElt.oninput = function (evt) {
                gainNode.gain.value = evt.target.value;
                attrs.gain = evt.target.value;
            };

            var lowFilterNode = context.createBiquadFilter();
            lowFilterNode.frequency.value = attrs.lowFilterFreq;
            lowFilterNode.type = "peaking";
            lowFilterNode.gain.value = attrs.lowFilterLevel;
            lowFilterNode.Q.value = 0.05;
            lowFilterElt.oninput = function (evt) {
                lowFilterNode.gain.value = evt.target.value;
                attrs.lowFilterLevel = evt.target.value;
            };

            var midFilterNode = context.createBiquadFilter();
            midFilterNode.frequency.value = attrs.midFilterFreq;
            midFilterNode.type = "peaking";
            midFilterNode.gain.value = attrs.midFilterLevel;
            midFilterNode.Q.value = 2;
            midFilterElt.oninput = function (evt) {
                midFilterNode.gain.value = evt.target.value;
                attrs.midFilterLevel = evt.target.value;
            };

            var highFilterNode = context.createBiquadFilter();
            highFilterNode.frequency.value = attrs.highFilterFreq;
            highFilterNode.type = "peaking";
            highFilterNode.gain.value = attrs.highFilterLevel;
            highFilterNode.Q.value = 5;
            highFilterElt.oninput = function (evt) {
                highFilterNode.gain.value = evt.target.value;
                attrs.highFilterLevel = evt.target.value;
            };

            var analyserNode = context.createAnalyser();
            analyserNode.fftSize = 1024;

            element.toggleMute = function () {

                var newValue;
                if (isMute) {
                    element.unMute();
                } else {
                    element.mute();
                }

                isMute = !isMute;
                gainNode.gain.value = newValue;
                attrs.gain = newValue;
            };

            element.mute = function () {
                if (!isMute) {
                    oldGainValue = attrs.gain;
                    gainNode.gain.value = 0;
                    attrs.gain = 0;
                    isMute = true;
                }
            };

            element.unMute = function () {
                if (isMute) {
                    gainNode.gain.value = oldGainValue;
                    attrs.gain = oldGainValue;
                    isMute = false;
                }
            };

            muteButton.onclick = element.toggleMute;


            noiseSourceNode.connect(gainNode);
            gainNode.connect(lowFilterNode);
            lowFilterNode.connect(midFilterNode);
            midFilterNode.connect(highFilterNode);
            highFilterNode.connect(analyserNode);
            analyserNode.connect(endNode);

            requestAnimationFrame(function () {
                visuTimeDomain(timeCanvasElt, analyserNode)
            });

            requestAnimationFrame(function () {
                visuFrequencyDomain(freqCanvasElt, analyserNode)
            });

            return noiseSourceNode;

        }

        function initTrack(track) {
            if (!track.trackPath) {
                return;
            }
            track.gain = track.gain || 1;
            track.balance = track.balance || 0;
            track.highFilterLevel = track.highFilterLevel || 0;
            track.midFilterLevel = track.midFilterLevel || 0;
            track.lowFilterLevel = track.lowFilterLevel || 0;
            track.highFilterFreq = track.highFilterFreq || 8000;
            track.midFilterFreq = track.midFilterFreq || 4000;
            track.lowFilterFreq = track.lowFilterFreq || 200;
        }

        return {
            restrict: 'EA',
            replace: false,
            templateUrl: './components/equalizer/equalizer.html',
            require: '^trackMix',
            scope: true,
            link: function (scope, element, attrs, trackMixController) {

                initTrack(scope.truc);

                trackMixController.addTrackURL(scope.truc.trackPath, element);

                var audioContext = trackMixController.getAudioContext();

                var endNode = trackMixController.getOutputNode();

                element.buildAudioGraph = function (sample) {
                    return buildGraph(sample, audioContext, endNode, element, scope.truc);
                };

                element.isMute = false;

                var soloButton = element.find('button')[0];
                soloButton.onclick = function () {
                    trackMixController.toggleMuteOthers(element);
                };

                var delButton = element.find('button')[2];

                delButton.onclick = function () {
                    scope.start();

                    for (var i = 0; i < scope.track.tracks.length; ++i) {
                        if (scope.track.tracks[i] == scope.truc) {
                            scope.track.tracks.splice(i, 1);
                        }
                    }
                    scope.complete();
                };
            }
        };
    });