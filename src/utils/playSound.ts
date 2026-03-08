export type SoundType = "chime" | "coin" | "bell" | "pop" | "ding" | "notification" | "success" | "alert";

export const soundOptions: { value: SoundType; label: string; description: string }[] = [
  { value: "chime", label: "Chime", description: "Soft melodic chime" },
  { value: "ding", label: "Ding", description: "Classic notification ding" },
  { value: "notification", label: "Notification", description: "Modern notification tone" },
  { value: "success", label: "Success", description: "Pleasing success sound" },
  { value: "alert", label: "Alert", description: "Attention-grabbing alert" },
  { value: "coin", label: "Coin", description: "Retro coin pickup" },
  { value: "bell", label: "Bell", description: "Gentle bell ring" },
  { value: "pop", label: "Pop", description: "Quick pop sound" },
];

const SAMPLE_RATE = 44100;

interface SynthesizedSound {
  buffer: AudioBuffer;
}

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let cachedSounds: Record<SoundType, SynthesizedSound> | null = null;
let isAudioUnlocked = false;
let pendingSounds: SoundType[] = [];
let isProcessingQueue = false;

const createAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = 0.5;
  }
  return audioContext;
};

const generateSoundBuffer = (type: SoundType, ctx: AudioContext): AudioBuffer => {
  const duration = type === "alert" ? 0.6 : type === "notification" ? 0.5 : type === "success" ? 0.4 : type === "bell" ? 0.8 : type === "chime" ? 0.5 : type === "ding" ? 0.4 : type === "coin" ? 0.35 : 0.12;
  const bufferSize = Math.floor(SAMPLE_RATE * duration);
  const buffer = ctx.createBuffer(1, bufferSize, SAMPLE_RATE);
  const data = buffer.getChannelData(0);

  switch (type) {
    case "ding": {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / SAMPLE_RATE;
        const freq = 1046.5;
        const envelope = Math.exp(-t * 4) * 0.6;
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope;
        
        const harmonic = Math.sin(2 * Math.PI * freq * 2 * t) * envelope * 0.3;
        data[i] += harmonic;
      }
      break;
    }

    case "notification": {
      const freqs = [523, 659, 784];
      for (let i = 0; i < bufferSize; i++) {
        const t = i / SAMPLE_RATE;
        let sample = 0;
        
        for (let j = 0; j < freqs.length; j++) {
          const delay = j * 0.1;
          const tt = t - delay;
          if (tt >= 0) {
            const envelope = Math.exp(-tt * 3) * 0.4;
            sample += Math.sin(2 * Math.PI * freqs[j] * tt) * envelope;
          }
        }
        data[i] = sample;
      }
      break;
    }

    case "success": {
      const freqs = [523, 659, 784, 1047];
      for (let i = 0; i < bufferSize; i++) {
        const t = i / SAMPLE_RATE;
        let sample = 0;
        
        const notes = [523, 659, 784];
        for (let j = 0; j < notes.length; j++) {
          const noteTime = j * 0.1;
          const tt = t - noteTime;
          if (tt >= 0 && tt < 0.3) {
            const envelope = Math.exp(-tt * 5) * 0.35;
            sample += Math.sin(2 * Math.PI * notes[j] * tt) * envelope;
          }
        }
        data[i] = sample;
      }
      break;
    }

    case "alert": {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / SAMPLE_RATE;
        const freq = 880 + Math.sin(t * 10) * 200;
        const envelope = (Math.sin(t * 8) * 0.5 + 0.5) * Math.exp(-t * 2) * 0.6;
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope;
        
        const sub = Math.sin(2 * Math.PI * 220 * t) * envelope * 0.4;
        data[i] += sub;
      }
      break;
    }

    case "chime": {
      const freqs = [880, 1109, 1319, 1760];
      for (let i = 0; i < bufferSize; i++) {
        let sample = 0;
        const t = i / SAMPLE_RATE;
        for (let j = 0; j < freqs.length; j++) {
          const delay = j * 0.06;
          const tt = t - delay;
          if (tt >= 0 && tt < 0.4) {
            const envelope = Math.exp(-tt * 5) * (0.3 / (j + 1));
            sample += Math.sin(2 * Math.PI * freqs[j] * tt) * envelope;
          }
        }
        data[i] = sample;
      }
      break;
    }

    case "coin": {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / SAMPLE_RATE;
        let sample = 0;

        if (t < 0.15) {
          const freq = 988 + (1320 - 988) * (t / 0.1);
          const envelope = Math.exp(-t * 12) * 0.35;
          sample += Math.sin(2 * Math.PI * freq * t) * envelope;
        }

        if (t >= 0.08 && t < 0.35) {
          const t2 = t - 0.08;
          const freq = 1320 + (1760 - 1320) * (t2 / 0.15);
          const envelope = Math.exp(-t2 * 10) * 0.25;
          sample += Math.sin(2 * Math.PI * freq * t2) * envelope;
        }

        data[i] = sample;
      }
      break;
    }

    case "bell": {
      const freqs = [523, 659, 784, 1047, 1319];
      for (let i = 0; i < bufferSize; i++) {
        let sample = 0;
        const t = i / SAMPLE_RATE;

        for (let j = 0; j < freqs.length; j++) {
          const envelope = Math.exp(-t * 2.5) * (0.2 / (j + 1));
          sample += Math.sin(2 * Math.PI * freqs[j] * t) * envelope;
        }

        data[i] = sample;
      }
      break;
    }

    case "pop": {
      for (let i = 0; i < bufferSize; i++) {
        const t = i / SAMPLE_RATE;
        const freq = 600 * Math.exp(-t * 25);
        const envelope = Math.exp(-t * 20) * 0.5;
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope;
      }
      break;
    }
  }

  return buffer;
};

