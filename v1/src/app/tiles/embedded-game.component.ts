import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CandyRunnerEngine, RunnerInput, RunnerState } from './candy-runner.core';

@Component({
  selector: 'embedded-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container" #gameContainer [class.hyperlane]="isHyperlane">
      <ng-container *ngIf="!isHyperlane; else hyperlaneGame">
        <div class="game-viewport">
          <div class="game-world" #gameWorld>
            <div class="ground">
              <div
                *ngFor="let tile of groundTiles"
                class="ground-tile"
                [style.left.px]="tile.x"
                [style.width.px]="spriteTile"
                [style.height.px]="spriteTile"
                [style.--sprite-x.px]="tile.spriteX"
                [style.--sprite-y.px]="tile.spriteY">
              </div>
            </div>
            <!-- Player -->
            <div class="player"
                 [style.left.px]="player.x"
                 [style.bottom.px]="player.y"
                 [style.width.px]="player.width"
                 [style.height.px]="player.height"
                 [style.--sprite-x.px]="player.spriteX"
                 [style.--sprite-y.px]="player.spriteY"></div>

            <!-- Obstacles -->
            <div *ngFor="let obstacle of obstacles"
                 class="obstacle"
                 [style.left.px]="obstacle.x"
                 [style.bottom.px]="obstacle.y"
                 [style.width.px]="obstacle.width"
                 [style.height.px]="obstacle.height">
              <div
                *ngFor="let segment of obstacle.segments; let i = index"
                class="obstacle-segment"
                [style.left.px]="0"
                [style.bottom.px]="i * spriteTile"
                [style.width.px]="spriteTile"
                [style.height.px]="spriteTile"
                [style.--sprite-x.px]="obstacle.spriteX"
                [style.--sprite-y.px]="obstacle.spriteY">
              </div>
            </div>

            <!-- Collectibles -->
            <div *ngFor="let collectible of collectibles"
                 class="collectible"
                 [class.golden]="collectible.kind === 'golden'"
                 [style.left.px]="collectible.x"
                 [style.bottom.px]="collectible.y"
                 [style.width.px]="collectible.width"
                 [style.height.px]="collectible.height"
                 [style.--sprite-x.px]="collectible.spriteX"
                 [style.--sprite-y.px]="collectible.spriteY"></div>
          </div>
        </div>

        <div class="game-ui">
          <div class="score">Score {{ runnerState.score | number:'1.0-0' }}</div>
          <div class="distance">Distance {{ runnerState.distance | number:'1.0-0' }}</div>
        </div>

        <div class="runner-overlay" *ngIf="runnerState.mode !== 'playing'">
          <div class="overlay-title" *ngIf="runnerState.mode === 'boot'">Candy Runner</div>
          <div class="overlay-subtitle" *ngIf="runnerState.mode === 'boot'">Press Space to Start</div>

          <ng-container *ngIf="runnerState.mode === 'over'">
            <div class="overlay-title">Run Over</div>
            <div class="overlay-subtitle">Final Score {{ runnerState.score | number:'1.0-0' }}</div>
            <div class="overlay-subtitle">Distance {{ runnerState.distance | number:'1.0-0' }}</div>
            <div class="overlay-prompt">Press R to Retry</div>
          </ng-container>
        </div>
      </ng-container>

      <ng-template #hyperlaneGame>
        <canvas #hyperlaneCanvas class="hyperlane-canvas"></canvas>
        <div class="hyperlane-ui">
          <div class="hyperlane-hud">
            <div class="hud-block">
              <div class="hud-label">HP</div>
              <div class="hud-bar">
                <span class="hud-bar-fill" [style.width.%]="hyperlaneHealthPercent"></span>
              </div>
              <div class="hud-label">Score {{ hyperlaneScore | number:'1.0-0' }}</div>
            </div>
            <div class="hud-block right">
              <div class="hud-label">Combo x{{ hyperlaneComboMultiplier }}</div>
              <div class="hud-label">Lane {{ hyperlaneLaneSpeed | number:'1.1-1' }}x</div>
              <div class="hud-label">{{ hyperlaneTimeRemaining | number:'1.0-0' }}s</div>
            </div>
          </div>
          <div class="hyperlane-overlay" *ngIf="hyperlaneState !== 'playing'">
            <div class="overlay-title">{{ hyperlaneOverlayTitle }}</div>
            <div class="overlay-subtitle">{{ hyperlaneOverlaySubtitle }}</div>
            <div class="overlay-prompt">{{ hyperlaneOverlayPrompt }}</div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      --candy-tile: 70px;
      --sprite-sheet: url('/assets/tiles/candy-sheet.svg');
    }
    
    .game-container {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background: linear-gradient(to bottom, #87CEEB 0%, #1E90FF 100%);
      display: flex;
      flex-direction: column;
    }
    
    .game-viewport {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: repeating-linear-gradient(
        to right,
        rgba(255,255,255,0.1) 0px,
        rgba(255,255,255,0.1) 2px,
        transparent 2px,
        transparent 20px
      );
    }
    
    .game-world {
      position: absolute;
      width: 2000px;
      height: 100%;
      left: 0;
      transition: transform 0.1s linear;
    }

    .ground {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: var(--candy-tile);
      pointer-events: none;
    }

    .ground-tile {
      position: absolute;
      bottom: 0;
      background-image: var(--sprite-sheet);
      background-size: calc(var(--candy-tile) * 14) calc(var(--candy-tile) * 7);
      background-position: var(--sprite-x) var(--sprite-y);
      background-repeat: no-repeat;
      image-rendering: pixelated;
    }
    
    .player {
      position: absolute;
      background-image: var(--sprite-sheet);
      background-size: calc(var(--candy-tile) * 14) calc(var(--candy-tile) * 7);
      background-position: var(--sprite-x) var(--sprite-y);
      background-repeat: no-repeat;
      image-rendering: pixelated;
      bottom: 50px;
      left: 100px;
      transition: bottom 0.2s ease-out;
      z-index: 10;
    }
    
    .player.jumping {
      transform: scale(1.02);
    }
    
    .obstacle {
      position: absolute;
      bottom: 50px;
    }

    .obstacle-segment {
      position: absolute;
      background-image: var(--sprite-sheet);
      background-size: calc(var(--candy-tile) * 14) calc(var(--candy-tile) * 7);
      background-position: var(--sprite-x) var(--sprite-y);
      background-repeat: no-repeat;
      image-rendering: pixelated;
    }
    
    .collectible {
      position: absolute;
      background-image: var(--sprite-sheet);
      background-size: calc(var(--candy-tile) * 14) calc(var(--candy-tile) * 7);
      background-position: var(--sprite-x) var(--sprite-y);
      background-repeat: no-repeat;
      image-rendering: pixelated;
      bottom: 100px;
      animation: pulse 1.5s infinite;
    }

    .collectible.golden {
      filter: drop-shadow(0 0 6px rgba(255, 214, 102, 0.8));
    }
    
    .game-ui {
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      display: flex;
      justify-content: space-between;
      color: white;
      font-family: "IBM Plex Sans", "Inter", "Segoe UI", sans-serif;
      text-shadow: 1px 1px 2px black;
      z-index: 20;
    }
    
    .score {
      font-size: 18px;
      font-weight: bold;
    }

    .distance {
      font-size: 18px;
      font-weight: bold;
    }
    
    .runner-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-align: center;
      color: #fff;
      font-family: "IBM Plex Sans", "Inter", "Segoe UI", sans-serif;
      background: radial-gradient(circle at center, rgba(20, 5, 25, 0.35), rgba(0, 0, 0, 0.55));
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
      z-index: 30;
    }

    .overlay-title {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .overlay-subtitle {
      font-size: 14px;
      font-weight: 600;
    }

    .overlay-prompt {
      font-size: 12px;
      opacity: 0.85;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    /* Theme variations */
    .theme-candy {
      --game-bg: linear-gradient(to bottom, #FFB6C1 0%, #FF69B4 100%);
      --player-color: #FF1493;
      --obstacle-color: #8B0000;
      --collectible-color: #FFD700;
    }
    
    .theme-hyperlane {
      --game-bg: linear-gradient(to bottom, #00008B 0%, #0000CD 100%);
      --player-color: #00BFFF;
      --obstacle-color: #1E90FF;
      --collectible-color: #7FFFD4;
    }
    
    .theme-sentient {
      --game-bg: linear-gradient(to bottom, #000000 0%, #006400 100%);
      --player-color: #00FF00;
      --obstacle-color: #228B22;
      --collectible-color: #32CD32;
    }

    /* Hyperlane canvas mode */
    .game-container.hyperlane {
      background: radial-gradient(circle at 50% 10%, rgba(0, 229, 255, 0.15), transparent 55%), #02040c;
    }

    .hyperlane-canvas {
      width: 100%;
      height: 100%;
      display: block;
      background: transparent;
      position: absolute;
      inset: 0;
    }

    .hyperlane-ui {
      position: absolute;
      inset: 0;
      pointer-events: none;
      color: #9af6ff;
      font-family: "Space Mono", "IBM Plex Mono", monospace;
      text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
    }

    .hyperlane-hud {
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .hud-block {
      display: grid;
      gap: 6px;
      padding: 8px 10px;
      background: rgba(0, 10, 22, 0.55);
      border: 1px solid rgba(0, 229, 255, 0.35);
      box-shadow: 0 0 16px rgba(0, 229, 255, 0.2);
    }

    .hud-block.right {
      text-align: right;
    }

    .hud-label {
      font-size: 11px;
      opacity: 0.9;
    }

    .hud-bar {
      width: 140px;
      height: 6px;
      background: rgba(0, 229, 255, 0.12);
      border: 1px solid rgba(0, 229, 255, 0.35);
      position: relative;
      overflow: hidden;
    }

    .hud-bar-fill {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, #00e5ff 0%, #7ffcff 100%);
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
    }

    .hyperlane-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-align: center;
      background: radial-gradient(circle at center, rgba(0, 8, 20, 0.4), rgba(0, 2, 8, 0.85));
      pointer-events: auto;
      cursor: pointer;
    }

    .overlay-title {
      font-size: 32px;
      letter-spacing: 0.2em;
      font-weight: 700;
    }

    .overlay-subtitle {
      font-size: 13px;
      opacity: 0.85;
    }

    .overlay-prompt {
      font-size: 11px;
      opacity: 0.65;
    }
    `
  ]
})
export class EmbeddedGameComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() theme: 'candy' | 'hyperlane' | 'sentient' = 'candy';
  @ViewChild('gameContainer', { static: true }) gameContainerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('hyperlaneCanvas') hyperlaneCanvasRef?: ElementRef<HTMLCanvasElement>;

  isHyperlane = false;
  hyperlaneState: 'boot' | 'playing' | 'paused' | 'won' | 'lost' = 'boot';
  hyperlaneScore = 0;
  hyperlaneComboMultiplier = 1;
  hyperlaneTimeRemaining = 0;
  hyperlaneLaneSpeed = 1;
  hyperlaneHealthPercent = 100;
  hyperlaneOverlayTitle = 'HYPERLANE';
  hyperlaneOverlaySubtitle = 'Thread the lanes. Survive the run.';
  hyperlaneOverlayPrompt = 'Click to start';

  private hyperlaneCtx: CanvasRenderingContext2D | null = null;
  private hyperlaneLoopId: number | null = null;
  private hyperlaneLastTimestamp = 0;
  private hyperlaneAccumulator = 0;
  private hyperlaneCanvasWidth = 0;
  private hyperlaneCanvasHeight = 0;
  private hyperlaneRunDuration = 240;
  private hyperlaneDistanceTarget = 12000;
  private hyperlaneDifficultyInterval = 30;
  private hyperlaneFireCooldown = 0;
  private hyperlaneBoostTimer = 0;
  private hyperlaneBoostCooldown = 0;
  private hyperlaneHitFlash = 0;
  private hyperlaneShakeTimer = 0;
  private hyperlaneShakeMagnitude = 0;
  private hyperlaneElapsed = 0;
  private hyperlaneLaneScrollSpeed = 260;
  private hyperlaneSpawnIndex = 0;
  private hyperlaneSpawnTimerA = 0;
  private hyperlaneSpawnTimerB = 0;
  private hyperlaneSpawnTimerC = 0;
  private hyperlaneSpeedLines = Array.from({ length: 28 }, (_, index) => ({
    xSeed: (index * 73) % 100 / 100,
    ySeed: (index * 47) % 100 / 100,
    length: 26 + (index * 11) % 36
  }));
  private readonly hyperlaneSpawnSequence = [0.2, 0.5, 0.8, 0.35, 0.65, 0.25, 0.75, 0.45];
  private readonly hyperlaneTopMargin = 24;
  private readonly hyperlaneBottomMargin = 24;

  private hyperlanePlayer = {
    x: 120,
    y: 140,
    vx: 0,
    vy: 0,
    width: 32,
    height: 20,
    hp: 100,
    invulnerable: 0
  };

  private hyperlaneBullets: Array<{
    x: number;
    y: number;
    vx: number;
    width: number;
    height: number;
    damage: number;
  }> = [];

  private hyperlaneEnemies: Array<{
    type: 'drone' | 'striker' | 'tank';
    x: number;
    y: number;
    baseY: number;
    phase: number;
    width: number;
    height: number;
    hp: number;
    speed: number;
    age: number;
    score: number;
  }> = [];

  private hyperlaneExplosions: Array<{
    x: number;
    y: number;
    age: number;
  }> = [];

  private hyperlaneComboKills = 0;
  private readonly hyperlaneKeyState = new Set<string>();
  private resizeObserver: ResizeObserver | null = null;
  private readonly onClickBound = () => this.handleClick();
  private readonly onKeyDownBound = (event: KeyboardEvent) => this.handleKeyDown(event);
  private readonly onKeyUpBound = (event: KeyboardEvent) => this.handleKeyUp(event);
  
  private readonly runnerEngine = new CandyRunnerEngine();

  // Game state
  runnerState: RunnerState = this.runnerEngine.state;

  readonly spriteTile = 70;
  private readonly spriteColumns = 14;
  private readonly spriteRows = 7;
  private readonly groundLevel = this.spriteTile;
  private readonly jumpGroundTolerance = 2;
  private readonly baseGameSpeed = 180;
  private readonly speedIncreaseInterval = 10;
  private readonly speedIncreaseFactor = 1.05;
  private readonly spawnIntervalEarly = 2.5;
  private readonly spawnIntervalLate = 1.2;
  private readonly spawnRampStart = 15;
  private readonly spawnRampEnd = 90;
  private readonly minObstacleSpacing = 260;
  private readonly playerWidth = 70;
  private readonly playerHeight = 70;
  private readonly playerSpriteX = -6 * this.spriteTile;
  private readonly playerSpriteY = -4 * this.spriteTile;
  private readonly groundColumns = 12;
  private readonly groundRows = 4;
  private readonly columnRow = 5;
  private readonly columnColumns = 12;
  private readonly cherryColumn = 12;
  private readonly cherryRow = 0;
  private readonly worldWidth = 2000;
  private readonly pitWidth = this.spriteTile * 2;
  private readonly airCandyHeight = this.spriteTile * 2.1;
  private readonly groundCandyHeight = this.spriteTile * 1.2;
  private readonly obstaclePattern = ['spike', 'low', 'bar', 'spike', 'pit', 'low', 'bar', 'spike'] as const;
  private readonly candyPattern = ['air', 'ground', 'air', 'air', 'ground', 'air', 'air', 'ground'] as const;
  private readonly goldenCandyInterval = 7;
  
  // Game entities
  player = {
    x: 100,
    y: this.groundLevel,
    width: this.playerWidth,
    height: this.playerHeight,
    velocityY: 0,
    isJumping: false,
    speed: 5,
    spriteX: this.playerSpriteX,
    spriteY: this.playerSpriteY
  };
  
  obstacles: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    segments: number[];
    spriteX: number;
    spriteY: number;
    type: 'spike' | 'low' | 'bar';
  }> = [];
  
  collectibles: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    collected: boolean;
    spriteX: number;
    spriteY: number;
    kind: 'standard' | 'golden';
  }> = [];

  pits: Array<{
    x: number;
    width: number;
  }> = [];
  
  groundTiles: Array<{
    x: number;
    spriteX: number;
    spriteY: number;
  }> = [];
  
  // Game physics
  gravity = -3000;
  jumpForce = 800;
  gameSpeed = 180;
  
  // World state
  worldOffset = 0;
  spawnTimer = 0;
  private speedIncreaseTimer = 0;
  private elapsedSeconds = 0;
  private runnerAccumulator = 0;
  private runnerLastTimestamp = 0;
  private runnerRunIndex = 0;
  private runnerJumpQueued = false;
  private runnerRestartQueued = false;
  private runnerResetQueued = false;
  private runnerSeed = 1337;
  private airComboCount = 0;
  private lastGrounded = true;
  private jumpCount = 0;
  private readonly maxJumps = 3;
  private spawnIndex = 0;
  private candyIndex = 0;
  
  private gameLoopId: number | null = null;
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit() {
    this.isHyperlane = this.theme === 'hyperlane';
    this.setupEventListeners();
    if (this.isHyperlane) {
      this.resetHyperlane();
    } else {
      this.resetGame();
    }
  }

  ngAfterViewInit() {
    if (!this.isHyperlane) {
      return;
    }
    this.setupHyperlaneCanvas();
  }
  
  ngOnDestroy() {
    this.cleanupEventListeners();
    this.stopGame();
    this.stopHyperlaneLoop();
    this.disconnectResizeObserver();
  }
  
  private setupEventListeners() {
    const container = this.elementRef.nativeElement as HTMLElement;
    container.addEventListener('click', this.onClickBound);
    document.addEventListener('keydown', this.onKeyDownBound);
    document.addEventListener('keyup', this.onKeyUpBound);
  }
  
  private cleanupEventListeners() {
    const container = this.elementRef.nativeElement as HTMLElement;
    container.removeEventListener('click', this.onClickBound);
    document.removeEventListener('keydown', this.onKeyDownBound);
    document.removeEventListener('keyup', this.onKeyUpBound);
  }
  
  private handleClick() {
    if (this.isHyperlane) {
      if (this.hyperlaneState === 'playing') {
        return;
      }
      if (this.hyperlaneState === 'won' || this.hyperlaneState === 'lost') {
        this.resetHyperlane();
      }
      this.startHyperlane();
      return;
    }

    if (this.runnerState.mode === 'over') {
      this.resetGame();
      this.startGame();
      return;
    }

    if (this.runnerState.mode === 'boot') {
      this.startGame();
    }
  }
  
  private handleKeyDown(event: KeyboardEvent) {
    if (this.isHyperlane) {
      if (this.isHyperlaneControlKey(event.code)) {
        event.preventDefault();
      }
      this.hyperlaneKeyState.add(event.code);

      if (event.code === 'Escape') {
        if (this.hyperlaneState === 'playing') {
          this.pauseHyperlane();
        } else if (this.hyperlaneState === 'paused') {
          this.resumeHyperlane();
        }
        return;
      }

      if (this.hyperlaneState === 'boot') {
        this.startHyperlane();
        return;
      }

      if (this.hyperlaneState === 'won' || this.hyperlaneState === 'lost') {
        this.resetHyperlane();
        this.startHyperlane();
        return;
      }

      return;
    }

    if (event.code === 'Escape') {
      this.runnerResetQueued = true;
      this.startGame();
      return;
    }

    if (event.code === 'KeyR') {
      this.runnerRestartQueued = true;
      this.startGame();
      return;
    }

    if (event.code !== 'KeyW' && event.code !== 'ArrowUp' && event.code !== 'Space') {
      return;
    }

    event.preventDefault();

    this.runnerJumpQueued = true;
    this.startGame();
  }
  
  private handleKeyUp(event: KeyboardEvent) {
    if (this.isHyperlane) {
      this.hyperlaneKeyState.delete(event.code);
      return;
    }
  }
  
  startGame() {
    if (this.gameLoopId) {
      return;
    }
    this.runnerAccumulator = Math.max(this.runnerAccumulator, 1 / 60);
    this.runnerLastTimestamp = performance.now();
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  stopGame() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }
  
  resetGame() {
    this.stopGame();
    this.runnerAccumulator = 0;
    const seed = 1337 + this.runnerRunIndex;
    this.runnerRunIndex += 1;
    this.runnerEngine.reset(seed);
    this.syncRunnerView();
  }
  
  gameLoop(timestamp: number) {
    const deltaSeconds = Math.min(0.05, (timestamp - this.runnerLastTimestamp) / 1000);
    this.runnerLastTimestamp = timestamp;
    this.runnerAccumulator += deltaSeconds;

    const step = 1 / 60;
    while (this.runnerAccumulator >= step) {
      this.updateGame(step);
      this.runnerAccumulator -= step;
    }

    if (this.runnerState.mode === 'playing') {
      this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
    } else {
      this.stopGame();
    }
  }
  
  updateGame(deltaSeconds: number) {
    this.runnerEngine.step(deltaSeconds, this.consumeRunnerInput());
    this.syncRunnerView();
  }

  private pickCherrySprite() {
    return {
      spriteX: -this.cherryColumn * this.spriteTile,
      spriteY: -this.cherryRow * this.spriteTile
    };
  }

  private consumeRunnerInput(): RunnerInput {
    const input = {
      jumpPressed: this.runnerJumpQueued,
      restartPressed: this.runnerRestartQueued,
      resetPressed: this.runnerResetQueued
    };
    this.runnerJumpQueued = false;
    this.runnerRestartQueued = false;
    this.runnerResetQueued = false;
    return input;
  }

  private syncRunnerView() {
    const state = this.runnerEngine.state;
    const cherry = this.pickCherrySprite();
    const obstacleSprites: Record<RunnerState['obstacles'][number]['type'], { spriteX: number; spriteY: number }> = {
      spike: { spriteX: -2 * this.spriteTile, spriteY: -this.columnRow * this.spriteTile },
      low: { spriteX: -4 * this.spriteTile, spriteY: -this.columnRow * this.spriteTile },
      bar: { spriteX: -6 * this.spriteTile, spriteY: -this.columnRow * this.spriteTile }
    };

    this.player.x = state.player.x;
    this.player.y = state.player.y;
    this.player.width = state.player.width;
    this.player.height = state.player.height;
    this.player.isJumping = !state.player.grounded;

    this.obstacles = state.obstacles.map((obstacle: RunnerState['obstacles'][number]) => {
      const segments = Math.max(1, Math.round(obstacle.height / this.spriteTile));
      const sprite = obstacleSprites[obstacle.type];
      return {
        x: obstacle.x,
        y: obstacle.y,
        width: obstacle.width,
        height: obstacle.height,
        segments: Array.from({ length: segments }, (_, index) => index),
        spriteX: sprite.spriteX,
        spriteY: sprite.spriteY,
        type: obstacle.type
      };
    });

    this.collectibles = state.pickups.map((pickup: RunnerState['pickups'][number]) => ({
      x: pickup.x,
      y: pickup.y,
      width: pickup.width,
      height: pickup.height,
      collected: pickup.collected,
      spriteX: cherry.spriteX,
      spriteY: cherry.spriteY,
      kind: pickup.kind
    }));

    this.groundTiles = this.buildGroundTiles(state.distance);
  }

  private buildGroundTiles(distance: number) {
    const tiles: Array<{ x: number; spriteX: number; spriteY: number }> = [];
    const tileCount = Math.ceil(this.worldWidth / this.spriteTile) + 2;
    const offset = distance % this.spriteTile;
    for (let i = 0; i < tileCount; i += 1) {
      const column = i % this.groundColumns;
      const row = Math.floor(i / this.groundColumns) % this.groundRows;
      tiles.push({
        x: i * this.spriteTile - offset,
        spriteX: -column * this.spriteTile,
        spriteY: -row * this.spriteTile
      });
    }
    return tiles;
  }

  private isHyperlaneControlKey(code: string): boolean {
    return (
      code === 'ArrowUp' ||
      code === 'ArrowDown' ||
      code === 'ArrowLeft' ||
      code === 'ArrowRight' ||
      code === 'KeyW' ||
      code === 'KeyA' ||
      code === 'KeyS' ||
      code === 'KeyD' ||
      code === 'Space' ||
      code === 'ShiftLeft' ||
      code === 'ShiftRight' ||
      code === 'Escape'
    );
  }

  private setupHyperlaneCanvas() {
    const canvas = this.hyperlaneCanvasRef?.nativeElement;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    this.hyperlaneCtx = context;
    this.updateHyperlaneCanvasSize();
    this.connectResizeObserver();
    this.renderHyperlane();
  }

  private connectResizeObserver() {
    const container = this.gameContainerRef?.nativeElement;
    if (!container || this.resizeObserver) {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => this.updateHyperlaneCanvasSize());
    this.resizeObserver.observe(container);
  }

  private disconnectResizeObserver() {
    if (!this.resizeObserver) {
      return;
    }
    this.resizeObserver.disconnect();
    this.resizeObserver = null;
  }

  private updateHyperlaneCanvasSize() {
    const container = this.gameContainerRef?.nativeElement;
    const canvas = this.hyperlaneCanvasRef?.nativeElement;
    if (!container || !canvas || !this.hyperlaneCtx) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    this.hyperlaneCanvasWidth = width;
    this.hyperlaneCanvasHeight = height;
    this.hyperlaneCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.resetHyperlanePlayerPosition();
  }

  private resetHyperlane() {
    this.hyperlaneState = 'boot';
    this.hyperlaneElapsed = 0;
    this.hyperlaneScore = 0;
    this.hyperlaneComboMultiplier = 1;
    this.hyperlaneComboKills = 0;
    this.hyperlaneFireCooldown = 0;
    this.hyperlaneBoostTimer = 0;
    this.hyperlaneBoostCooldown = 0;
    this.hyperlaneHitFlash = 0;
    this.hyperlaneShakeTimer = 0;
    this.hyperlaneShakeMagnitude = 0;
    this.hyperlaneLaneScrollSpeed = 260;
    this.hyperlaneTimeRemaining = this.hyperlaneRunDuration;
    this.hyperlanePlayer.hp = 100;
    this.hyperlanePlayer.vx = 0;
    this.hyperlanePlayer.vy = 0;
    this.hyperlanePlayer.invulnerable = 0;
    this.hyperlaneBullets = [];
    this.hyperlaneEnemies = [];
    this.hyperlaneExplosions = [];
    this.hyperlaneSpawnIndex = 0;
    this.hyperlaneSpawnTimerA = 0;
    this.hyperlaneSpawnTimerB = 0;
    this.hyperlaneSpawnTimerC = 0;
    this.hyperlaneHealthPercent = 100;
    this.hyperlaneLaneSpeed = 1;
    this.hyperlaneKeyState.clear();
    this.updateHyperlaneOverlay();
    this.resetHyperlanePlayerPosition();
    this.renderHyperlane();
  }

  private resetHyperlanePlayerPosition() {
    const height = this.hyperlaneCanvasHeight || 200;
    const width = this.hyperlaneCanvasWidth || 320;
    this.hyperlanePlayer.x = Math.min(140, width * 0.3);
    this.hyperlanePlayer.y = Math.max(
      this.hyperlaneTopMargin,
      (height - this.hyperlanePlayer.height) / 2
    );
  }

  private startHyperlane() {
    if (this.hyperlaneState === 'playing') {
      return;
    }
    this.hyperlaneState = 'playing';
    this.updateHyperlaneOverlay();
    this.hyperlaneLastTimestamp = performance.now();
    this.hyperlaneAccumulator = 0;
    this.hyperlaneLoopId = requestAnimationFrame(this.hyperlaneLoop.bind(this));
  }

  private pauseHyperlane() {
    if (this.hyperlaneState !== 'playing') {
      return;
    }
    this.hyperlaneState = 'paused';
    this.updateHyperlaneOverlay();
    this.stopHyperlaneLoop();
    this.renderHyperlane();
  }

  private resumeHyperlane() {
    if (this.hyperlaneState !== 'paused') {
      return;
    }
    this.hyperlaneState = 'playing';
    this.updateHyperlaneOverlay();
    this.hyperlaneLastTimestamp = performance.now();
    this.hyperlaneLoopId = requestAnimationFrame(this.hyperlaneLoop.bind(this));
  }

  private stopHyperlaneLoop() {
    if (this.hyperlaneLoopId) {
      cancelAnimationFrame(this.hyperlaneLoopId);
      this.hyperlaneLoopId = null;
    }
  }

  private hyperlaneLoop(timestamp: number) {
    if (this.hyperlaneState !== 'playing') {
      return;
    }
    const deltaSeconds = Math.min(0.05, (timestamp - this.hyperlaneLastTimestamp) / 1000);
    this.hyperlaneLastTimestamp = timestamp;
    this.hyperlaneAccumulator += deltaSeconds;

    const step = 1 / 60;
    while (this.hyperlaneAccumulator >= step) {
      this.updateHyperlane(step);
      this.hyperlaneAccumulator -= step;
    }

    this.renderHyperlane();
    this.hyperlaneLoopId = requestAnimationFrame(this.hyperlaneLoop.bind(this));
  }

  private updateHyperlane(deltaSeconds: number) {
    this.hyperlaneElapsed += deltaSeconds;
    const progress = Math.min(1, this.hyperlaneElapsed / this.hyperlaneRunDuration);
    const difficultyLevel = Math.floor(this.hyperlaneElapsed / this.hyperlaneDifficultyInterval);
    const difficultyStep = 1 + Math.min(7, difficultyLevel) * 0.08;
    const difficultyScale = (1 + progress * 0.6) * difficultyStep;

    this.hyperlaneLaneSpeed = 1 + progress * 0.6;
    this.hyperlaneLaneScrollSpeed = 260 + 160 * progress;
    this.hyperlaneTimeRemaining = Math.max(0, this.hyperlaneRunDuration - this.hyperlaneElapsed);

    if (this.hyperlaneHitFlash > 0) {
      this.hyperlaneHitFlash = Math.max(0, this.hyperlaneHitFlash - deltaSeconds);
    }
    if (this.hyperlaneShakeTimer > 0) {
      this.hyperlaneShakeTimer = Math.max(0, this.hyperlaneShakeTimer - deltaSeconds);
    }

    if (this.hyperlaneBoostTimer > 0) {
      this.hyperlaneBoostTimer = Math.max(0, this.hyperlaneBoostTimer - deltaSeconds);
      if (this.hyperlaneBoostTimer === 0) {
        this.hyperlaneBoostCooldown = 4;
      }
    } else if (this.hyperlaneBoostCooldown > 0) {
      this.hyperlaneBoostCooldown = Math.max(0, this.hyperlaneBoostCooldown - deltaSeconds);
    }

    if (this.hyperlanePlayer.invulnerable > 0) {
      this.hyperlanePlayer.invulnerable = Math.max(0, this.hyperlanePlayer.invulnerable - deltaSeconds);
    }

    if (this.hyperlaneFireCooldown > 0) {
      this.hyperlaneFireCooldown = Math.max(0, this.hyperlaneFireCooldown - deltaSeconds);
    }

    this.updateHyperlaneMovement(deltaSeconds);
    this.updateHyperlaneShooting();
    this.updateHyperlaneSpawns(deltaSeconds, difficultyScale);
    this.updateHyperlaneEnemies(deltaSeconds);
    this.updateHyperlaneBullets(deltaSeconds);
    this.updateHyperlaneExplosions(deltaSeconds);
    this.resolveHyperlaneCollisions();

    this.hyperlaneScore += 10 * deltaSeconds;
    this.hyperlaneHealthPercent = Math.max(0, (this.hyperlanePlayer.hp / 100) * 100);

    if (this.hyperlaneElapsed >= this.hyperlaneRunDuration) {
      this.endHyperlane('won');
      return;
    }

    if (this.hyperlanePlayer.hp <= 0) {
      this.endHyperlane('lost');
      return;
    }
  }

  private updateHyperlaneMovement(deltaSeconds: number) {
    const boostActive = this.hyperlaneBoostTimer > 0;
    const acceleration = 1800 * (boostActive ? 1.75 : 1);
    const maxSpeed = 420 * (boostActive ? 1.75 : 1);
    const friction = 1600;

    const inputX = (this.hyperlaneKeyState.has('ArrowRight') || this.hyperlaneKeyState.has('KeyD') ? 1 : 0)
      - (this.hyperlaneKeyState.has('ArrowLeft') || this.hyperlaneKeyState.has('KeyA') ? 1 : 0);
    const inputY = (this.hyperlaneKeyState.has('ArrowDown') || this.hyperlaneKeyState.has('KeyS') ? 1 : 0)
      - (this.hyperlaneKeyState.has('ArrowUp') || this.hyperlaneKeyState.has('KeyW') ? 1 : 0);

    if (this.hyperlaneKeyState.has('ShiftLeft') || this.hyperlaneKeyState.has('ShiftRight')) {
      if (this.hyperlaneBoostTimer <= 0 && this.hyperlaneBoostCooldown <= 0) {
        this.hyperlaneBoostTimer = 1.2;
      }
    }

    if (inputX !== 0) {
      this.hyperlanePlayer.vx += acceleration * inputX * deltaSeconds;
    } else {
      this.hyperlanePlayer.vx = this.applyFriction(this.hyperlanePlayer.vx, friction, deltaSeconds);
    }

    if (inputY !== 0) {
      this.hyperlanePlayer.vy += acceleration * inputY * deltaSeconds;
    } else {
      this.hyperlanePlayer.vy = this.applyFriction(this.hyperlanePlayer.vy, friction, deltaSeconds);
    }

    this.hyperlanePlayer.vx = this.clamp(this.hyperlanePlayer.vx, -maxSpeed, maxSpeed);
    this.hyperlanePlayer.vy = this.clamp(this.hyperlanePlayer.vy, -maxSpeed, maxSpeed);

    this.hyperlanePlayer.x += this.hyperlanePlayer.vx * deltaSeconds;
    this.hyperlanePlayer.y += this.hyperlanePlayer.vy * deltaSeconds;

    const minY = this.hyperlaneTopMargin;
    const maxY = this.hyperlaneCanvasHeight - this.hyperlaneBottomMargin - this.hyperlanePlayer.height;
    const minX = 0;
    const maxX = this.hyperlaneCanvasWidth - this.hyperlanePlayer.width;

    if (this.hyperlanePlayer.x < minX) {
      this.hyperlanePlayer.x = minX;
      this.hyperlanePlayer.vx = 0;
    } else if (this.hyperlanePlayer.x > maxX) {
      this.hyperlanePlayer.x = maxX;
      this.hyperlanePlayer.vx = 0;
    }

    if (this.hyperlanePlayer.y < minY) {
      this.hyperlanePlayer.y = minY;
      this.hyperlanePlayer.vy = 0;
    } else if (this.hyperlanePlayer.y > maxY) {
      this.hyperlanePlayer.y = maxY;
      this.hyperlanePlayer.vy = 0;
    }
  }

  private updateHyperlaneShooting() {
    const firing = this.hyperlaneKeyState.has('Space');
    if (!firing || this.hyperlaneFireCooldown > 0) {
      return;
    }

    const bullet = {
      x: this.hyperlanePlayer.x + this.hyperlanePlayer.width + 4,
      y: this.hyperlanePlayer.y + this.hyperlanePlayer.height / 2 - 1,
      vx: 900,
      width: 6,
      height: 2,
      damage: 10
    };
    this.hyperlaneBullets.push(bullet);
    if (this.hyperlaneBullets.length > 40) {
      this.hyperlaneBullets.splice(0, this.hyperlaneBullets.length - 40);
    }
    this.hyperlaneFireCooldown = 1 / 8;
  }

  private updateHyperlaneSpawns(deltaSeconds: number, difficultyScale: number) {
    if (this.hyperlaneEnemies.length >= 12) {
      return;
    }

    const progress = Math.min(1, this.hyperlaneElapsed / this.hyperlaneRunDuration);
    const intervalA = this.lerp(1.5, 0.8, progress) / difficultyScale;
    const intervalB = 4 / difficultyScale;
    const intervalC = 12 / difficultyScale;

    this.hyperlaneSpawnTimerA += deltaSeconds;
    this.hyperlaneSpawnTimerB += deltaSeconds;
    this.hyperlaneSpawnTimerC += deltaSeconds;

    if (this.hyperlaneSpawnTimerA >= intervalA) {
      this.hyperlaneSpawnTimerA = 0;
      this.spawnHyperlaneEnemy('drone');
    }

    if (this.hyperlaneSpawnTimerB >= intervalB) {
      this.hyperlaneSpawnTimerB = 0;
      this.spawnHyperlaneEnemy('striker');
    }

    if (this.hyperlaneSpawnTimerC >= intervalC) {
      this.hyperlaneSpawnTimerC = 0;
      this.spawnHyperlaneEnemy('tank');
    }
  }

  private updateHyperlaneEnemies(deltaSeconds: number) {
    const sineAmplitude = 18;
    const sineFrequency = 2.4;

    this.hyperlaneEnemies.forEach((enemy) => {
      enemy.age += deltaSeconds;
      enemy.x -= enemy.speed * deltaSeconds;
      if (enemy.type === 'striker') {
        enemy.y = enemy.baseY + Math.sin(enemy.age * sineFrequency + enemy.phase) * sineAmplitude;
      }
    });

    this.hyperlaneEnemies = this.hyperlaneEnemies.filter((enemy) => enemy.x + enemy.width > -40);
  }

  private updateHyperlaneBullets(deltaSeconds: number) {
    this.hyperlaneBullets.forEach((bullet) => {
      bullet.x += bullet.vx * deltaSeconds;
    });
    this.hyperlaneBullets = this.hyperlaneBullets.filter((bullet) => bullet.x < this.hyperlaneCanvasWidth + 40);
  }

  private updateHyperlaneExplosions(deltaSeconds: number) {
    this.hyperlaneExplosions.forEach((explosion) => {
      explosion.age += deltaSeconds;
    });
    this.hyperlaneExplosions = this.hyperlaneExplosions.filter((explosion) => explosion.age < 0.7);
  }

  private resolveHyperlaneCollisions() {
    for (let i = this.hyperlaneEnemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.hyperlaneEnemies[i];
      for (let j = this.hyperlaneBullets.length - 1; j >= 0; j -= 1) {
        const bullet = this.hyperlaneBullets[j];
        if (this.rectsOverlap(bullet, enemy)) {
          enemy.hp -= bullet.damage;
          this.hyperlaneBullets.splice(j, 1);
          if (enemy.hp <= 0) {
            this.hyperlaneEnemies.splice(i, 1);
            this.hyperlaneScore += enemy.score * this.hyperlaneComboMultiplier;
            this.hyperlaneComboKills += 1;
            if (this.hyperlaneComboKills % 3 === 0) {
              this.hyperlaneComboMultiplier = Math.min(5, this.hyperlaneComboMultiplier + 1);
            }
            this.hyperlaneExplosions.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2, age: 0 });
            this.hyperlaneShakeTimer = 0.15;
            this.hyperlaneShakeMagnitude = 4;
          }
          break;
        }
      }
    }

    if (this.hyperlanePlayer.invulnerable > 0) {
      return;
    }

    const playerHitbox = this.getHyperlanePlayerHitbox();
    for (const enemy of this.hyperlaneEnemies) {
      if (this.rectsOverlap(playerHitbox, enemy)) {
        this.hyperlanePlayer.hp = Math.max(0, this.hyperlanePlayer.hp - 20);
        this.hyperlanePlayer.invulnerable = 0.5;
        this.hyperlaneComboMultiplier = 1;
        this.hyperlaneComboKills = 0;
        this.hyperlaneHitFlash = 0.2;
        this.hyperlaneShakeTimer = 0.2;
        this.hyperlaneShakeMagnitude = 8;
        break;
      }
    }
  }

  private spawnHyperlaneEnemy(type: 'drone' | 'striker' | 'tank') {
    const specs = {
      drone: { width: 28, height: 16, hp: 20, speed: 220, score: 100 },
      striker: { width: 34, height: 20, hp: 40, speed: 300, score: 250 },
      tank: { width: 56, height: 28, hp: 120, speed: 140, score: 600 }
    }[type];

    const spawnY = this.getNextHyperlaneSpawnY(specs.height);
    const phase = (this.hyperlaneSpawnIndex * 0.9) % (Math.PI * 2);
    this.hyperlaneEnemies.push({
      type,
      x: this.hyperlaneCanvasWidth + 40,
      y: spawnY,
      baseY: spawnY,
      phase,
      width: specs.width,
      height: specs.height,
      hp: specs.hp,
      speed: specs.speed,
      age: 0,
      score: specs.score
    });
    this.hyperlaneSpawnIndex += 1;
  }

  private getNextHyperlaneSpawnY(height: number): number {
    const minY = this.hyperlaneTopMargin;
    const maxY = Math.max(minY, this.hyperlaneCanvasHeight - this.hyperlaneBottomMargin - height);
    const ratio = this.hyperlaneSpawnSequence[this.hyperlaneSpawnIndex % this.hyperlaneSpawnSequence.length];
    return minY + (maxY - minY) * ratio;
  }

  private renderHyperlane() {
    const ctx = this.hyperlaneCtx;
    if (!ctx) {
      return;
    }

    const width = this.hyperlaneCanvasWidth;
    const height = this.hyperlaneCanvasHeight;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#050b1a');
    gradient.addColorStop(1, '#01030a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    const shake = this.hyperlaneShakeTimer > 0 ? this.hyperlaneShakeMagnitude * (this.hyperlaneShakeTimer / 0.2) : 0;
    if (shake > 0) {
      const shakeX = Math.sin(this.hyperlaneElapsed * 40) * shake;
      const shakeY = Math.cos(this.hyperlaneElapsed * 52) * shake;
      ctx.translate(shakeX, shakeY);
    }

    this.drawHyperlaneBands(ctx, width, height);
    this.drawHyperlaneSpeedLines(ctx, width, height);
    this.drawHyperlaneEntities(ctx);
    this.drawHyperlaneExplosions(ctx);
    ctx.restore();

    if (this.hyperlaneHitFlash > 0) {
      ctx.fillStyle = `rgba(255, 80, 80, ${this.hyperlaneHitFlash})`;
      ctx.fillRect(0, 0, width, height);
    }
  }

  private drawHyperlaneBands(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const bandCount = 5;
    const bandGap = height / (bandCount + 1);
    const offset = (this.hyperlaneElapsed * this.hyperlaneLaneScrollSpeed * 0.2) % 60;

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.18)';
    ctx.lineWidth = 1;
    for (let i = 0; i < bandCount; i += 1) {
      const y = (i + 1) * bandGap;
      ctx.beginPath();
      ctx.moveTo(-offset, y);
      ctx.lineTo(width + 60, y);
      ctx.stroke();
    }

    const streakSpacing = 48;
    const streakOffset = (this.hyperlaneElapsed * this.hyperlaneLaneScrollSpeed * 0.45) % streakSpacing;
    for (let x = -streakSpacing; x < width + streakSpacing; x += streakSpacing) {
      const posX = x - streakOffset;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(posX, 0);
      ctx.lineTo(posX - 40, height);
      ctx.stroke();
    }
  }

  private drawHyperlaneSpeedLines(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const speed = this.hyperlaneLaneScrollSpeed * 0.8;
    this.hyperlaneSpeedLines.forEach((line, index) => {
      const x = (line.xSeed * width - (this.hyperlaneElapsed * speed) % width + width) % width;
      const y = line.ySeed * height;
      ctx.strokeStyle = `rgba(127, 252, 255, ${0.2 + (index % 3) * 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - line.length, y + line.length * 0.2);
      ctx.stroke();
    });
  }

  private drawHyperlaneEntities(ctx: CanvasRenderingContext2D) {
    this.hyperlaneBullets.forEach((bullet) => {
      ctx.fillStyle = '#7ffcff';
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    this.hyperlaneEnemies.forEach((enemy) => {
      if (enemy.type === 'tank') {
        ctx.fillStyle = '#ff4dff';
      } else if (enemy.type === 'striker') {
        ctx.fillStyle = '#b6ffff';
      } else {
        ctx.fillStyle = '#00e5ff';
      }
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    const player = this.hyperlanePlayer;
    const engineGlow = this.hyperlaneBoostTimer > 0 ? '#ff77ff' : '#7ffcff';
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.fillStyle = engineGlow;
    ctx.beginPath();
    ctx.moveTo(-10, player.height / 2);
    ctx.lineTo(0, player.height / 2 - 4);
    ctx.lineTo(0, player.height / 2 + 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#9af6ff';
    ctx.beginPath();
    ctx.moveTo(0, player.height / 2);
    ctx.lineTo(player.width - 4, 0);
    ctx.lineTo(player.width, player.height / 2);
    ctx.lineTo(player.width - 4, player.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawHyperlaneExplosions(ctx: CanvasRenderingContext2D) {
    this.hyperlaneExplosions.forEach((explosion) => {
      const progress = explosion.age / 0.7;
      const radius = 6 + progress * 22;
      ctx.strokeStyle = `rgba(255, 130, 255, ${1 - progress})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  private getHyperlanePlayerHitbox() {
    const insetX = this.hyperlanePlayer.width * 0.1;
    const insetY = this.hyperlanePlayer.height * 0.1;
    return {
      x: this.hyperlanePlayer.x + insetX,
      y: this.hyperlanePlayer.y + insetY,
      width: this.hyperlanePlayer.width * 0.8,
      height: this.hyperlanePlayer.height * 0.8
    };
  }

  private applyFriction(value: number, friction: number, deltaSeconds: number) {
    if (value === 0) {
      return 0;
    }
    const frictionAmount = friction * deltaSeconds;
    if (Math.abs(value) <= frictionAmount) {
      return 0;
    }
    return value - Math.sign(value) * frictionAmount;
  }

  private rectsOverlap(a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number }) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  private lerp(start: number, end: number, t: number) {
    return start + (end - start) * t;
  }

  private endHyperlane(state: 'won' | 'lost') {
    this.hyperlaneState = state;
    this.updateHyperlaneOverlay();
    this.stopHyperlaneLoop();
    this.renderHyperlane();
  }

  private updateHyperlaneOverlay() {
    if (this.hyperlaneState === 'boot') {
      this.hyperlaneOverlayTitle = 'HYPERLANE';
      this.hyperlaneOverlaySubtitle = 'Thread the lanes. Survive the run.';
      this.hyperlaneOverlayPrompt = 'Click or press any key to start';
      return;
    }

    if (this.hyperlaneState === 'paused') {
      this.hyperlaneOverlayTitle = 'PAUSED';
      this.hyperlaneOverlaySubtitle = 'Systems on hold';
      this.hyperlaneOverlayPrompt = 'Click or press Esc to resume';
      return;
    }

    if (this.hyperlaneState === 'won') {
      this.hyperlaneOverlayTitle = 'RUN COMPLETE';
      this.hyperlaneOverlaySubtitle = `Distance ${this.hyperlaneDistanceTarget} units reached`;
      this.hyperlaneOverlayPrompt = 'Click or press any key to retry';
      return;
    }

    if (this.hyperlaneState === 'lost') {
      this.hyperlaneOverlayTitle = 'SHIP DOWN';
      this.hyperlaneOverlaySubtitle = 'Hyperlane integrity lost';
      this.hyperlaneOverlayPrompt = 'Click or press any key to retry';
    }
  }
}
