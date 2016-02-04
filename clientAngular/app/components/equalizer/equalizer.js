angular.module('octopotato')
    .directive('equalizer', function(){

        function visualize(canvas, analyser) {
            clearCanvas(canvas);
            drawVolumeMeter(canvas, analyser);

            // call again the visualize function at 60 frames/s
            requestAnimationFrame(function() {
                visualize(canvas, analyser)
            });
        }

        function drawVolumeMeter(canvas, analyser){
            var canvasCtx = canvas.getContext('2d'),
                bufferLength = analyser.frequencyBinCount,
                dataArray = new Uint8Array(bufferLength),
                average,
                height = canvas.height;

            canvasCtx.save();
            analyser.getByteFrequencyData(dataArray);

            average = getAverageVolume(dataArray);

            canvasCtx.fillStyle = buildGradient(canvasCtx, height);

            canvasCtx.fillRect(0,height-average, 25, height);

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
            var gradient = canvasCtx.createLinearGradient(0,0,0, height);
            gradient.addColorStop(1,'#000000');
            gradient.addColorStop(0.75,'#ff0000');
            gradient.addColorStop(0.25,'#ffff00');
            gradient.addColorStop(0,'#ffffff');

            return gradient
        }

        function clearCanvas(canvas) {
            var canvasContext = canvas.getContext('2d'),
                width = canvas.width,
                height = canvas.height;

            canvasContext.save();

            // clear the canvas
            // like this: canvasContext.clearRect(0, 0, width, height);

            // Or use rgba fill to give a slight blur effect
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
                x=0;

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

            requestAnimationFrame(function(){visuTimeDomain(canvas, analyser )})

        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: './components/equalizer/equalizer.html',
            link: function(scope, element, attrs){
                var ctx = window.AudioContext || window.webkitAudioContext;
                var audioContext = new ctx();
                var timeCanvas = element.find('canvas')[0];
                var audioSource = element.find('audio')[0];
                console.log(timeCanvas);
                console.log(audioSource);
                var noiseSourceNode = audioContext.createMediaElementSource(audioSource);
                var analyser = audioContext.createAnalyser();

                analyser.fftSize = 1024;

                noiseSourceNode.connect(analyser);
                analyser.connect(audioContext.destination);
                console.log(noiseSourceNode);


                requestAnimationFrame(function() {
                    visualize(timeCanvas, analyser)
                });

                requestAnimationFrame(function () {
                    visuTimeDomain(timeCanvas, analyser )
                });
            }
        };
    });