const preloadSounds = (): void => {
  if (cachedSounds) return;

    // This prevents AudioContext creation before user interaction
  if (!audioContext) {
    return; // Don't preload until AudioContext is properly unlocked
  }

  const ctx = audioContext;
  cachedSounds = {
    chime: { buffer: generateSoundBuffer("chime", ctx) },
    coin: { buffer: generateSoundBuffer("coin", ctx) },
    bell: { buffer: generateSoundBuffer("bell", ctx) },
    pop: { buffer: generateSoundBuffer("pop", ctx) },
    ding: { buffer: generateSoundBuffer("ding", ctx) },
    notification: { buffer: generateSoundBuffer("notification", ctx) },
    success: { buffer: generateSoundBuffer("success", ctx) },
    alert: { buffer: generateSoundBuffer("alert", ctx) },
  };
};

const unlockAudio = (): void => {
  if (isAudioUnlocked) return;

  try {
        // This ensures AudioContext creation happens after user gesture
    const ctx = createAudioContext();
    
    if (ctx.state === "suspended") {
      ctx.resume().then(() => {
        isAudioUnlocked = true;
        audioContext = ctx; // Store the context for reuse
        masterGain = ctx.createGain(); // Create and store master gain
        masterGain.connect(ctx.destination);
        masterGain.gain.value = 0.5;
        preloadSounds(); // Now safe to preload
        processSoundQueue();
      }).catch(() => {
        isAudioUnlocked = true;
        audioContext = ctx; // Store the context for reuse
        masterGain = ctx.createGain(); // Create and store master gain
        masterGain.connect(ctx.destination);
        masterGain.gain.value = 0.5;
        preloadSounds(); // Now safe to preload
        processSoundQueue();
      });
    } else {
      isAudioUnlocked = true;
      audioContext = ctx; // Store the context for reuse
      masterGain = ctx.createGain(); // Create and store master gain
      masterGain.connect(ctx.destination);
      masterGain.gain.value = 0.5;
      preloadSounds(); // Now safe to preload
      processSoundQueue();
    }
  } catch {
    isAudioUnlocked = true;
  }
};

const processSoundQueue = (): void => {
  if (isProcessingQueue || pendingSounds.length === 0) return;
  isProcessingQueue = true;

  while (pendingSounds.length > 0) {
    const soundType = pendingSounds.shift();
    if (soundType) {
      playSoundImmediate(soundType);
    }
  }

  isProcessingQueue = false;
};

const playSoundImmediate = (type: SoundType): void => {
  try {
    if (!audioContext) {
      unlockAudio();
      return;
    }
    
    const ctx = audioContext;
    
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    
    if (!cachedSounds) {
      preloadSounds();
    }

    const sound = cachedSounds?.[type];
    if (!sound) return;

    const source = ctx.createBufferSource();
    source.buffer = sound.buffer;
    
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.7;
    
    source.connect(gainNode);
    if (masterGain) {
      gainNode.connect(masterGain);
    } else {
      gainNode.connect(ctx.destination);
    }
    
    source.start(0);
  } catch {
    fallbackToSpeech();
  }
};

const fallbackToSpeech = (): void => {
  try {
    const utterance = new SpeechSynthesisUtterance("HIT caught");
    utterance.rate = 1.5;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Silently fail
  }
};

export const setVolume = (volume: number): void => {
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }
};

export const playSound = (soundType: SoundType): void => {
  if (!isAudioUnlocked) {
    pendingSounds.push(soundType);
    setupInteractionListeners();     return;
  }

  if (pendingSounds.length > 0) {
    pendingSounds.push(soundType);
    processSoundQueue();
    return;
  }

  playSoundImmediate(soundType);
};

export const previewSound = (soundType: SoundType): void => {
  playSound(soundType);
};

export const playChime = (): void => playSound("chime");
export const playCoin = (): void => playSound("coin");
export const playBell = (): void => playSound("bell");
export const playPop = (): void => playSound("pop");
export const playDing = (): void => playSound("ding");
export const playNotification = (): void => playSound("notification");
export const playSuccess = (): void => playSound("success");
export const playAlert = (): void => playSound("alert");

export const announceHitCaught = (soundType: SoundType = "ding"): void => {
  playSound(soundType);
};

export const showBrowserNotification = (title: string, body: string): void => {
  if (!("Notification" in window)) return;
  
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/icons/icon128.png",
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body,
          icon: "/icons/icon128.png",
        });
      }
    });
  }
};

export const announceHitWithNotification = (soundType: SoundType = "ding", requesterName?: string, reward?: string): void => {
  playSound(soundType);
  if (Notification.permission !== "granted") return;
  
  const body = requesterName && reward 
    ? `${requesterName}: ${reward}` 
    : "A new HIT has been accepted!";
  showBrowserNotification("HIT Accepted!", body);
};

export const initAudioContext = (): void => {
  unlockAudio();
};

let interactionListenersSetup = false;
let unlockOnInteraction: (() => void) | null = null;

// This ensures AudioContext is only created on first user interaction
const setupInteractionListeners = (): void => {
  if (interactionListenersSetup) return;
  interactionListenersSetup = true;

  unlockOnInteraction = () => {
    unlockAudio();
    if (unlockOnInteraction) {
      document.removeEventListener("click", unlockOnInteraction, true);
      document.removeEventListener("keydown", unlockOnInteraction, true);
      document.removeEventListener("touchstart", unlockOnInteraction, true);
      document.removeEventListener("mousedown", unlockOnInteraction, true);
    }
  };

  document.addEventListener("click", unlockOnInteraction, true);
  document.addEventListener("keydown", unlockOnInteraction, true);
  document.addEventListener("touchstart", unlockOnInteraction, true);
  document.addEventListener("mousedown", unlockOnInteraction, true);
};

