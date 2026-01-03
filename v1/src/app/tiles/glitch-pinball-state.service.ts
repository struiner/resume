import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  GLITCH_PINBALL_CONSTANTS,
  GLITCH_PINBALL_LAYOUT,
  BumperType,
  RampType,
  SequenceName,
  BumperDefinition,
  TargetDefinition,
  TrampolineDefinition,
  SmallSphereDefinition
} from './glitch-pinball-config';

interface Ball {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  active: boolean;
  hitCooldown: number;
}

interface LetterSequence {
  name: SequenceName;
  letters: string[];
  collected: boolean[];
  modeReady: boolean;
}

interface GameMode {
  name: string;
  active: boolean;
  timer: number;
  maxTimer: number;
}

interface GameState {
  score: number;
  multiplier: number;
  balls: number;
  currentBall: number;
  gameActive: boolean;
  ballSaveActive: boolean;
  ballSaveTimer: number;
  tiltWarning: number;
  tiltActive: boolean;
  letterSequences: LetterSequence[];
  modes: GameMode[];
  currentBalls: Ball[];
  highScore: number;
  statusMessage: string;
  leftFlipperActive: boolean;
  rightFlipperActive: boolean;
  controlsInverted: boolean;
  controlsInvertedTimer: number;
  glitchBumperHits: number;
  glitchNextJackpotDouble: boolean;
  megaBumperHits: number;
  extraBallLit: boolean;
  dataLockEnabled: boolean;
  dataLocks: number;
  dataJackpot: number;
  debugJackpot: number;
  overclockWindowTimer: number;
  overclockLeftHit: boolean;
  overclockRightHit: boolean;
  superLoopLit: boolean;
  poltergeistStage: 0 | 1 | 2 | 3;
  poltergeistHits: number;
  poltergeistTimer: number;
}

type BallUpdateResult =
  | { type: 'ok'; ball: Ball }
  | { type: 'drain' }
  | { type: 'lock' };

const MODE_DATA_MULTIBALL = 'DATA_MULTIBALL';
const MODE_OVERCLOCK = 'OVERCLOCK';
const MODE_DEBUG_ROUND = 'DEBUG_ROUND';
const MODE_POLTERGEIST = 'POLTERGEIST';

@Injectable({ providedIn: 'root' })
export class GlitchPinballStateService {
  private stateSubject: BehaviorSubject<GameState>;
  private playfield = { width: 0, height: 0 };
  private rngSeed = 1;

  constructor() {
    this.stateSubject = new BehaviorSubject<GameState>(this.createInitialState());
  }

  get state$(): Observable<GameState> {
    return this.stateSubject.asObservable();
  }

  get currentState(): GameState {
    return this.stateSubject.value;
  }

  setPlayfieldSize(width: number, height: number): void {
    this.playfield = { width, height };
  }

  startGame(): void {
    const base = this.createInitialState();
    base.gameActive = true;
    base.ballSaveActive = true;
    base.ballSaveTimer = GLITCH_PINBALL_CONSTANTS.ballSaveSeconds;
    base.currentBalls = [this.createBall(1)];
    base.statusMessage = 'GAME STARTED';
    base.highScore = this.currentState.highScore;

    this.rngSeed = Date.now() >>> 0;
    this.stateSubject.next(base);
  }

  endGame(): void {
    const state = this.currentState;
    const highScore = Math.max(state.score, state.highScore);
    localStorage.setItem('glitchPinballHighScore', highScore.toString());

    this.stateSubject.next({
      ...state,
      gameActive: false,
      highScore,
      statusMessage: 'GAME OVER'
    });
  }

  launchBall(strength: number = 1): void {
    const state = this.currentState;
    if (!state.gameActive) {
      return;
    }
    if (state.currentBalls.length === 0 && state.currentBall <= state.balls) {
      const clamped = Math.min(Math.max(strength, 0.1), 1);
      const newBall = this.createBall(state.currentBall);
      const launchScale = clamped * 3;
      newBall.dx = this.randomRange(
        GLITCH_PINBALL_CONSTANTS.ball.launchSpeed.minX * launchScale,
        GLITCH_PINBALL_CONSTANTS.ball.launchSpeed.maxX * launchScale
      );
      newBall.dy = this.randomRange(
        GLITCH_PINBALL_CONSTANTS.ball.launchSpeed.minY * launchScale,
        GLITCH_PINBALL_CONSTANTS.ball.launchSpeed.maxY * launchScale
      );
      this.stateSubject.next({
        ...state,
        currentBalls: [newBall],
        ballSaveActive: true,
        ballSaveTimer: GLITCH_PINBALL_CONSTANTS.ballSaveSeconds,
        statusMessage: 'BALL LAUNCHED'
      });
    }
  }

