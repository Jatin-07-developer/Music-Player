// There's no artwork stored in the backend, so we generate a stable,
// good-looking gradient "sleeve" per title/id — same input always
// produces the same cover.
const PALETTES = [
  ["#e8a33d", "#8a2a3d"],
  ["#4fb3a9", "#221621"],
  ["#8a2a3d", "#2c6f68"],
  ["#c14c5f", "#e8a33d"],
  ["#2c6f68", "#f2c583"],
  ["#8a5f24", "#4fb3a9"],
];

function hash(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function coverGradient(seed) {
  const h = hash(String(seed));
  const [c1, c2] = PALETTES[h % PALETTES.length];
  const angle = (h % 6) * 60;
  return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
}

export function formatTime(sec = 0) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
