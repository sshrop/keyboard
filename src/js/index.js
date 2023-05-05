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

function onActiveKeysChange() {
  let activeNotes = [];
  for (let interval = 0; interval < numIntervals; interval++) {
    const keyEl = document.querySelector(`[data-key-interval="${interval}"`);
    if (activeIntervals.has(interval)) {
      keyEl.classList.add('key--enabled');
      // TODO: enable highlight css

      // identify active note
      const octaveOffset = Math.floor(interval / numNotes);
      const octave = BASE_OCTAVE + octaveOffset;
      const note = notes[interval % numNotes];
      activeNotes.push({ octave, note });
    } else {
      // TODO: disable highlight css
      keyEl.classList.remove('key--enabled');
    }
  }

  console.log(`Active Notes: ${JSON.stringify(activeNotes, null, 2)}`);
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