  step(deltaMs: number): void {
    const state = this.currentState;
    if (!state.gameActive || this.playfield.width === 0 || this.playfield.height === 0) {
      return;
    }

    const deltaSeconds = Math.min(deltaMs / 1000, 0.05);
    const nextState = this.cloneState(state);

    this.updateTimers(nextState, deltaSeconds);

    const updatedBalls: Ball[] = [];
    const totalBalls = nextState.currentBalls.length;
    nextState.currentBalls.forEach((ball, index) => {
      const remainingAfter = updatedBalls.length + (totalBalls - index - 1);
      const result = this.updateBall(ball, deltaSeconds, nextState);
      if (result.type === 'ok') {
        updatedBalls.push(result.ball);
      } else if (result.type === 'lock') {
        updatedBalls.push(...this.handleBallLock(nextState, remainingAfter));
      } else {
        updatedBalls.push(...this.handleBallDrain(nextState, remainingAfter));
      }
    });

    this.resolveBallCollisions(updatedBalls);
    nextState.currentBalls = updatedBalls;
    this.stateSubject.next(nextState);
  }

  setLeftFlipper(active: boolean): void {
    this.setFlipperState('left', active);
  }

  setRightFlipper(active: boolean): void {
    this.setFlipperState('right', active);
  }

  nudge(dx: number, dy: number): void {
    const state = this.currentState;
    if (!state.gameActive || state.tiltActive) {
      return;
    }

    const nudgedBalls = state.currentBalls.map((ball) => ({
      ...ball,
      dx: ball.dx + dx,
      dy: ball.dy + dy
    }));

    const nextState = {
      ...state,
      currentBalls: nudgedBalls
    };

    this.addTiltWarning(nextState, 1);
    nextState.statusMessage = 'TABLE NUDGED';

    this.stateSubject.next(nextState);
  }

  private setFlipperState(side: 'left' | 'right', active: boolean): void {
    const state = this.currentState;
    if (!state.gameActive || state.tiltActive) {
      return;
    }

    const inverted = state.controlsInverted;
    const targetSide = inverted ? (side === 'left' ? 'right' : 'left') : side;

    const nextState = {
      ...state,
      leftFlipperActive: targetSide === 'left' ? active : state.leftFlipperActive,
      rightFlipperActive: targetSide === 'right' ? active : state.rightFlipperActive
    };

    this.stateSubject.next(nextState);
  }

  private updateTimers(state: GameState, deltaSeconds: number): void {
    const overclockMode = this.getMode(state, MODE_OVERCLOCK);
    const debugMode = this.getMode(state, MODE_DEBUG_ROUND);
    const overclockWillExpire = Boolean(
      overclockMode?.active && overclockMode.timer - deltaSeconds <= 0
    );
    const debugWillExpire = Boolean(debugMode?.active && debugMode.timer - deltaSeconds <= 0);

    if (state.ballSaveActive) {
      state.ballSaveTimer = Math.max(0, state.ballSaveTimer - deltaSeconds);
      if (state.ballSaveTimer === 0) {
        state.ballSaveActive = false;
      }
    }

    if (state.controlsInvertedTimer > 0) {
      state.controlsInvertedTimer = Math.max(0, state.controlsInvertedTimer - deltaSeconds);
      if (state.controlsInvertedTimer === 0) {
        state.controlsInverted = false;
        state.statusMessage = 'GLITCH CLEARED';
      }
    }

    if (state.overclockWindowTimer > 0) {
      state.overclockWindowTimer = Math.max(0, state.overclockWindowTimer - deltaSeconds);
      if (state.overclockWindowTimer === 0) {
        state.overclockLeftHit = false;
        state.overclockRightHit = false;
      }
    }

    state.modes = state.modes.map((mode) => {
      if (!mode.active || mode.maxTimer <= 0) {
        return mode;
      }
      const newTimer = Math.max(0, mode.timer - deltaSeconds);
      if (newTimer === 0) {
        return { ...mode, active: false, timer: 0 };
      }
      return { ...mode, timer: newTimer };
    });

    if (overclockWillExpire) {
      this.endMode(state, MODE_OVERCLOCK, 'OVERCLOCK ENDED');
    }

    if (debugWillExpire) {
      this.endMode(state, MODE_DEBUG_ROUND, 'DEBUG ROUND ENDED');
    }

    if (this.isModeActive(state, MODE_POLTERGEIST) && state.poltergeistStage === 3) {
      state.poltergeistTimer = Math.max(0, state.poltergeistTimer - deltaSeconds);
      if (state.poltergeistTimer === 0) {
        this.endMode(state, MODE_POLTERGEIST, 'POLTERGEIST FAILED');
      }
    }
  }

