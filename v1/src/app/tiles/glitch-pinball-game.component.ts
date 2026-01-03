import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlitchPinballStateService } from './glitch-pinball-state.service';
import { GLITCH_PINBALL_CONSTANTS, GLITCH_PINBALL_LAYOUT, SequenceName } from './glitch-pinball-config';

@Component({
  selector: 'glitch-pinball-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pinball-game-container" #gameContainer>
      <div class="pinball-playfield" #playfield>
        <canvas #pinballCanvas class="pinball-canvas"></canvas>

        <!-- UI Elements -->
        <div class="pinball-ui">
          <div class="top-bar">
            <div class="table-name">GLITCH.IO</div>
            <div class="score-display">Score: {{ stateService.currentState.score }}</div>
            <div class="balls-display">Balls: {{ stateService.currentState.currentBall }}/{{ stateService.currentState.balls }}</div>
            <div class="multiplier-display">I-{{ stateService.currentState.multiplier }}</div>
          </div>

          <div class="right-panel">
            <div class="letter-sequences">
              @for (sequence of stateService.currentState.letterSequences; track sequence.name) {
                <div class="letter-sequence">
                  <div class="sequence-name">{{ sequence.name }}</div>
                  <div class="sequence-letters">
                    @for (letter of sequence.letters; track $index) {
                      <span class="letter" [class.collected]="sequence.collected[$index]">{{ letter }}</span>
                    }
                  </div>
                  <div class="mode-status" [class.ready]="sequence.modeReady">
                    {{ sequence.modeReady ? 'READY!' : '---' }}
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="bottom-status">
            <div class="status-message">{{ stateService.currentState.statusMessage }}</div>
          </div>
        </div>

        <!-- Touch Controls -->
        <div class="touch-controls">
          <button class="flipper-control left-flipper" (touchstart)="activateLeftFlipper()" (touchend)="deactivateLeftFlipper()">
            Left Flipper
          </button>
          <button class="flipper-control right-flipper" (touchstart)="activateRightFlipper()" (touchend)="deactivateRightFlipper()">
            Right Flipper
          </button>
          <button
            class="plunger-control"
            (mousedown)="startLaunchCharge()"
            (mouseup)="releaseLaunchCharge()"
            (mouseleave)="releaseLaunchCharge()"
            (touchstart)="startLaunchCharge()"
            (touchend)="releaseLaunchCharge()">
            Launch Ball
          </button>
        </div>
      </div>

      <!-- Game Over Overlay -->
      @if (!stateService.currentState.gameActive && stateService.currentState.score > 0) {
        <div class="game-over-overlay">
          <div class="game-over-content">
            <h2>GAME OVER</h2>
            <div class="final-score">Final Score: {{ stateService.currentState.score }}</div>
            <div class="high-score">High Score: {{ stateService.currentState.highScore }}</div>
            <button class="restart-button" (click)="startGame()">Play Again</button>
          </div>
        </div>
      }

      <!-- Start Screen -->
      @if (!stateService.currentState.gameActive && stateService.currentState.score === 0) {
        <div class="start-overlay">
          <div class="start-content">
            <h2>GLITCH.IO PINBALL</h2>
            <p>Classic Pinball Fantasies-style gameplay</p>
            <button class="start-button" (click)="startGame()">Start Game</button>
            <div class="instructions">
              <p>Controls: Z/Left Arrow (Left Flipper), Slash/Right Arrow (Right Flipper), Space (Launch)</p>
              <p>Spell BYTE, CIRCUIT, HACK, GHOST to unlock modes!</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
    .pinball-game-container {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
      font-family: 'Arial', sans-serif;
    }

    .pinball-playfield {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .pinball-canvas {
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, #0f0f1a 0%, #000000 100%);
      border: 2px solid #00ffff;
      border-radius: 8px;
    }

    .pinball-ui {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background: linear-gradient(to right, #000428, #004e92);
      color: #00ffff;
      font-size: 1.1rem;
      border-bottom: 2px solid #00ffff;
    }

    .right-panel {
      position: absolute;
      right: 16px;
      top: 50px;
      bottom: 50px;
      width: 180px;
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid #00ffff;
      border-radius: 8px;
      padding: 12px;
      overflow-y: auto;
      pointer-events: auto;
    }

    .letter-sequences {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .letter-sequence {
      background: rgba(0, 78, 146, 0.3);
      border: 1px solid #00ffff;
      border-radius: 4px;
      padding: 8px;
    }

    .sequence-name {
      font-size: 0.9rem;
      font-weight: bold;
      color: #00ffff;
      margin-bottom: 4px;
      text-align: center;
    }

    .sequence-letters {
      display: flex;
      justify-content: space-between;
      gap: 4px;
    }

    .letter {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a2e;
      border: 1px solid #00ffff;
      border-radius: 4px;
      color: #00ffff;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .letter.collected {
      background: #00ffff;
      color: #000;
    }

    .mode-status {
      text-align: center;
      margin-top: 4px;
      font-size: 0.8rem;
      color: #ff0000;
      font-weight: bold;
    }

    .mode-status.ready {
      color: #00ff00;
    }

    .bottom-status {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid #00ffff;
      border-radius: 4px;
      padding: 8px 16px;
      color: #00ffff;
      font-size: 1rem;
      text-align: center;
      min-width: 200px;
    }

    .touch-controls {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      pointer-events: auto;
      z-index: 100;
    }

    .flipper-control {
      background: rgba(0, 78, 146, 0.8);
      border: 2px solid #00ffff;
      border-radius: 20px;
      padding: 12px 24px;
      color: #00ffff;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.1s;
    }

    .flipper-control:active {
      background: rgba(0, 150, 255, 0.8);
      transform: scale(0.95);
    }

    .plunger-control {
      background: rgba(78, 0, 146, 0.8);
      border: 2px solid #ff00ff;
      border-radius: 20px;
      padding: 12px 24px;
      color: #ff00ff;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.1s;
    }

    .plunger-control:active {
      background: rgba(150, 0, 255, 0.8);
      transform: scale(0.95);
    }

    .game-over-overlay, .start-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 200;
      pointer-events: auto;
    }

    .game-over-content, .start-content {
      background: linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%);
      border: 3px solid #00ffff;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      max-width: 500px;
      width: 80%;
    }

    .game-over-content h2, .start-content h2 {
      color: #ff00ff;
      font-size: 2.5rem;
      margin-bottom: 24px;
      text-shadow: 0 0 10px #ff00ff;
    }

    .final-score, .high-score {
      color: #00ffff;
      font-size: 1.5rem;
      margin: 12px 0;
    }

    .restart-button, .start-button {
      background: linear-gradient(45deg, #ff00ff, #00ffff);
      border: none;
      border-radius: 25px;
      padding: 16px 32px;
      color: white;
      font-size: 1.2rem;
      font-weight: bold;
      cursor: pointer;
      margin: 24px 0 16px;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .restart-button:hover, .start-button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
    }

    .instructions {
      color: #00ffff;
      font-size: 0.9rem;
      margin-top: 24px;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .touch-controls {
        bottom: 60px;
      }

      .right-panel {
        width: 140px;
        font-size: 0.8rem;
      }

      .letter {
        width: 16px;
        height: 16px;
        font-size: 0.7rem;
      }
    }
    `
  ]
})
export class GlitchPinballGameComponent implements OnInit, OnDestroy {
  @ViewChild('pinballCanvas', { static: true }) pinballCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D;
  private gameLoopId = 0;
  private lastTime = 0;
  private resizeObserver?: ResizeObserver;
  private launchChargeStart: number | null = null;

  constructor(public stateService: GlitchPinballStateService) {}

  ngOnInit(): void {
    this.initCanvas();
    this.setupGameLoop();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initCanvas(): void {
    const canvas = this.pinballCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.resizeCanvas();
    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(this.gameContainer.nativeElement);
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const container = this.gameContainer.nativeElement;
    const canvas = this.pinballCanvas.nativeElement;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    this.stateService.setPlayfieldSize(canvas.width, canvas.height);
    this.drawPlayfield();
  }

  private setupGameLoop(): void {
    const gameLoop = (timestamp: number) => {
      if (!this.lastTime) {
        this.lastTime = timestamp;
      }

      const deltaTime = timestamp - this.lastTime;
      this.lastTime = timestamp;

      this.stateService.step(deltaTime);
      this.drawPlayfield();

      this.gameLoopId = requestAnimationFrame(gameLoop);
    };

    this.gameLoopId = requestAnimationFrame(gameLoop);
  }

  private drawPlayfield(): void {
    const canvas = this.pinballCanvas.nativeElement;
    const ctx = this.ctx;
    const state = this.stateService.currentState;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f0f1a');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.drawRamps();
    this.drawSmallSpheres();
    this.drawTrampolines();
    this.drawTargets();
    this.drawBumpers();
    this.drawFlippers(state);

    state.currentBalls.forEach((ball) => this.drawBall(ball));

    if (state.modes.some((mode) => mode.active) || state.controlsInverted) {
      this.drawGlitchEffects();
    }
  }

  private drawBall(ball: { x: number; y: number; radius: number }): void {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(ball.x, ball.y + 2, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    const ballGradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(1, '#cccccc');

    ctx.fillStyle = ballGradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ball.x - 3, ball.y - 3, ball.radius / 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
  }

  private drawFlippers(state: { leftFlipperActive: boolean; rightFlipperActive: boolean }): void {
    const ctx = this.ctx;
    const canvas = this.pinballCanvas.nativeElement;
    const config = GLITCH_PINBALL_CONSTANTS.flippers;

    const flipperLength = canvas.height * config.length;
    const flipperThickness = canvas.width * config.thickness;
    const flipperY = canvas.height * config.y;

    const restAngle = this.toRadians(config.restAngle);
    const activeAngle = this.toRadians(config.activeAngle);

    ctx.save();
    ctx.translate(canvas.width * config.leftX, flipperY);
    ctx.rotate(-(state.leftFlipperActive ? activeAngle : restAngle));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -flipperLength);
    ctx.lineTo(flipperThickness, -flipperLength);
    ctx.lineTo(flipperThickness, 0);
    ctx.closePath();
    ctx.fillStyle = '#00ffff';
    ctx.fill();
    ctx.strokeStyle = '#00aaaa';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(canvas.width * config.rightX, flipperY);
    ctx.rotate(state.rightFlipperActive ? activeAngle : restAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -flipperLength);
    ctx.lineTo(-flipperThickness, -flipperLength);
    ctx.lineTo(-flipperThickness, 0);
    ctx.closePath();
    ctx.fillStyle = '#00ffff';
    ctx.fill();
    ctx.strokeStyle = '#00aaaa';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  private drawBumpers(): void {
    const ctx = this.ctx;
    const canvas = this.pinballCanvas.nativeElement;

    GLITCH_PINBALL_LAYOUT.bumpers.forEach((bumper) => {
      const x = bumper.x * canvas.width;
      const y = bumper.y * canvas.height;
      const radius = bumper.radius * Math.min(canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      if (bumper.type === 'mega') {
        gradient.addColorStop(0, '#ff9900');
        gradient.addColorStop(1, '#8a5500');
      } else if (bumper.type === 'glitch') {
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(1, '#008a8a');
      } else {
        gradient.addColorStop(0, '#ff00ff');
        gradient.addColorStop(1, '#8a008a');
      }

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  private drawRamps(): void {
    const ctx = this.ctx;
    const canvas = this.pinballCanvas.nativeElement;

    const left = this.scaleRect(GLITCH_PINBALL_LAYOUT.ramps.left, canvas);
    const right = this.scaleRect(GLITCH_PINBALL_LAYOUT.ramps.right, canvas);
    const center = this.scaleRect(GLITCH_PINBALL_LAYOUT.ramps.center, canvas);

    this.drawRampRect(left, 'rgba(0, 78, 146, 0.3)', '#00ffff');
    this.drawRampRect(right, 'rgba(0, 78, 146, 0.3)', '#00ffff');
    this.drawRampRect(center, 'rgba(78, 0, 146, 0.3)', '#ff00ff');
  }

  private drawTargets(): void {
    const ctx = this.ctx;
    const canvas = this.pinballCanvas.nativeElement;

    GLITCH_PINBALL_LAYOUT.targets.forEach((target) => {
      const rect = this.scaleRect(target, canvas);
      const collected = this.isLetterCollected(target.sequence, target.letterIndex);
      ctx.fillStyle = collected ? '#00ffff' : 'rgba(0, 0, 0, 0.4)';
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    });
  }

  private drawSmallSpheres(): void {
    const ctx = this.ctx;
    const canvas = this.pinballCanvas.nativeElement;

    GLITCH_PINBALL_LAYOUT.smallSpheres.forEach((sphere) => {
      const size = Math.min(canvas.width, canvas.height);
      const x = sphere.x * canvas.width;
      const y = sphere.y * canvas.height;
      const radius = sphere.radius * size;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(120, 255, 255, 0.55)';
      ctx.fill();
      ctx.strokeStyle = '#7ffcff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  private drawTrampolines(): void {
    const ctx = this.ctx;
    const canvas = this.pinballCanvas.nativeElement;

    GLITCH_PINBALL_LAYOUT.trampolines.forEach((trampoline) => {
      const rect = this.scaleRect(trampoline, canvas);
      ctx.fillStyle = 'rgba(0, 255, 200, 0.35)';
      ctx.strokeStyle = '#00ffc8';
      ctx.lineWidth = 2;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      const slopeOffset = -(trampoline.slopeDeg / 10) * rect.height;
      ctx.beginPath();
      ctx.moveTo(rect.x, rect.y);
      ctx.quadraticCurveTo(
        rect.x + rect.width * 0.5,
        rect.y + slopeOffset,
        rect.x + rect.width,
        rect.y
      );
      ctx.strokeStyle = '#7fffe5';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  private drawGlitchEffects(): void {
    const ctx = this.ctx;
    const canvas = this.pinballCanvas.nativeElement;

    for (let i = 0; i < 5; i += 1) {
      const x1 = Math.random() * canvas.width;
      const y1 = Math.random() * canvas.height;
      const x2 = Math.random() * canvas.width;
      const y2 = Math.random() * canvas.height;

      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.lineWidth = 1 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  private drawRampRect(rect: { x: number; y: number; width: number; height: number }, fill: string, stroke: string): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private scaleRect(
    rect: { x: number; y: number; width: number; height: number },
    canvas: HTMLCanvasElement
  ): { x: number; y: number; width: number; height: number } {
    return {
      x: rect.x * canvas.width,
      y: rect.y * canvas.height,
      width: rect.width * canvas.width,
      height: rect.height * canvas.height
    };
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  private isLetterCollected(sequence: SequenceName, index: number): boolean {
    const seq = this.stateService.currentState.letterSequences.find((item) => item.name === sequence);
    return seq ? seq.collected[index] : false;
  }

  startGame(): void {
    this.stateService.startGame();
  }

  launchBall(): void {
    this.stateService.launchBall();
  }

  startLaunchCharge(): void {
    if (this.launchChargeStart === null) {
      this.launchChargeStart = performance.now();
    }
  }

  releaseLaunchCharge(): void {
    if (this.launchChargeStart === null) {
      return;
    }
    const elapsed = performance.now() - this.launchChargeStart;
    this.launchChargeStart = null;
    const strength = Math.min(Math.max(elapsed / 1200, 0.1), 1);
    this.stateService.launchBall(strength);
  }

  activateLeftFlipper(): void {
    this.stateService.setLeftFlipper(true);
  }

  deactivateLeftFlipper(): void {
    this.stateService.setLeftFlipper(false);
  }

  activateRightFlipper(): void {
    this.stateService.setRightFlipper(true);
  }

  deactivateRightFlipper(): void {
    this.stateService.setRightFlipper(false);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'z' || event.key === 'ArrowLeft') {
      this.activateLeftFlipper();
    }

    if (event.key === '/' || event.key === 'ArrowRight') {
      this.activateRightFlipper();
    }

    if (event.key === ' ' || event.key === 'ArrowDown') {
      this.launchBall();
    }

    if (event.key === 'x') {
      this.stateService.nudge(-2, 0);
    }

    if (event.key === 'c') {
      this.stateService.nudge(2, 0);
    }

    if (event.key === 'ArrowUp') {
      this.stateService.nudge(0, -2);
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'z' || event.key === 'ArrowLeft') {
      this.deactivateLeftFlipper();
    }

    if (event.key === '/' || event.key === 'ArrowRight') {
      this.deactivateRightFlipper();
    }
  }

  private cleanup(): void {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }
}
