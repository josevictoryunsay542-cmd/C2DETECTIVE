
const morseCode = ".. .- -- -. --- - .--.. . ..-. . -.-. -"; // Replace with your Morse code

const playButton = document.getElementById("playMorse");
const stopButton = document.getElementById("stopMorse");
const status = document.getElementById("morseStatus");

let audioContext = null;
let activeOscillators = [];
let playbackTimer = null;

function stopMorse() {
    if (playbackTimer !== null) {
        clearTimeout(playbackTimer);
        playbackTimer = null;
    }

    activeOscillators.forEach(oscillator => {
        try {
            oscillator.stop();
        } catch (error) {
            // Oscillator may have already stopped.
        }
    });

    activeOscillators = [];
    status.textContent = "Playback stopped.";
}

function playMorse() {
    stopMorse();

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        status.textContent = "Audio is not supported by this browser.";
        return;
    }

    if (!audioContext || audioContext.state === "closed") {
        audioContext = new AudioContextClass();
    }

    audioContext.resume().then(() => {
        const unit = 0.12; // Duration of one Morse time unit
        const frequency = 650;
        let time = audioContext.currentTime + 0.1;

        status.textContent = "Playing Morse code...";

        const symbols = morseCode.trim().split("");
        const endTime = time;

        symbols.forEach((symbol, index) => {
            if (symbol === "." || symbol === "-") {
                const duration = symbol === "." ? unit : unit * 3;
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();

                oscillator.frequency.value = frequency;
                oscillator.type = "sine";

                gain.gain.setValueAtTime(0, time);
                gain.gain.setValueAtTime(0.2, time + 0.005);
                gain.gain.setValueAtTime(0.2, time + duration - 0.005);
                gain.gain.setValueAtTime(0, time + duration);

                oscillator.connect(gain);
                gain.connect(audioContext.destination);

                oscillator.start(time);
                oscillator.stop(time + duration);

                activeOscillators.push(oscillator);
                time += duration;
            }

            if (symbol === " ") {
                time += unit * 3;
            } else if (symbol === "/") {
                time += unit * 7;
            }

            // Separate consecutive signals within a letter.
            if (
                (symbol === "." || symbol === "-") &&
                symbols[index + 1] &&
                symbols[index + 1] !== " " &&
                symbols[index + 1] !== "/"
            ) {
                time += unit;
            }
        });

        const durationMs = Math.max(
            0,
            (time - audioContext.currentTime) * 1000
        );

        playbackTimer = setTimeout(() => {
            activeOscillators = [];
            playbackTimer = null;
            status.textContent = "Playback finished.";
        }, durationMs + 100);
    }).catch(() => {
        status.textContent = "Unable to start audio.";
    });
}

playButton.addEventListener("click", playMorse);
stopButton.addEventListener("click", stopMorse);
