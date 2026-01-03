export type BumperType = 'standard' | 'glitch' | 'mega';
export type RampType = 'left' | 'right' | 'center';
export type SequenceName = 'BYTE' | 'CIRCUIT' | 'HACK' | 'GHOST';

export interface NormalizedCircle {
  x: number;
  y: number;
  radius: number;
}

export interface NormalizedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TargetDefinition extends NormalizedRect {
  sequence: SequenceName;
  letterIndex: number;
}

export interface TrampolineDefinition extends NormalizedRect {
  slopeDeg: number;
}

export interface SmallSphereDefinition extends NormalizedCircle {}

export interface BumperDefinition extends NormalizedCircle {
  type: BumperType;
}

export const GLITCH_PINBALL_CONSTANTS = {
  tableName: 'GLITCH.IO',
  physics: {
    gravity: 0.3,
    friction: 0.985,
    wallBounce: 0.8,
    flipperKick: 1.6,
    bumperKick: 5,
    smallSphereKick: 3.2,
    trampolineKick: 1.8
  },
  ball: {
    radius: 8,
    launchSpeed: { minX: 2, maxX: 4, minY: -7, maxY: -5 }
  },
  flippers: {
    leftX: 0.18,
    rightX: 0.82,
    y: 0.9,
    length: 0.12,
    thickness: 0.04,
    restAngle: 15,
    activeAngle: 30
  },
  scores: {
    bumpers: {
      standard: 1000,
      glitch: 2500,
      mega: 5000
    },
    ramps: {
      left: 5000,
      right: 5000,
      center: 10000
    },
    letters: 2000
  },
  multiplier: {
    step: 0.5,
    max: 5,
    reset: 1
  },
  ballSaveSeconds: 10,
  glitchInvertSeconds: 2,
  tiltWarnings: 3,
  dataMultiball: {
    jackpotStart: 50000,
    jackpotStep: 25000,
    balls: 3,
    locksRequired: 2
  },
  overclock: {
    duration: 30,
    triggerWindow: 15,
    scoreMultiplier: 2,
    superLoopAward: 250000
  },
  debugRound: {
    duration: 45,
    jackpotStart: 75000,
    jackpotStep: 15000,
    glitchTimePenalty: 5,
    glitchJackpotBonus: 5000
  },
  poltergeist: {
    stageOneShots: 6,
    stageTwoShots: 4,
    stageThreeShots: 3,
    stageThreeTimer: 15,
    stageOneAward: 25000,
    stageTwoAward: 50000,
    stageThreeAward: 100000
  }
};

