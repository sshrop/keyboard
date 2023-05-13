const activeIntervals = new Set();
const keyboardKeyToIntervalMap = {
  'a': 0,
  'w': 1,
  's': 2,
  'e': 3,
  'd': 4,
  'f': 5,
  't': 6,
  'g': 7,
  'y': 8,
  'h': 9,
  'u': 10,
  'j': 11,
  'k': 12,
  'o': 13,
  'l': 14,
  'p': 15,
  ';': 16,
  "'": 17,
};
const numIntervals = Object.keys(keyboardKeyToIntervalMap).length;

const BASE_OCTAVE = 4;
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const numNotes = notes.length;

class SoundController {
  constructor() {
    this.audioContext = new AudioContext();
    this.oscillatorNode = new OscillatorNode(this.audioContext);
    this.gainNode = new GainNode(this.audioContext, { gain: 0 });

    this.oscillatorNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.oscillatorNode.start();
  }

  playNote({ note }) {
    this.oscillatorNode.frequency.value = 440.0;
    this.gainNode.gain.value = 0.2;
  }

  stop() {
    this.gainNode.gain.value = 0.0;
  }
}

const soundController = new SoundController();

function onActiveKeysChange() {
  let activeNotes = [];
  for (let interval = 0; interval < numIntervals; interval++) {
    const keyEl = document.querySelector(`[data-key-interval="${interval}"`);
    if (activeIntervals.has(interval)) {
      // enable highlight css
      keyEl.classList.add('key--enabled');

      // identify active note
      const octaveOffset = Math.floor(interval / numNotes);
      const octave = BASE_OCTAVE + octaveOffset;
      const note = notes[interval % numNotes];
      activeNotes.push({ octave, note });
    } else {
      // disable highlight css
      keyEl.classList.remove('key--enabled');
    }
  }

  const activeNote = activeNotes[0];
  if (activeNote) {
    soundController.playNote({ note: activeNote });
  } else {
    soundController.stop();
  }

  // console.log(`Active Notes: ${JSON.stringify(activeNotes, null, 2)}`);
}

document.addEventListener('keydown', (e) => {
  const { key } = e;
  const interval = keyboardKeyToIntervalMap[key];
  if (!activeIntervals.has(interval)) {
    activeIntervals.add(interval);
    onActiveKeysChange();
  }
});

document.addEventListener('keyup', (e) => {
  const { key } = e;
  const interval = keyboardKeyToIntervalMap[key];
  if (activeIntervals.has(interval)) {
    activeIntervals.delete(interval);
    onActiveKeysChange();
  }
});

// Ref: https://en.wikipedia.org/wiki/Scientific_pitch_notation#Table_of_note_frequencies
