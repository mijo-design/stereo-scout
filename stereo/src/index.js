// Additional variables for features
let autoModeInterval; // Interval for automatic balance movement
let autoDirection = 1; // 1 = right, -1 = left
const autoModeSpeed = 18; // Speed for automatic balance movement, in milliseconds
const autoModeStep = 0.01; // Step for automatic balance movement
const transitionSpeed = 10; // Speed for smooth balance transition, lower value = faster
const i18n = {
    en: {
        start: 'Start',
        stop: 'Stop',
    }
}
const defaultLang = 'en';

// Get references to the UI elements
const audioElement = document.querySelector('audio');

const balanceSlider = document.getElementById('balanceSlider');
const volumeSlider = document.getElementById('volumeSlider');

const playPauseButton = document.getElementById('playPauseButton');
const leftSpeaker = document.getElementById('leftSpeaker');
const rightSpeaker = document.getElementById('rightSpeaker');

const autoModeCheckbox = document.getElementById('autoModeCheckbox');

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const track = audioCtx.createMediaElementSource(audioElement);
const panner = audioCtx.createStereoPanner();
track.connect(panner).connect(audioCtx.destination);

balanceSlider.addEventListener('input', function () {
    panner.pan.value = this.value;
    autoModeCheckbox.checked = false;
    stopAutoMode()
});

volumeSlider.addEventListener('input', function () {
    audioElement.volume = this.value;
});

leftSpeaker.addEventListener('click', function () {
    smoothTransition(-1);
    autoModeCheckbox.checked = false;
    stopAutoMode()
});

rightSpeaker.addEventListener('click', function () {
    smoothTransition(1);
    autoModeCheckbox.checked = false;
    stopAutoMode()
});

function smoothTransition(targetValue) {
    let currentValue = parseFloat(balanceSlider.value);
    if (currentValue === targetValue) return;

    let step = (targetValue - currentValue) / transitionSpeed;

    function transition() {
        currentValue += step;
        if ((step > 0 && currentValue >= targetValue) || (step < 0 && currentValue <= targetValue)) {
            setBalance(targetValue);
            return;
        }
        setBalance(currentValue);
        requestAnimationFrame(transition);
    }

    transition();
}

playPauseButton.addEventListener('click', function () {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (audioElement.paused) {
        audioElement.play();
        playPauseButton.textContent = i18n[defaultLang].stop;
        if (autoModeCheckbox.checked) {
            startAutoMode();
        }
    } else {
        audioElement.pause();
        playPauseButton.textContent = i18n[defaultLang].start;
        stopAutoMode();
    }
});

// Auto Mode feature
autoModeCheckbox.addEventListener('change', function () {
    if (this.checked && !audioElement.paused) {
        startAutoMode();
    } else {
        stopAutoMode();
    }
});

function startAutoMode() {
    autoModeInterval = setInterval(() => {
        let currentValue = parseFloat(balanceSlider.value);
        let newValue = currentValue + autoDirection * autoModeStep;
        if (newValue > 1 || newValue < -1) {
            autoDirection *= -1;
            newValue = currentValue + autoDirection * autoModeStep
        }
        setBalance(newValue);
    }, autoModeSpeed);
}

function stopAutoMode() {
    clearInterval(autoModeInterval);
}

function setBalance(value) {
    panner.pan.value = value;
    balanceSlider.value = value;
}

// Space key to play/pause
document.body.onkeyup = function (e) {
    if (e.keyCode === 32) {
        playPauseButton.click();
    }
}

// const pageTitle = document.title;
// document.addEventListener('visibilitychange', function (e) {
//     const isPageActive = !document.hidden;
//     const isMusicPlaying = !audioElement.paused;
//     if (!isPageActive) {
//         document.title = isMusicPlaying ? "🎧 " + pageTitle : pageTitle;
//     } else {
//         document.title = pageTitle;
//     }
// });


// Set the initial values
panner.pan.value = balanceSlider.value;
audioElement.volume = volumeSlider.value;
