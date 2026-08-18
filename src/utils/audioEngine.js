/**
 * Web Audio API Sound Synthesizer for BMW Twin-Turbo V8 Engine, Exhaust Burble, Starter, and Studio Acoustics
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.engineGain = null;
    this.idleOsc1 = null;
    this.idleOsc2 = null;
    this.rumbleOsc = null;
    this.filterNode = null;
    this.distortionNode = null;
    this.isRunning = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  startEngine() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isRunning) return true;

    // 1. Play realistic mechanical starter crank sound
    this.playStarterCrank();

    // 2. Big V8 Ignition Fire-Up Roar + Exhaust Burst
    setTimeout(() => {
      if (!this.ctx || !this.masterGain) return;

      this.isRunning = true;
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      // Surge on ignition burst
      this.engineGain.gain.exponentialRampToValueAtTime(0.7, this.ctx.currentTime + 0.15);
      this.engineGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 1.2);

      // Deep Sub-bass Rumble (32Hz)
      this.rumbleOsc = this.ctx.createOscillator();
      this.rumbleOsc.type = "sawtooth";
      this.rumbleOsc.frequency.setValueAtTime(110, this.ctx.currentTime);
      this.rumbleOsc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.9);

      // Cylinder firing tone (68Hz idle, initial 220Hz burst)
      this.idleOsc1 = this.ctx.createOscillator();
      this.idleOsc1.type = "sawtooth";
      this.idleOsc1.frequency.setValueAtTime(240, this.ctx.currentTime);
      this.idleOsc1.frequency.exponentialRampToValueAtTime(68, this.ctx.currentTime + 0.9);

      // Twin-Turbo Harmonic (136Hz)
      this.idleOsc2 = this.ctx.createOscillator();
      this.idleOsc2.type = "triangle";
      this.idleOsc2.frequency.setValueAtTime(420, this.ctx.currentTime);
      this.idleOsc2.frequency.exponentialRampToValueAtTime(136, this.ctx.currentTime + 0.9);

      // Low-pass warmth filter with resonance
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(1200, this.ctx.currentTime);
      this.filterNode.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.9);
      this.filterNode.Q.setValueAtTime(3.8, this.ctx.currentTime);

      this.rumbleOsc.connect(this.filterNode);
      this.idleOsc1.connect(this.filterNode);
      this.idleOsc2.connect(this.filterNode);
      this.filterNode.connect(this.engineGain);
      this.engineGain.connect(this.masterGain);

      this.rumbleOsc.start();
      this.idleOsc1.start();
      this.idleOsc2.start();

      // Initial Ignition Exhaust Bark Pop
      this.playExhaustPop(0.65);
      setTimeout(() => this.playExhaustPop(0.4), 250);
      setTimeout(() => this.playExhaustPop(0.3), 500);
    }, 450);

    return true;
  }

  stopEngine() {
    if (!this.ctx || !this.engineGain) return false;
    this.engineGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    setTimeout(() => {
      try {
        this.rumbleOsc?.stop();
        this.idleOsc1?.stop();
        this.idleOsc2?.stop();
      } catch (e) {}
      this.isRunning = false;
    }, 400);
    return false;
  }

  toggleEngine() {
    if (this.isRunning) {
      return this.stopEngine();
    } else {
      return this.startEngine();
    }
  }

  revEngine() {
    this.initContext();
    if (!this.isRunning || !this.ctx || !this.idleOsc1 || !this.filterNode || !this.engineGain) {
      if (!this.isRunning) {
        this.startEngine();
        setTimeout(() => this.revEngine(), 600);
      }
      return;
    }

    const t = this.ctx.currentTime;
    // Throttle Spike: RPM surge
    this.idleOsc1.frequency.cancelScheduledValues(t);
    this.idleOsc1.frequency.setTargetAtTime(240, t, 0.08);
    
    if (this.idleOsc2) {
      this.idleOsc2.frequency.cancelScheduledValues(t);
      this.idleOsc2.frequency.setTargetAtTime(380, t, 0.08);
    }
    if (this.rumbleOsc) {
      this.rumbleOsc.frequency.cancelScheduledValues(t);
      this.rumbleOsc.frequency.setTargetAtTime(110, t, 0.08);
    }
    this.filterNode.frequency.cancelScheduledValues(t);
    this.filterNode.frequency.setTargetAtTime(1400, t, 0.07);
    this.engineGain.gain.setTargetAtTime(0.8, t, 0.07);

    // Throttle lift-off: aggressive twin-turbo burble & dual exhaust pops
    setTimeout(() => {
      if (!this.ctx || !this.idleOsc1 || !this.filterNode || !this.engineGain) return;
      const t2 = this.ctx.currentTime;
      this.idleOsc1.frequency.setTargetAtTime(68, t2, 0.35);
      if (this.idleOsc2) this.idleOsc2.frequency.setTargetAtTime(136, t2, 0.35);
      if (this.rumbleOsc) this.rumbleOsc.frequency.setTargetAtTime(32, t2, 0.35);
      this.filterNode.frequency.setTargetAtTime(280, t2, 0.35);
      this.engineGain.gain.setTargetAtTime(0.4, t2, 0.35);

      this.playExhaustPop(0.7);
      setTimeout(() => this.playExhaustPop(0.55), 120);
      setTimeout(() => this.playExhaustPop(0.35), 240);
    }, 450);
  }

  playStarterCrank() {
    if (!this.ctx || !this.masterGain) return;
    // Multi-pulse starter teeth crank sound
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140 - i * 15, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.13);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
      }, i * 130);
    }
  }

  playExhaustPop(intensity = 0.5) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.14);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.022));
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 160;
    filter.Q.value = 2.2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(intensity, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    whiteNoise.start();
  }

  playClick() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.035);
  }
}

export const soundEngine = new SoundEngine();
