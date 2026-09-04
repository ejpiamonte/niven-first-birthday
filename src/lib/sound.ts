// Synthesizes the envelope-unseal sound effect on the fly (a soft wax
// "crack" followed by a bright three-note sparkle chime) using the Web
// Audio API. Deliberately not an external audio file — nothing to
// license, host, or worry about file-casing/format issues with.

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!sharedContext) {
    sharedContext = new AudioContextClass();
  }

  return sharedContext;
}

function playCrack(ctx: AudioContext, startTime: number) {
  const duration = 0.06;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1800;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(startTime);
  source.stop(startTime + duration);
}

function playChimeNote(ctx: AudioContext, frequency: number, startTime: number) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = frequency;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + 0.9);
}

/**
 * Plays the unseal sound effect. Must be called from inside a user-gesture
 * handler (e.g. an onClick) — browsers won't let a fresh AudioContext make
 * sound otherwise.
 */
export function playUnsealChime() {
  const ctx = getContext();

  if (!ctx) {
    return;
  }

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  const now = ctx.currentTime;

  playCrack(ctx, now);

  // A5, C#6, E6 — a bright major triad, played as a quick ascending
  // sparkle right after the "crack".
  const notes = [880, 1108.73, 1318.51];
  notes.forEach((freq, i) => {
    playChimeNote(ctx, freq, now + 0.12 + i * 0.11);
  });
}