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

// Ref: http://www.phys.unsw.edu.au/jw/notes.html
const noteToFrequency = {
  'C4': 261.63,
  'C#4': 277.18,
  'D4': 293.67,
  'D#4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'G4': 392.0,
  'G#4': 415.3,
  'A4': 440.0,
  'A#4': 466.16,
  'B4': 493.88,
  'C5': 523.25,
  'C#5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'E5': 659.26,
  'F5': 698.46,
};

const BASE_OCTAVE = 4;
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const numNotes = notes.length;

class SoundController {
  constructor() {
    this.audioContext = new AudioContext();
    this.masterGainNode = new GainNode(this.audioContext, { gain: 0.2 });
    this.dynamicsCompressorNode = new DynamicsCompressorNode(this.audioContext);

    this.oscillatorNodes = {};
    this.gainNodes = {};

    this.masterGainNode.connect(this.dynamicsCompressorNode);
    this.dynamicsCompressorNode.connect(this.audioContext.destination);
  }

  createOscillatorWithGain({ frequency }) {
    const oscillatorNode = new OscillatorNode(this.audioContext);
    oscillatorNode.frequency.value = frequency;

    // const gainNode = new GainNode(this.audioContext, { gain: 1.0 });
    // oscillatorNode.connect(gainNode);

    return oscillatorNode;
  }

  playNotes({ notes }) {
    // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth
    const noteSet = new Set(notes.map((note) => `${note.note}${note.octave}`));
    Object.keys(noteToFrequency).forEach((note) => {
      if (noteSet.has(note)) {
        if (!this.gainNodes[note]) {
          const frequency = noteToFrequency[note];

          this.oscillatorNodes[note] = new OscillatorNode(this.audioContext);
          this.oscillatorNodes[note].frequency.value = frequency;

          this.gainNodes[note] = new GainNode(this.audioContext);
          this.oscillatorNodes[note].connect(this.gainNodes[note]);

          // Ref: https://stackoverflow.com/a/53684515
          this.gainNodes[note].connect(this.masterGainNode);
          this.oscillatorNodes[note].start();

          // // Ref: https://stackoverflow.com/a/43561607/650817
          // this.gainNodes[note].gain.setTargetAtTime(1.0, this.audioContext.currentTime, 1.0);
        }
      } else {
        if (this.oscillatorNodes[note]) {
          // Ref: http://alemangui.github.io/ramp-to-value
          const decayTimeSec = 0.15;
          this.gainNodes[note].gain.exponentialRampToValueAtTime(
            0.0001,
            this.audioContext.currentTime + decayTimeSec
          );
          this.oscillatorNodes[note].stop(this.audioContext.currentTime + decayTimeSec);

          delete this.oscillatorNodes[note];
          delete this.gainNodes[note];
        }
      }

      // const gainNode = this.gainNodes[note];
      // if (gainNode) {
      //   if (noteSet.has(note)) {
      //     gainNode.gain.value = 1.0;
      //   } else {
      //     gainNode.gain.value = 0.0;
      //   }
      // }
    });
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

  soundController.playNotes({ notes: activeNotes });

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
