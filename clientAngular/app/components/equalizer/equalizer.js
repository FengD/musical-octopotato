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
            gradient.addColorStop(1, '#000000');
            gradient.addColorStop(0.75, '#ff0000');
            gradient.addColorStop(0.25, '#ffff00');
            gradient.addColorStop(0, '#ffffff');

            return gradient
        }

        function clearCanvas(canvas) {
            var canvasContext = canvas.getContext('2d'),
                width = canvas.width,
                height = canvas.height;

            canvasContext.save();

            canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
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
            canvasCtx.strokeStyle = 'lightBlue';

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

            barWidth = width / bufferLength;

            heightScale = height / 256;

            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                canvasCtx.fillStyle = buildGradient(canvasCtx,height);//'rgb(' + (barHeight * 2 + 100) + ',50,50)';
                barHeight *= heightScale;
                canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }


            requestAnimationFrame(function () {
                visuFrequencyDomain(canvas, analyser)
            });

        }

        function buildGraph(sample, context, endNode, element, attrs) {

            var timeCanvasElt = element.find('canvas')[0];
            var freqCanvasElt = element.find('canvas')[0];
            var gainElt = element.find('input')[0];
            var lowFilterElt = element.find('input')[1];
            var midFilterElt = element.find('input')[2];
            var highFilterElt = element.find('input')[3];


            var noiseSourceNode = context.createBufferSource();
            noiseSourceNode.buffer = sample;

            var gainNode = context.createGain();
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
            };

            var midFilterNode = context.createBiquadFilter();
            midFilterNode.frequency.value = attrs.midFilterFreq;
            midFilterNode.type = "peaking";
            midFilterNode.gain.value = attrs.midFilterLevel;
            midFilterNode.Q.value = 2;
            midFilterElt.oninput = function (evt) {
                midFilterNode.gain.value = evt.target.value;
            };

            var highFilterNode = context.createBiquadFilter();
            highFilterNode.frequency.value = attrs.highFilterFreq;
            highFilterNode.type = "peaking";
            highFilterNode.gain.value = attrs.highFilterLevel;
            highFilterNode.Q.value = 5;
            highFilterElt.oninput = function (evt) {
                highFilterNode.gain.value = evt.target.value;
            };

            var analyserNode = context.createAnalyser();
            analyserNode.fftSize = 1024;


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


            console.log("in build graph, elem = " + sample);

            return noiseSourceNode;

        }

        function initTrack(params){
            if(!params.trackPath){
                return;
            }
            params.gain = params.gain || 0;
            params.balance = params.balance || 0;
            params.highFilterLevel = params.highFilterLevel || 0;
            params.midFilterLevel = params.midFilterLevel || 0;
            params.lowFilterLevel = params.lowFilterLevel || 0;
            params.highFilterFreq = params.highFilterFreq || 8000;
            params.midFilterFreq = params.midFilterFreq || 4000;
            params.lowFilterFreq = params.lowFilterFreq || 200;
        }

        var audiSource;

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


                console.log("###End equalizer link");

            }
        };
    });