export const GLITCH_PINBALL_LAYOUT: {
  bumpers: BumperDefinition[];
  ramps: {
    left: NormalizedRect;
    right: NormalizedRect;
    center: NormalizedRect;
  };
  smallSpheres: SmallSphereDefinition[];
  targets: TargetDefinition[];
  captiveBall: NormalizedRect;
  outlanes: NormalizedRect[];
  plungerStart: { x: number; y: number };
  trampolines: TrampolineDefinition[];
} = {
  bumpers: [
    { x: 0.5, y: 0.33, radius: 0.05, type: 'standard' as const },
    { x: 0.25, y: 0.5, radius: 0.05, type: 'glitch' as const },
    { x: 0.75, y: 0.5, radius: 0.05, type: 'mega' as const }
  ],
  ramps: {
    left: { x: 0.06, y: 0.33, width: 0.26, height: 0.18 },
    right: { x: 0.68, y: 0.33, width: 0.26, height: 0.18 },
    center: { x: 0.47, y: 0.72, width: 0.06, height: 0.18 }
  },
  smallSpheres: [
    { x: 0.18, y: 0.58, radius: 0.02 },
    { x: 0.32, y: 0.52, radius: 0.018 },
    { x: 0.5, y: 0.48, radius: 0.02 },
    { x: 0.68, y: 0.52, radius: 0.018 },
    { x: 0.22, y: 0.83, radius: 0.018 },
    { x: 0.32, y: 0.87, radius: 0.018 },
    { x: 0.62, y: 0.89, radius: 0.018 },
    { x: 0.168, y: 0.152, radius: 0.018 },
    { x: 0.82, y: 0.58, radius: 0.02 },
    { x: 0.5, y: 0.5, radius: 0.018 },
    { x: 0.4, y: 0.3, radius: 0.016 },
    { x: 0.6, y: 0.3, radius: 0.016 }
  ],
  targets: [
    { x: 0.2, y: 0.3, width: 0.06, height: 0.03, sequence: 'BYTE', letterIndex: 0 },
    { x: 0.25, y: 0.35, width: 0.06, height: 0.03, sequence: 'BYTE', letterIndex: 1 },
    { x: 0.3, y: 0.4, width: 0.06, height: 0.03, sequence: 'BYTE', letterIndex: 2 },
    { x: 0.35, y: 0.45, width: 0.06, height: 0.03, sequence: 'BYTE', letterIndex: 3 },
    { x: 0.6, y: 0.25, width: 0.08, height: 0.025, sequence: 'CIRCUIT', letterIndex: 0 },
    { x: 0.65, y: 0.3, width: 0.08, height: 0.025, sequence: 'CIRCUIT', letterIndex: 1 },
    { x: 0.7, y: 0.35, width: 0.08, height: 0.025, sequence: 'CIRCUIT', letterIndex: 2 },
    { x: 0.75, y: 0.4, width: 0.08, height: 0.025, sequence: 'CIRCUIT', letterIndex: 3 },
    { x: 0.8, y: 0.45, width: 0.08, height: 0.025, sequence: 'CIRCUIT', letterIndex: 4 },
    { x: 0.85, y: 0.5, width: 0.08, height: 0.025, sequence: 'CIRCUIT', letterIndex: 5 },
    { x: 0.9, y: 0.55, width: 0.08, height: 0.025, sequence: 'CIRCUIT', letterIndex: 6 },
    { x: 0.4, y: 0.6, width: 0.07, height: 0.035, sequence: 'HACK', letterIndex: 0 },
    { x: 0.45, y: 0.6, width: 0.07, height: 0.035, sequence: 'HACK', letterIndex: 1 },
    { x: 0.5, y: 0.6, width: 0.07, height: 0.035, sequence: 'HACK', letterIndex: 2 },
    { x: 0.55, y: 0.6, width: 0.07, height: 0.035, sequence: 'HACK', letterIndex: 3 },
    { x: 0.45, y: 0.2, width: 0.05, height: 0.04, sequence: 'GHOST', letterIndex: 0 },
    { x: 0.5, y: 0.2, width: 0.05, height: 0.04, sequence: 'GHOST', letterIndex: 1 },
    { x: 0.55, y: 0.2, width: 0.05, height: 0.04, sequence: 'GHOST', letterIndex: 2 },
    { x: 0.6, y: 0.2, width: 0.05, height: 0.04, sequence: 'GHOST', letterIndex: 3 },
    { x: 0.65, y: 0.2, width: 0.05, height: 0.04, sequence: 'GHOST', letterIndex: 4 }
  ],
  captiveBall: { x: 0.52, y: 0.16, width: 0.06, height: 0.05 },
  outlanes: [
    { x: 0.0, y: 0.92, width: 0.12, height: 0.08 },
    { x: 0.88, y: 0.92, width: 0.12, height: 0.08 }
  ],
  plungerStart: { x: 0.08, y: 0.88 },
  trampolines: [
    { x: 0.04, y: 0.9, width: 0.14, height: 0.03, slopeDeg: 3.5 },
    { x: 0.2, y: 0.94, width: 0.18, height: 0.025, slopeDeg: -2.5 },
    { x: 0.41, y: 0.94, width: 0.18, height: 0.025, slopeDeg: 2.8 },
    { x: 0.62, y: 0.94, width: 0.18, height: 0.025, slopeDeg: -3.5 },
    { x: 0.83, y: 0.94, width: 0.13, height: 0.025, slopeDeg: 1.8 }
  ]
};
