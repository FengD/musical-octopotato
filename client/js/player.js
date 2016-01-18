(function(){

    var doc = document.currentScript.ownerDocument;

    var PlayerProto = Object.create(HTMLElement.prototype, {
        audioElt : {
            value:null,
            writable: true
        },
        isPlaying:{
            value : false,
            writable: true
        },
        playPause: {
            value: function() {
                var player = this;
                player.isPlaying ? player.audioElt.pause() : player.audioElt.play();
                player.isPlaying = !player.isPlaying;

            }
        },
        createdCallback: {
            value: function() {
                var player = this;

                var shadow = player.createShadowRoot();

                var buttonElt = document.createElement('button');
                buttonElt.innerHTML = "Oh, press me !";
                buttonElt.onclick = function(){player.playPause()};
                shadow.appendChild(buttonElt);

                var audioElt = document.createElement('audio');
                audioElt.src = this.getAttribute("src");
                audioElt.crossOrigin = "anonymous";

                player.audioElt = audioElt;

                shadow.appendChild(audioElt);

                var sliderElt = document.createElement('input');
                sliderElt.type = 'range';
                sliderElt.min = "0";
                sliderElt.max="3";
                sliderElt.step="0.01";
                sliderElt.value="1";

                shadow.appendChild(sliderElt);

                var ctx = window.AudioContext || window.webkitAudioContext;

                var audioContext,
                    noiseSource, noiseSourceNode,
                    gainSlider, gainSliderNode;

                audioContext = new ctx();
                noiseSource = audioElt;

                noiseSourceNode = audioContext.createMediaElementSource(noiseSource);

                gainSliderNode = audioContext.createGain();
                noiseSourceNode.connect(gainSliderNode);

                gainSliderNode.connect(audioContext.destination);

                sliderElt.oninput = function (evt) {
                    gainSliderNode.gain.value = evt.target.value;
                };
            }
        }
    });

    document.registerElement('player-component', {
        prototype: PlayerProto
    });
})();