  private updateBall(ball: Ball, deltaSeconds: number, state: GameState): BallUpdateResult {
    const { gravity, friction, wallBounce } = GLITCH_PINBALL_CONSTANTS.physics;
    const timeFactor = deltaSeconds * 60;

    const updatedBall: Ball = { ...ball };
    updatedBall.hitCooldown = Math.max(0, updatedBall.hitCooldown - deltaSeconds);

    updatedBall.dy += gravity * timeFactor;
    updatedBall.dx *= Math.pow(friction, timeFactor);
    updatedBall.dy *= Math.pow(friction, timeFactor);

    updatedBall.x += updatedBall.dx * timeFactor;
    updatedBall.y += updatedBall.dy * timeFactor;

    const { width, height } = this.playfield;

    if (updatedBall.x - updatedBall.radius < 0) {
      updatedBall.x = updatedBall.radius;
      updatedBall.dx = -updatedBall.dx * wallBounce;
    } else if (updatedBall.x + updatedBall.radius > width) {
      updatedBall.x = width - updatedBall.radius;
      updatedBall.dx = -updatedBall.dx * wallBounce;
    }

    if (updatedBall.y - updatedBall.radius < 0) {
      updatedBall.y = updatedBall.radius;
      updatedBall.dy = -updatedBall.dy * wallBounce;
    }

    this.checkFlipperCollision(updatedBall, state);
    this.checkBumperCollisions(updatedBall, state);
    this.checkSmallSphereCollisions(updatedBall);
    const locked = this.checkRampCollisions(updatedBall, state);
    this.checkTargetCollisions(updatedBall, state);
    this.checkTrampolineCollisions(updatedBall);
    this.checkCaptiveBall(updatedBall, state);

    if (this.isOutlane(updatedBall)) {
      if (state.extraBallLit) {
        state.extraBallLit = false;
        state.balls += 1;
        state.statusMessage = 'EXTRA BALL AWARDED';
      }
    }

    if (updatedBall.y - updatedBall.radius > height) {
      return { type: 'drain' };
    }

    if (locked) {
      return { type: 'lock' };
    }

    return { type: 'ok', ball: updatedBall };
  }

  private checkFlipperCollision(ball: Ball, state: GameState): void {
    if (ball.hitCooldown > 0) {
      return;
    }

    const { width, height } = this.playfield;
    const flipperConfig = GLITCH_PINBALL_CONSTANTS.flippers;
    const flipperLength = height * flipperConfig.length;
    const flipperThickness = width * flipperConfig.thickness;
    const flipperY = height * flipperConfig.y;

    if (state.leftFlipperActive) {
      const flipperX = width * flipperConfig.leftX;
      if (
        ball.x + ball.radius > flipperX &&
        ball.x - ball.radius < flipperX + flipperThickness &&
        ball.y + ball.radius > flipperY - flipperLength &&
        ball.y - ball.radius < flipperY
      ) {
        ball.dx = Math.abs(ball.dx) * GLITCH_PINBALL_CONSTANTS.physics.flipperKick;
        ball.dy = -Math.abs(ball.dy) * 0.8;
        ball.hitCooldown = 0.08;
      }
    }

    if (state.rightFlipperActive) {
      const flipperX = width * flipperConfig.rightX;
      if (
        ball.x + ball.radius > flipperX - flipperThickness &&
        ball.x - ball.radius < flipperX &&
        ball.y + ball.radius > flipperY - flipperLength &&
        ball.y - ball.radius < flipperY
      ) {
        ball.dx = -Math.abs(ball.dx) * GLITCH_PINBALL_CONSTANTS.physics.flipperKick;
        ball.dy = -Math.abs(ball.dy) * 0.8;
        ball.hitCooldown = 0.08;
      }
    }
  }

  private checkBumperCollisions(ball: Ball, state: GameState): void {
    const bumpers = GLITCH_PINBALL_LAYOUT.bumpers.map((bumper) =>
      this.scaleBumper(bumper)
    );

    bumpers.forEach((bumper) => {
      const distance = Math.hypot(ball.x - bumper.x, ball.y - bumper.y);
      if (distance < bumper.radius + ball.radius) {
        const angle = Math.atan2(ball.y - bumper.y, ball.x - bumper.x);
        const bounceForce = GLITCH_PINBALL_CONSTANTS.physics.bumperKick;
        ball.dx = Math.cos(angle) * bounceForce;
        ball.dy = Math.sin(angle) * bounceForce;

        if (ball.hitCooldown <= 0) {
          this.handleBumperHit(state, bumper.type);
          ball.hitCooldown = 0.12;
        }
      }
    });
  }

  private checkSmallSphereCollisions(ball: Ball): void {
    if (ball.hitCooldown > 0) {
      return;
    }
    const spheres = GLITCH_PINBALL_LAYOUT.smallSpheres.map((sphere) => this.scaleSmallSphere(sphere));

    spheres.forEach((sphere) => {
      const distance = Math.hypot(ball.x - sphere.x, ball.y - sphere.y);
      if (distance < sphere.radius + ball.radius) {
        const angle = Math.atan2(ball.y - sphere.y, ball.x - sphere.x);
        const bounceForce = GLITCH_PINBALL_CONSTANTS.physics.smallSphereKick;
        ball.dx = Math.cos(angle) * bounceForce;
        ball.dy = Math.sin(angle) * bounceForce;
        ball.hitCooldown = 0.08;
      }
    });
  }

