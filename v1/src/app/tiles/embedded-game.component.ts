import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'embedded-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container" #gameContainer>
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
               [style.left.px]="collectible.x"
               [style.bottom.px]="collectible.y"
               [style.width.px]="collectible.width"
               [style.height.px]="collectible.height"
               [style.--sprite-x.px]="collectible.spriteX"
               [style.--sprite-y.px]="collectible.spriteY"></div>
        </div>
      </div>
      
      <div class="game-ui">
        <div class="score">Score: {{ score }}</div>
        <div class="instructions">
          <span *ngIf="!gameStarted">Click or W to Start</span>
          <span *ngIf="gameStarted && !gameOver">Jump with W</span>
          <span *ngIf="gameOver">Game Over! Click or W to Restart</span>
        </div>
      </div>
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
    
    .game-ui {
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      display: flex;
      justify-content: space-between;
      color: white;
      font-family: Arial, sans-serif;
      text-shadow: 1px 1px 2px black;
      z-index: 20;
    }
    
    .score {
      font-size: 18px;
      font-weight: bold;
    }
    
    .instructions {
      font-size: 14px;
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
    `
  ]
})
export class EmbeddedGameComponent implements OnInit, OnDestroy {
  @Input() theme: 'candy' | 'hyperlane' | 'sentient' = 'candy';
  
  // Game state
  gameStarted = false;
  gameOver = false;
  score = 0;

  readonly spriteTile = 70;
  private readonly spriteColumns = 14;
  private readonly spriteRows = 7;
  private readonly groundLevel = this.spriteTile;
  private readonly jumpGroundTolerance = 2;
  private readonly baseGameSpeed = 3;
  private readonly baseSpawnInterval = 100;
  private readonly speedIncreaseInterval = 30000;
  private readonly spawnIncreaseInterval = 20000;
  private readonly speedIncreaseFactor = 1.1;
  private readonly spawnIntervalFactor = 0.95;
  private readonly minObstacleSpacing = 300;
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
  }> = [];
  
  collectibles: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    collected: boolean;
    spriteX: number;
    spriteY: number;
  }> = [];
  
  groundTiles: Array<{
    x: number;
    spriteX: number;
    spriteY: number;
  }> = [];
  
  // Game physics
  gravity = -0.8;
  jumpForce = 12;
  gameSpeed = 3;
  
  // World state
  worldOffset = 0;
  spawnTimer = 0;
  spawnInterval = 100;
  private speedIncreaseTimer = 0;
  private spawnIncreaseTimer = 0;
  
  private gameLoopId: number | null = null;
  private lastTimestamp = 0;
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit() {
    this.setupEventListeners();
    this.resetGame();
  }
  
  ngOnDestroy() {
    this.cleanupEventListeners();
    this.stopGame();
  }
  
  private setupEventListeners() {
    const container = this.elementRef.nativeElement;
    container.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }
  
  private cleanupEventListeners() {
    const container = this.elementRef.nativeElement;
    container.removeEventListener('click', this.handleClick.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
  
  private handleClick() {
    if (this.gameOver) {
      this.resetGame();
      this.startGame();
    } else if (!this.gameStarted) {
      this.startGame();
    }
  }
  
  private handleKeyDown(event: KeyboardEvent) {
    if (event.code !== 'KeyW') {
      return;
    }

    event.preventDefault();

    if (this.gameOver) {
      this.resetGame();
      this.startGame();
      return;
    }

    if (!this.gameStarted) {
      this.startGame();
    }

    if (this.canJump()) {
      this.jump();
    }
  }
  
  private handleKeyUp(event: KeyboardEvent) {
    // Handle key up events if needed
  }
  
  startGame() {
    if (this.gameStarted) return;
    
    this.gameStarted = true;
    this.gameOver = false;
    this.lastTimestamp = performance.now();
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  stopGame() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
    this.gameStarted = false;
  }
  
  resetGame() {
    this.stopGame();
    this.score = 0;
    this.gameOver = false;
    this.worldOffset = 0;
    this.obstacles = [];
    this.collectibles = [];
    this.groundTiles = this.buildGroundTiles();
    this.player.x = 100;
    this.player.y = this.groundLevel;
    this.player.velocityY = 0;
    this.player.isJumping = false;
    this.spawnTimer = 0;
    this.gameSpeed = this.baseGameSpeed;
    this.spawnInterval = this.baseSpawnInterval;
    this.speedIncreaseTimer = 0;
    this.spawnIncreaseTimer = 0;
  }
  
  jump() {
    if (!this.canJump() || this.player.isJumping) return;
    
    this.player.velocityY = this.jumpForce;
    this.player.isJumping = true;
  }
  
  gameLoop(timestamp: number) {
    if (!this.gameStarted) return;
    
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    
    // Update game state
    this.updateGame(deltaTime);
    
    // Continue the game loop
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  updateGame(deltaTime: number) {
    // Move world
    this.worldOffset += this.gameSpeed;
    this.updateGroundTiles();

    // Difficulty progression
    this.speedIncreaseTimer += deltaTime;
    this.spawnIncreaseTimer += deltaTime;
    while (this.speedIncreaseTimer >= this.speedIncreaseInterval) {
      this.gameSpeed *= this.speedIncreaseFactor;
      this.speedIncreaseTimer -= this.speedIncreaseInterval;
    }
    while (this.spawnIncreaseTimer >= this.spawnIncreaseInterval) {
      this.spawnInterval *= this.spawnIntervalFactor;
      this.spawnIncreaseTimer -= this.spawnIncreaseInterval;
    }
    
    // Update player physics
    this.player.velocityY += this.gravity;
    this.player.y += this.player.velocityY;
    
    // Ground collision
    if (this.player.y <= this.groundLevel) {
      this.player.y = this.groundLevel;
      this.player.velocityY = 0;
      this.player.isJumping = false;
    }
    
    // Spawn new obstacles and collectibles
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      const spawnedObstacle = this.spawnObstacle();
      if (Math.random() > 0.5) {
        this.spawnCollectible();
      }
      if (spawnedObstacle) {
        this.spawnTimer = 0;
      }
    }
    
    // Update obstacle positions
    this.obstacles.forEach(obstacle => {
      obstacle.x -= this.gameSpeed;
    });
    
    // Update collectible positions
    this.collectibles.forEach(collectible => {
      collectible.x -= this.gameSpeed;
    });
    
    // Remove off-screen obstacles
    this.obstacles = this.obstacles.filter(obstacle => obstacle.x > -100);
    
    // Remove off-screen collectibles
    this.collectibles = this.collectibles.filter(collectible => collectible.x > -50);
    
    // Check collisions
    this.checkCollisions();
    
    // Increase difficulty over time
    if (this.score > 100 && this.gameSpeed < 8) {
      this.gameSpeed += 0.001;
    }
  }
  
  spawnObstacle() {
    const types = [
      { segments: 1 },
      { segments: 2 },
      { segments: 3 }
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const sprite = this.pickColumnSprite();

    const spawnX = 800;
    if (this.obstacles.length > 0) {
      const furthestX = Math.max(...this.obstacles.map(obstacle => obstacle.x));
      if (spawnX - furthestX < this.minObstacleSpacing) {
        return false;
      }
    }

    this.obstacles.push({
      x: spawnX,
      y: this.groundLevel,
      width: this.spriteTile,
      height: this.spriteTile * type.segments,
      segments: Array.from({ length: type.segments }, (_, index) => index),
      spriteX: sprite.spriteX,
      spriteY: sprite.spriteY
    });
    return true;
  }
  
  spawnCollectible() {
    const sprite = this.pickCherrySprite();
    this.collectibles.push({
      x: 800 + Math.random() * 200,
      y: this.groundLevel + this.spriteTile * 0.8,
      width: this.spriteTile,
      height: this.spriteTile,
      collected: false,
      spriteX: sprite.spriteX,
      spriteY: sprite.spriteY
    });
  }
  
  checkCollisions() {
    // Check obstacle collisions
    for (const obstacle of this.obstacles) {
      if (
        this.player.x < obstacle.x + obstacle.width &&
        this.player.x + this.player.width > obstacle.x &&
        this.player.y < obstacle.y + obstacle.height &&
        this.player.y + this.player.height > obstacle.y
      ) {
        this.gameOver = true;
        this.stopGame();
        return;
      }
    }
    
    // Check collectible collisions
    for (let i = 0; i < this.collectibles.length; i++) {
      const collectible = this.collectibles[i];
      if (!collectible.collected &&
          this.player.x < collectible.x + collectible.width &&
          this.player.x + this.player.width > collectible.x &&
          this.player.y < collectible.y + collectible.height &&
          this.player.y + this.player.height > collectible.y) {
        collectible.collected = true;
        this.score += 10;
        this.collectibles.splice(i, 1);
        i--;
      }
    }
    
    // Auto-increase score over time
    this.score += 0.1;
  }

  private canJump() {
    return this.player.y <= this.groundLevel + this.jumpGroundTolerance;
  }

  private buildGroundTiles() {
    const tiles: Array<{ x: number; spriteX: number; spriteY: number }> = [];
    const tileCount = Math.ceil(this.worldWidth / this.spriteTile) + 2;

    for (let i = 0; i < tileCount; i++) {
      const sprite = this.pickGroundSprite();
      tiles.push({
        x: i * this.spriteTile,
        spriteX: sprite.spriteX,
        spriteY: sprite.spriteY
      });
    }

    return tiles;
  }

  private updateGroundTiles() {
    if (this.groundTiles.length === 0) {
      return;
    }

    let maxX = -Infinity;
    for (const tile of this.groundTiles) {
      tile.x -= this.gameSpeed;
      if (tile.x > maxX) {
        maxX = tile.x;
      }
    }

    for (const tile of this.groundTiles) {
      if (tile.x <= -this.spriteTile) {
        const sprite = this.pickGroundSprite();
        tile.x = maxX + this.spriteTile;
        tile.spriteX = sprite.spriteX;
        tile.spriteY = sprite.spriteY;
        maxX = tile.x;
      }
    }
  }

  private pickGroundSprite() {
    const column = Math.floor(Math.random() * this.groundColumns);
    const row = Math.floor(Math.random() * this.groundRows);

    return {
      spriteX: -column * this.spriteTile,
      spriteY: -row * this.spriteTile
    };
  }

  private pickColumnSprite() {
    const column = Math.floor(Math.random() * this.columnColumns);
    const row = this.columnRow;

    return {
      spriteX: -column * this.spriteTile,
      spriteY: -row * this.spriteTile
    };
  }

  private pickCherrySprite() {
    return {
      spriteX: -this.cherryColumn * this.spriteTile,
      spriteY: -this.cherryRow * this.spriteTile
    };
  }
}
