// Get references to the UI elements
const audioElement = document.querySelector('audio');

const balanceSlider = document.getElementById('balanceSlider');
const volumeSlider = document.getElementById('volumeSlider');

const playPauseButton = document.getElementById('playPauseButton');
const leftSpeaker = document.getElementById('leftSpeaker');
const rightSpeaker = document.getElementById('rightSpeaker');

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const track = audioCtx.createMediaElementSource(audioElement);
const panner = audioCtx.createStereoPanner();
track.connect(panner).connect(audioCtx.destination);

// Event listeners
balanceSlider.addEventListener('input', function () {
    panner.pan.value = this.value;
});

volumeSlider.addEventListener('input', function () {
    audioElement.volume = this.value;
});

leftSpeaker.addEventListener('click', function () {
    setBalance(-1);
});

rightSpeaker.addEventListener('click', function () {
    setBalance(1);
});

playPauseButton.addEventListener('click', function () {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (audioElement.paused) {
        audioElement.play();
    } else {
        audioElement.pause();
    }
});

// Set the initial values
panner.pan.value = balanceSlider.value;
audioElement.volume = volumeSlider.value;


// Helper
function setBalance(value) {
    panner.pan.value = value;
    balanceSlider.value = value;
}