  private checkRampCollisions(ball: Ball, state: GameState): boolean {
    if (ball.hitCooldown > 0) {
      return false;
    }

    const { ramps } = GLITCH_PINBALL_LAYOUT;
    const leftRamp = this.scaleRect(ramps.left);
    const rightRamp = this.scaleRect(ramps.right);
    const centerRamp = this.scaleRect(ramps.center);

    if (this.isInsideRect(ball, leftRamp) && ball.dy > 0) {
      ball.dx = 2;
      ball.dy = -3.2;
      this.handleRampHit(state, 'left');
      ball.hitCooldown = 0.15;
      return false;
    }

    if (this.isInsideRect(ball, rightRamp) && ball.dy > 0) {
      ball.dx = -2;
      ball.dy = -3.2;
      this.handleRampHit(state, 'right');
      ball.hitCooldown = 0.15;
      return false;
    }

    if (this.isInsideRect(ball, centerRamp) && ball.dy > 0) {
      ball.dx = this.randomRange(-2, 2);
      ball.dy = -6;
      const locked = this.handleRampHit(state, 'center');
      ball.hitCooldown = 0.2;
      return locked;
    }

    return false;
  }

  private checkTargetCollisions(ball: Ball, state: GameState): void {
    if (ball.hitCooldown > 0) {
      return;
    }

    const targets = GLITCH_PINBALL_LAYOUT.targets.map((target) => this.scaleTarget(target));
    for (const target of targets) {
      if (this.isInsideRect(ball, target)) {
        this.handleTargetHit(state, target);
        ball.dx = -ball.dx * 0.8;
        ball.dy = -Math.abs(ball.dy) * 0.6;
        ball.hitCooldown = 0.12;
        break;
      }
    }
  }

  private checkTrampolineCollisions(ball: Ball): void {
    if (ball.hitCooldown > 0 || ball.dy <= 0) {
      return;
    }

    const trampolines = GLITCH_PINBALL_LAYOUT.trampolines.map((trampoline) =>
      this.scaleTrampoline(trampoline)
    );

    for (const trampoline of trampolines) {
      if (this.isInsideRect(ball, trampoline)) {
        const bounce = Math.abs(ball.dy) * GLITCH_PINBALL_CONSTANTS.physics.trampolineKick;
        const slopeRadians = (trampoline.slopeDeg * Math.PI) / 180;
        ball.dy = -bounce;
        ball.dx += Math.sin(slopeRadians) * bounce * 0.4;
        ball.dx *= 0.95;
        ball.hitCooldown = 0.1;
        break;
      }
    }
  }

  private checkCaptiveBall(ball: Ball, state: GameState): void {
    if (ball.hitCooldown > 0) {
      return;
    }

    const captive = this.scaleRect(GLITCH_PINBALL_LAYOUT.captiveBall);
    if (!this.isInsideRect(ball, captive)) {
      return;
    }

    const ghostSequence = this.getSequence(state, 'GHOST');
    if (ghostSequence?.modeReady && !this.anyModeActive(state)) {
      this.startMode(state, MODE_POLTERGEIST);
      ball.dx = -ball.dx * 0.7;
      ball.dy = -Math.abs(ball.dy) * 0.7;
      ball.hitCooldown = 0.2;
    }
  }

  private handleBumperHit(state: GameState, type: BumperType): void {
    const baseScore = GLITCH_PINBALL_CONSTANTS.scores.bumpers[type];
    if (this.isModeActive(state, MODE_POLTERGEIST) && state.poltergeistStage === 1) {
      this.addScore(state, GLITCH_PINBALL_CONSTANTS.poltergeist.stageOneAward, false);
      this.advancePoltergeistStage(state, 'major');
    } else {
      this.addScore(state, baseScore, this.isModeActive(state, MODE_OVERCLOCK));
    }

    if (type === 'glitch') {
      state.glitchBumperHits += 1;
      if (state.glitchBumperHits % 3 === 0) {
        state.controlsInverted = true;
        state.controlsInvertedTimer = GLITCH_PINBALL_CONSTANTS.glitchInvertSeconds;
        state.statusMessage = 'GLITCH EVENT: CONTROLS INVERTED';
      }

      if (this.isModeActive(state, MODE_DATA_MULTIBALL)) {
        state.glitchNextJackpotDouble = true;
      }

      if (this.isModeActive(state, MODE_DEBUG_ROUND)) {
        const mode = this.getMode(state, MODE_DEBUG_ROUND);
        if (mode) {
          mode.timer = Math.max(0, mode.timer - GLITCH_PINBALL_CONSTANTS.debugRound.glitchTimePenalty);
        }
        state.debugJackpot += GLITCH_PINBALL_CONSTANTS.debugRound.glitchJackpotBonus;
        state.statusMessage = 'DEBUG JACKPOT BOOSTED';
      }
    }

    if (type === 'mega') {
      state.megaBumperHits += 1;
      if (state.megaBumperHits >= 5 && !state.extraBallLit) {
        state.extraBallLit = true;
        state.megaBumperHits = 0;
        state.statusMessage = 'EXTRA BALL LIT';
      }
    }
  }

