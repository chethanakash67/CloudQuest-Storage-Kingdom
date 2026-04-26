// Sound effects placeholder system
// These create simple synthetic sounds using Web Audio API
// Replace with actual audio files in production

type SoundType = 'correct' | 'wrong' | 'levelComplete' | 'gameOver' | 'coinCollect' | 'badgeUnlock' | 'click' | 'damage';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio isn't available
  }
}

export function playSound(sound: SoundType) {
  switch (sound) {
    case 'correct':
      playTone(523, 0.15, 'sine');
      setTimeout(() => playTone(659, 0.15, 'sine'), 100);
      setTimeout(() => playTone(784, 0.2, 'sine'), 200);
      break;
    case 'wrong':
      playTone(200, 0.3, 'sawtooth', 0.2);
      setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.2), 150);
      break;
    case 'levelComplete':
      [523, 587, 659, 698, 784, 880, 988, 1047].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'sine', 0.2), i * 100);
      });
      break;
    case 'gameOver':
      playTone(400, 0.3, 'sawtooth', 0.2);
      setTimeout(() => playTone(350, 0.3, 'sawtooth', 0.2), 200);
      setTimeout(() => playTone(300, 0.5, 'sawtooth', 0.2), 400);
      break;
    case 'coinCollect':
      playTone(1200, 0.1, 'sine', 0.15);
      setTimeout(() => playTone(1600, 0.15, 'sine', 0.15), 80);
      break;
    case 'badgeUnlock':
      [440, 554, 659, 880].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.3, 'triangle', 0.2), i * 150);
      });
      break;
    case 'click':
      playTone(800, 0.05, 'sine', 0.1);
      break;
    case 'damage':
      playTone(100, 0.2, 'square', 0.15);
      setTimeout(() => playTone(80, 0.3, 'square', 0.1), 100);
      break;
  }
}
