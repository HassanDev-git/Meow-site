/* ------------------------------------------------------------------
   GOP GOP audio engine — all sounds are synthesized with Web Audio.
   No audio files. Just oscillators pretending to be a cat.
------------------------------------------------------------------- */

export type MeowKind = "meow" | "nya" | "trill" | "opera" | "grumble";

type MeowShape = {
  /** [timeRatio, pitchRatio] contour points */
  contour: [number, number][];
  dur: number;
  vibratoRate: number;
  vibratoDepth: number;
  loStart: number;
  loEnd: number;
  gain: number;
};

const SHAPES: Record<MeowKind, MeowShape> = {
  meow: {
    contour: [
      [0, 0.75],
      [0.12, 1.4],
      [0.4, 1.15],
      [0.72, 0.72],
      [1, 0.5],
    ],
    dur: 0.55,
    vibratoRate: 7,
    vibratoDepth: 14,
    loStart: 2100,
    loEnd: 620,
    gain: 0.5,
  },
  nya: {
    contour: [
      [0, 1.05],
      [0.18, 1.6],
      [0.55, 1.25],
      [1, 0.68],
    ],
    dur: 0.32,
    vibratoRate: 9,
    vibratoDepth: 18,
    loStart: 2600,
    loEnd: 900,
    gain: 0.5,
  },
  trill: {
    contour: [
      [0, 0.9],
      [0.25, 1.5],
      [0.7, 1.35],
      [1, 0.85],
    ],
    dur: 0.4,
    vibratoRate: 26,
    vibratoDepth: 65,
    loStart: 2400,
    loEnd: 1100,
    gain: 0.48,
  },
  opera: {
    contour: [
      [0, 0.62],
      [0.2, 1.15],
      [0.42, 1.05],
      [0.58, 1.75],
      [0.8, 0.85],
      [1, 0.42],
    ],
    dur: 1.25,
    vibratoRate: 6,
    vibratoDepth: 30,
    loStart: 1900,
    loEnd: 520,
    gain: 0.52,
  },
  grumble: {
    contour: [
      [0, 0.6],
      [0.3, 0.52],
      [0.55, 0.66],
      [1, 0.4],
    ],
    dur: 0.5,
    vibratoRate: 18,
    vibratoDepth: 20,
    loStart: 760,
    loEnd: 260,
    gain: 0.55,
  },
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private purr: { nodes: AudioNode[]; env: GainNode } | null = null;
  private _muted = false;

  get muted() {
    return this._muted;
  }

  setMuted(m: boolean) {
    this._muted = m;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.02);
    }
  }

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 6;
      const g = this.ctx.createGain();
      g.gain.value = this._muted ? 0 : 0.9;
      g.connect(comp);
      comp.connect(this.ctx.destination);
      this.master = g;

      // shared noise buffer
      const len = this.ctx.sampleRate * 0.5;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  /** The main event: a synthesized meow. pitch ≈ fundamental in Hz. */
  meow(kind: MeowKind = "meow", pitch = 460, detune = 0) {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const s = SHAPES[kind];
    const t0 = ctx.currentTime + 0.01;
    const dur = s.dur * (0.92 + Math.random() * 0.16);
    const base = pitch * (1 + detune) * (0.94 + Math.random() * 0.12);

    // voice
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    s.contour.forEach(([tr, pr], i) => {
      const t = t0 + tr * dur;
      if (i === 0) osc.frequency.setValueAtTime(base * pr, t);
      else osc.frequency.linearRampToValueAtTime(base * pr, t);
    });

    // vibrato
    const vib = ctx.createOscillator();
    vib.type = "sine";
    vib.frequency.value = s.vibratoRate;
    const vibAmt = ctx.createGain();
    vibAmt.gain.setValueAtTime(0, t0);
    vibAmt.gain.linearRampToValueAtTime(s.vibratoDepth, t0 + dur * 0.35);
    vib.connect(vibAmt);
    vibAmt.connect(osc.frequency);

    // formant-ish filtering: a sweeping lowpass + a fixed band "vowel body"
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 3.5;
    lp.frequency.setValueAtTime(s.loStart, t0);
    lp.frequency.exponentialRampToValueAtTime(s.loEnd, t0 + dur);

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = kind === "grumble" ? 640 : 1150;
    bp.Q.value = 0.8;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(s.gain, t0 + 0.045);
    env.gain.setValueAtTime(s.gain, t0 + dur * 0.45);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(lp);
    lp.connect(bp);
    bp.connect(env);
    env.connect(this.master);

    osc.start(t0);
    vib.start(t0);
    osc.stop(t0 + dur + 0.05);
    vib.stop(t0 + dur + 0.05);
  }

  /** The sacred "gop": a paw pat. Low thump + tiny click. */
  gop(velocity = 1) {
    const ctx = this.ensure();
    if (!ctx || !this.master || !this.noiseBuf) return;
    const t0 = ctx.currentTime;
    const v = Math.min(1.2, Math.max(0.25, velocity));

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150 * (0.9 + Math.random() * 0.2), t0);
    osc.frequency.exponentialRampToValueAtTime(52, t0 + 0.09);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t0);
    og.gain.exponentialRampToValueAtTime(0.55 * v, t0 + 0.008);
    og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    osc.connect(og);
    og.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + 0.14);

    const click = ctx.createBufferSource();
    click.buffer = this.noiseBuf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1400;
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0.1 * v, t0);
    cg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.03);
    click.connect(hp);
    hp.connect(cg);
    cg.connect(this.master);
    click.start(t0);
    click.stop(t0 + 0.04);
  }

  /** Tiny hat tick for the sequencer. */
  tick() {
    const ctx = this.ensure();
    if (!ctx || !this.master || !this.noiseBuf) return;
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 6200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.09, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.035);
    src.connect(hp);
    hp.connect(g);
    g.connect(this.master);
    src.start(t0);
    src.stop(t0 + 0.05);
  }

  /** Continuous purr while kneading. Returns a stop function. */
  startPurr(): () => void {
    const ctx = this.ensure();
    if (!ctx || !this.master || !this.noiseBuf) return () => {};
    if (this.purr) return this.stopPurr;

    const t0 = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t0);
    out.gain.exponentialRampToValueAtTime(0.4, t0 + 0.18);
    out.connect(this.master);

    // amplitude gate driven by ~22Hz LFO
    const gate = ctx.createGain();
    gate.gain.value = 0.35;
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 22;
    const lfoAmt = ctx.createGain();
    lfoAmt.gain.value = 0.3;
    lfo.connect(lfoAmt);
    lfoAmt.connect(gate.gain);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 320;

    const voice = ctx.createOscillator();
    voice.type = "sawtooth";
    voice.frequency.value = 47;

    const breath = ctx.createBufferSource();
    breath.buffer = this.noiseBuf;
    breath.loop = true;
    const bg = ctx.createGain();
    bg.gain.value = 0.5;

    voice.connect(lp);
    breath.connect(bg);
    bg.connect(lp);
    lp.connect(gate);
    gate.connect(out);

    voice.start(t0);
    breath.start(t0);
    lfo.start(t0);

    this.purr = { nodes: [voice, breath, lfo], env: out };
    return this.stopPurr;
  }

  private stopPurr = () => {
    if (!this.purr || !this.ctx) return;
    const t = this.ctx.currentTime;
    const { nodes, env } = this.purr;
    env.gain.setTargetAtTime(0.0001, t, 0.06);
    nodes.forEach((n) => {
      if (n instanceof OscillatorNode || n instanceof AudioBufferSourceNode) {
        try {
          n.stop(t + 0.3);
        } catch {
          /* already stopped */
        }
      }
    });
    this.purr = null;
  };
}

export const audio = new AudioEngine();