  private handleRampHit(state: GameState, ramp: RampType): boolean {
    const baseScore = GLITCH_PINBALL_CONSTANTS.scores.ramps[ramp];

    if (this.isModeActive(state, MODE_DATA_MULTIBALL)) {
      const jackpotBase = state.dataJackpot;
      const jackpot = state.glitchNextJackpotDouble ? jackpotBase * 2 : jackpotBase;
      state.glitchNextJackpotDouble = false;
      this.addScore(state, jackpot, false);
      state.statusMessage = `${ramp.toUpperCase()} RAMP JACKPOT: ${jackpot}`;
      state.dataJackpot += GLITCH_PINBALL_CONSTANTS.dataMultiball.jackpotStep;
      return false;
    }

    if (this.isModeActive(state, MODE_DEBUG_ROUND)) {
      this.addScore(state, state.debugJackpot, false);
      state.statusMessage = `${ramp.toUpperCase()} JACKPOT: ${state.debugJackpot}`;
      state.debugJackpot += GLITCH_PINBALL_CONSTANTS.debugRound.jackpotStep;
      return false;
    }

    if (this.isModeActive(state, MODE_POLTERGEIST)) {
      const isCenter = ramp === 'center';
      const award =
        state.poltergeistStage === 3 && isCenter
          ? GLITCH_PINBALL_CONSTANTS.poltergeist.stageThreeAward
          : GLITCH_PINBALL_CONSTANTS.poltergeist.stageOneAward;
      this.addScore(state, award, false);
      if (state.poltergeistStage === 1) {
        this.advancePoltergeistStage(state, 'major');
      }
      if (state.poltergeistStage === 3 && ramp === 'center') {
        state.poltergeistHits += 1;
        if (state.poltergeistHits >= GLITCH_PINBALL_CONSTANTS.poltergeist.stageThreeShots) {
          this.completePoltergeist(state);
        }
      }
      return false;
    }

    this.addScore(state, baseScore, this.isModeActive(state, MODE_OVERCLOCK));

    if (ramp === 'left' || ramp === 'right') {
      state.multiplier = Math.min(
        state.multiplier + GLITCH_PINBALL_CONSTANTS.multiplier.step,
        GLITCH_PINBALL_CONSTANTS.multiplier.max
      );

      if (state.overclockWindowTimer > 0) {
        if (ramp === 'left') {
          state.overclockLeftHit = true;
        }
        if (ramp === 'right') {
          state.overclockRightHit = true;
        }
        if (state.overclockLeftHit && state.overclockRightHit && !this.anyModeActive(state)) {
          this.startMode(state, MODE_OVERCLOCK);
        }
      }

      if (this.isModeActive(state, MODE_OVERCLOCK) && state.superLoopLit) {
        this.addScore(state, GLITCH_PINBALL_CONSTANTS.overclock.superLoopAward, false);
        state.superLoopLit = false;
        state.statusMessage = 'SUPER LOOP COLLECTED';
      }
      return false;
    }

    if (ramp === 'center') {
      state.multiplier = GLITCH_PINBALL_CONSTANTS.multiplier.reset;

      if (state.dataLockEnabled && !this.anyModeActive(state)) {
        if (state.dataLocks < GLITCH_PINBALL_CONSTANTS.dataMultiball.locksRequired) {
          state.dataLocks += 1;
          state.statusMessage = `DATA LOCK ${state.dataLocks}/2`;
          return true;
        }
        if (state.dataLocks >= GLITCH_PINBALL_CONSTANTS.dataMultiball.locksRequired) {
          this.startMode(state, MODE_DATA_MULTIBALL);
          return false;
        }
      }

      if (this.canStartDebugRound(state) && !this.anyModeActive(state)) {
        this.startMode(state, MODE_DEBUG_ROUND);
        return false;
      }
    }

    return false;
  }

  private handleTargetHit(state: GameState, target: TargetDefinition): void {
    const sequence = this.getSequence(state, target.sequence);
    if (!sequence) {
      return;
    }

    if (this.isModeActive(state, MODE_POLTERGEIST) && state.poltergeistStage === 2 && target.sequence === 'GHOST') {
      this.addScore(state, GLITCH_PINBALL_CONSTANTS.poltergeist.stageTwoAward, false);
      this.advancePoltergeistStage(state, 'ghost');
    }

    if (sequence.collected[target.letterIndex]) {
      return;
    }

    sequence.collected[target.letterIndex] = true;
    this.addScore(state, GLITCH_PINBALL_CONSTANTS.scores.letters, false);

    if (sequence.collected.every((collected) => collected)) {
      sequence.modeReady = true;
      state.statusMessage = `${sequence.name} COMPLETE`;

      if (sequence.name === 'BYTE') {
        state.dataLockEnabled = true;
      }

      if (sequence.name === 'CIRCUIT') {
        state.overclockWindowTimer = GLITCH_PINBALL_CONSTANTS.overclock.triggerWindow;
        state.overclockLeftHit = false;
        state.overclockRightHit = false;
      }
    } else {
      state.statusMessage = `LETTER LIT: ${sequence.name}`;
    }
  }

