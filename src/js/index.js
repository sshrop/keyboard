const activeKeys = new Set();
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

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function onActiveKeysChange() {


  console.log(`Active Keys: ${Array.from(activeKeys).join(', ')}`);
}

document.addEventListener('keydown', (e) => {
  const { key } = e;
  if (!activeKeys.has(key)) {
    activeKeys.add(key);
    onActiveKeysChange();
  }
});

document.addEventListener('keyup', (e) => {
  const { key } = e;
  if (activeKeys.has(key)) {
    activeKeys.delete(key);
    onActiveKeysChange();
  }
});

// Ref: https://en.wikipedia.org/wiki/Scientific_pitch_notation#Table_of_note_frequencies