  private handleBallDrain(state: GameState, remainingAfter: number): Ball[] {
    if (state.ballSaveActive) {
      state.ballSaveActive = false;
      state.ballSaveTimer = 0;
      state.statusMessage = 'BALL SAVED';
      return [this.createBall(state.currentBall)];
    }

    if (this.isModeActive(state, MODE_DATA_MULTIBALL)) {
      if (remainingAfter <= 1) {
        this.endMode(state, MODE_DATA_MULTIBALL, 'MULTIBALL ENDED');
      }
    }

    if (remainingAfter > 0) {
      return [];
    }

    this.resetLetters(state);
    state.multiplier = GLITCH_PINBALL_CONSTANTS.multiplier.reset;
    state.dataLockEnabled = false;
    state.dataLocks = 0;
    state.overclockWindowTimer = 0;
    state.overclockLeftHit = false;
    state.overclockRightHit = false;
    state.superLoopLit = false;
    this.deactivateAllModes(state);

    if (state.currentBall < state.balls) {
      state.currentBall += 1;
      state.statusMessage = 'NEXT BALL';
      return [];
    }

    this.finalizeGame(state);
    return [];
  }

  private handleBallLock(state: GameState, remainingAfter: number): Ball[] {
    if (remainingAfter > 0) {
      return [];
    }
    return [this.createBall(state.currentBall)];
  }

  private addScore(state: GameState, points: number, applyOverclock: boolean): void {
    const multiplier = state.multiplier;
    const overclockMultiplier = applyOverclock ? GLITCH_PINBALL_CONSTANTS.overclock.scoreMultiplier : 1;
    state.score += Math.floor(points * multiplier * overclockMultiplier);
  }

  private addTiltWarning(state: GameState, amount: number): void {
    state.tiltWarning += amount;
    if (state.tiltWarning >= GLITCH_PINBALL_CONSTANTS.tiltWarnings && !state.tiltActive) {
      state.tiltActive = true;
      state.currentBalls = [];
      state.statusMessage = 'TILT';
      if (state.currentBall < state.balls) {
        state.currentBall += 1;
      } else {
        this.finalizeGame(state);
      }
    }
  }

  private startMode(state: GameState, modeName: string): void {
    if (modeName === MODE_DATA_MULTIBALL) {
      this.startDataMultiball(state);
      return;
    }

    if (modeName === MODE_OVERCLOCK) {
      this.activateMode(state, MODE_OVERCLOCK, GLITCH_PINBALL_CONSTANTS.overclock.duration);
      state.overclockWindowTimer = 0;
      state.overclockLeftHit = false;
      state.overclockRightHit = false;
      state.superLoopLit = true;
      this.resetSequence(state, 'CIRCUIT');
      state.statusMessage = 'OVERCLOCK ACTIVATED';
      return;
    }

    if (modeName === MODE_DEBUG_ROUND) {
      this.activateMode(state, MODE_DEBUG_ROUND, GLITCH_PINBALL_CONSTANTS.debugRound.duration);
      state.debugJackpot = GLITCH_PINBALL_CONSTANTS.debugRound.jackpotStart;
      this.resetSequence(state, 'HACK');
      state.statusMessage = 'DEBUG ROUND STARTED';
      return;
    }

    if (modeName === MODE_POLTERGEIST) {
      this.activateMode(state, MODE_POLTERGEIST, 0);
      state.poltergeistStage = 1;
      state.poltergeistHits = 0;
      state.poltergeistTimer = 0;
      this.resetSequence(state, 'GHOST');
      state.statusMessage = 'POLTERGEIST: MANIFEST';
      return;
    }
  }

  private startDataMultiball(state: GameState): void {
    this.activateMode(state, MODE_DATA_MULTIBALL, 0);
    state.dataJackpot = GLITCH_PINBALL_CONSTANTS.dataMultiball.jackpotStart;
    state.glitchNextJackpotDouble = false;
    state.dataLocks = 0;
    state.dataLockEnabled = false;
    this.resetSequence(state, 'BYTE');

    const targetCount = GLITCH_PINBALL_CONSTANTS.dataMultiball.balls;
    while (state.currentBalls.length < targetCount) {
      state.currentBalls.push(this.createBall(state.currentBall));
    }
    state.statusMessage = 'DATA MULTIBALL';
  }

  private completePoltergeist(state: GameState): void {
    state.balls += 1;
    this.endMode(state, MODE_POLTERGEIST, 'POLTERGEIST COMPLETE');
    state.statusMessage = 'POLTERGEIST COMPLETE: EXTRA BALL';
  }

  private endMode(state: GameState, modeName: string, message: string): void {
    this.activateMode(state, modeName, 0, false);
    if (modeName === MODE_POLTERGEIST) {
      state.poltergeistStage = 0;
      state.poltergeistHits = 0;
      state.poltergeistTimer = 0;
    }
    state.statusMessage = message;
  }

  private deactivateAllModes(state: GameState): void {
    state.modes = state.modes.map((mode) => ({ ...mode, active: false, timer: 0 }));
    state.poltergeistStage = 0;
    state.poltergeistHits = 0;
    state.poltergeistTimer = 0;
  }

  private activateMode(state: GameState, modeName: string, timer: number, active: boolean = true): void {
    state.modes = state.modes.map((mode) => {
      if (mode.name === modeName) {
        return { ...mode, active, timer };
      }
      return { ...mode, active: false, timer: 0 };
    });

    if (!active) {
      return;
    }

    if (modeName === MODE_POLTERGEIST) {
      state.poltergeistStage = 1;
      state.poltergeistHits = 0;
    }
  }

  private getMode(state: GameState, modeName: string): GameMode | undefined {
    return state.modes.find((mode) => mode.name === modeName);
  }

  private isModeActive(state: GameState, modeName: string): boolean {
    return Boolean(this.getMode(state, modeName)?.active);
  }

  private anyModeActive(state: GameState): boolean {
    return state.modes.some((mode) => mode.active);
  }

  private getSequence(state: GameState, name: SequenceName): LetterSequence | undefined {
    return state.letterSequences.find((sequence) => sequence.name === name);
  }

  private resetLetters(state: GameState): void {
    state.letterSequences = state.letterSequences.map((sequence) => ({
      ...sequence,
      collected: sequence.collected.map(() => false),
      modeReady: false
    }));
  }

  private resetSequence(state: GameState, name: SequenceName): void {
    state.letterSequences = state.letterSequences.map((sequence) => {
      if (sequence.name !== name) {
        return sequence;
      }
      return {
        ...sequence,
        collected: sequence.collected.map(() => false),
        modeReady: false
      };
    });
  }

  private canStartDebugRound(state: GameState): boolean {
    const hackSequence = this.getSequence(state, 'HACK');
    return Boolean(hackSequence?.modeReady);
  }

  private sequenceToMode(sequence: SequenceName): string | null {
    switch (sequence) {
      case 'BYTE':
        return MODE_DATA_MULTIBALL;
      case 'CIRCUIT':
        return MODE_OVERCLOCK;
      case 'HACK':
        return MODE_DEBUG_ROUND;
      case 'GHOST':
        return MODE_POLTERGEIST;
      default:
        return null;
    }
  }

  private isInsideRect(ball: Ball, rect: { x: number; y: number; width: number; height: number }): boolean {
    return (
      ball.x + ball.radius > rect.x &&
      ball.x - ball.radius < rect.x + rect.width &&
      ball.y + ball.radius > rect.y &&
      ball.y - ball.radius < rect.y + rect.height
    );
  }

  private isOutlane(ball: Ball): boolean {
    const outlanes = GLITCH_PINBALL_LAYOUT.outlanes.map((outlane) => this.scaleRect(outlane));
    return outlanes.some((lane) => this.isInsideRect(ball, lane));
  }

  private scaleRect(rect: { x: number; y: number; width: number; height: number }): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    return {
      x: rect.x * this.playfield.width,
      y: rect.y * this.playfield.height,
      width: rect.width * this.playfield.width,
      height: rect.height * this.playfield.height
    };
  }

  private scaleBumper(bumper: BumperDefinition): { x: number; y: number; radius: number; type: BumperType } {
    const size = Math.min(this.playfield.width, this.playfield.height);
    return {
      x: bumper.x * this.playfield.width,
      y: bumper.y * this.playfield.height,
      radius: bumper.radius * size,
      type: bumper.type
    };
  }

  private scaleTarget(target: TargetDefinition): TargetDefinition {
    return {
      ...target,
      x: target.x * this.playfield.width,
      y: target.y * this.playfield.height,
      width: target.width * this.playfield.width,
      height: target.height * this.playfield.height
    };
  }

  private scaleTrampoline(trampoline: TrampolineDefinition): TrampolineDefinition {
    return {
      ...trampoline,
      x: trampoline.x * this.playfield.width,
      y: trampoline.y * this.playfield.height,
      width: trampoline.width * this.playfield.width,
      height: trampoline.height * this.playfield.height
    };
  }

  private scaleSmallSphere(sphere: SmallSphereDefinition): SmallSphereDefinition {
    const size = Math.min(this.playfield.width, this.playfield.height);
    return {
      ...sphere,
      x: sphere.x * this.playfield.width,
      y: sphere.y * this.playfield.height,
      radius: sphere.radius * size
    };
  }

  private createInitialState(): GameState {
    return {
      score: 0,
      multiplier: 1,
      balls: 3,
      currentBall: 1,
      gameActive: false,
      ballSaveActive: false,
      ballSaveTimer: 0,
      tiltWarning: 0,
      tiltActive: false,
      letterSequences: [
        { name: 'BYTE', letters: ['B', 'Y', 'T', 'E'], collected: [false, false, false, false], modeReady: false },
        {
          name: 'CIRCUIT',
          letters: ['C', 'I', 'R', 'C', 'U', 'I', 'T'],
          collected: [false, false, false, false, false, false, false],
          modeReady: false
        },
        { name: 'HACK', letters: ['H', 'A', 'C', 'K'], collected: [false, false, false, false], modeReady: false },
        { name: 'GHOST', letters: ['G', 'H', 'O', 'S', 'T'], collected: [false, false, false, false, false], modeReady: false }
      ],
      modes: [
        { name: MODE_DATA_MULTIBALL, active: false, timer: 0, maxTimer: 0 },
        { name: MODE_OVERCLOCK, active: false, timer: 0, maxTimer: GLITCH_PINBALL_CONSTANTS.overclock.duration },
        { name: MODE_DEBUG_ROUND, active: false, timer: 0, maxTimer: GLITCH_PINBALL_CONSTANTS.debugRound.duration },
        { name: MODE_POLTERGEIST, active: false, timer: 0, maxTimer: 0 }
      ],
      currentBalls: [],
      highScore: this.getStoredHighScore(),
      statusMessage: 'READY TO LAUNCH',
      leftFlipperActive: false,
      rightFlipperActive: false,
      controlsInverted: false,
      controlsInvertedTimer: 0,
      glitchBumperHits: 0,
      glitchNextJackpotDouble: false,
      megaBumperHits: 0,
      extraBallLit: false,
      dataLockEnabled: false,
      dataLocks: 0,
      dataJackpot: GLITCH_PINBALL_CONSTANTS.dataMultiball.jackpotStart,
      debugJackpot: GLITCH_PINBALL_CONSTANTS.debugRound.jackpotStart,
      overclockWindowTimer: 0,
      overclockLeftHit: false,
      overclockRightHit: false,
      superLoopLit: false,
      poltergeistStage: 0,
      poltergeistHits: 0,
      poltergeistTimer: 0
    };
  }

  private getStoredHighScore(): number {
    const stored = localStorage.getItem('glitchPinballHighScore');
    if (!stored) {
      return 0;
    }
    const parsed = parseInt(stored, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private createBall(ballNumber: number): Ball {
    const spawnX = this.playfield.width
      ? this.playfield.width * GLITCH_PINBALL_LAYOUT.plungerStart.x
      : 50;
    const spawnY = this.playfield.height
      ? this.playfield.height * GLITCH_PINBALL_LAYOUT.plungerStart.y
      : 90;

    return {
      id: Date.now() + ballNumber + Math.floor(this.nextRandom() * 1000),
      x: spawnX,
      y: spawnY,
      dx: 0,
      dy: 0,
      radius: GLITCH_PINBALL_CONSTANTS.ball.radius,
      active: true,
      hitCooldown: 0
    };
  }

  private cloneState(source: GameState): GameState {
    return {
      ...source,
      letterSequences: source.letterSequences.map((sequence) => ({
        ...sequence,
        collected: [...sequence.collected]
      })),
      modes: source.modes.map((mode) => ({ ...mode })),
      currentBalls: source.currentBalls.map((ball) => ({ ...ball }))
    };
  }

  private nextRandom(): number {
    this.rngSeed = (this.rngSeed * 1664525 + 1013904223) % 4294967296;
    return this.rngSeed / 4294967296;
  }

  private randomRange(min: number, max: number): number {
    return min + (max - min) * this.nextRandom();
  }

  private resolveBallCollisions(balls: Ball[]): void {
    for (let i = 0; i < balls.length; i += 1) {
      for (let j = i + 1; j < balls.length; j += 1) {
        const first = balls[i];
        const second = balls[j];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.hypot(dx, dy);
        const minDistance = first.radius + second.radius;

        if (distance === 0 || distance >= minDistance) {
          continue;
        }

        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = minDistance - distance;

        first.x -= nx * overlap * 0.5;
        first.y -= ny * overlap * 0.5;
        second.x += nx * overlap * 0.5;
        second.y += ny * overlap * 0.5;

        const rvx = second.dx - first.dx;
        const rvy = second.dy - first.dy;
        const velAlongNormal = rvx * nx + rvy * ny;

        if (velAlongNormal > 0) {
          continue;
        }

        const restitution = 0.9;
        const impulse = (-(1 + restitution) * velAlongNormal) / 2;

        first.dx -= impulse * nx;
        first.dy -= impulse * ny;
        second.dx += impulse * nx;
        second.dy += impulse * ny;
      }
    }
  }

  private finalizeGame(state: GameState): void {
    const highScore = Math.max(state.score, state.highScore);
    localStorage.setItem('glitchPinballHighScore', highScore.toString());
    state.gameActive = false;
    state.highScore = highScore;
    state.statusMessage = 'GAME OVER';
  }

  private advancePoltergeistStage(state: GameState, hitType: 'major' | 'ghost'): void {
    if (!this.isModeActive(state, MODE_POLTERGEIST)) {
      return;
    }

    if (state.poltergeistStage === 1 && hitType === 'major') {
      state.poltergeistHits += 1;
      if (state.poltergeistHits >= GLITCH_PINBALL_CONSTANTS.poltergeist.stageOneShots) {
        state.poltergeistStage = 2;
        state.poltergeistHits = 0;
        state.statusMessage = 'POLTERGEIST: POSSESS';
      }
      return;
    }

    if (state.poltergeistStage === 2 && hitType === 'ghost') {
      state.poltergeistHits += 1;
      if (state.poltergeistHits >= GLITCH_PINBALL_CONSTANTS.poltergeist.stageTwoShots) {
        state.poltergeistStage = 3;
        state.poltergeistHits = 0;
        state.poltergeistTimer = GLITCH_PINBALL_CONSTANTS.poltergeist.stageThreeTimer;
        state.statusMessage = 'POLTERGEIST: EXORCISE';
      }
    }
  }
}
