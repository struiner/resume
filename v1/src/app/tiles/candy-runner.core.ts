export type RunnerMode = 'boot' | 'playing' | 'over';

export type ObstacleType = 'spike' | 'low' | 'bar';
export type PickupKind = 'standard' | 'golden';

export interface RunnerInput {
  jumpPressed: boolean;
  restartPressed: boolean;
  resetPressed: boolean;
}

export interface RunnerMetrics {
  viewportWidth: number;
  viewportHeight: number;
  groundLevel: number;
}

export interface RunnerPlayer {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  grounded: boolean;
}

export interface RunnerObstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
}

export interface RunnerPickup {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: PickupKind;
  collected: boolean;
}

export interface RunnerPit {
  x: number;
  width: number;
}

export interface RunnerState {
  mode: RunnerMode;
  score: number;
  distance: number;
  player: RunnerPlayer;
  obstacles: RunnerObstacle[];
  pickups: RunnerPickup[];
  pits: RunnerPit[];
  metrics: RunnerMetrics;
}

export interface RunnerConfig {
  seed: number;
}

const DEFAULT_CONFIG: RunnerConfig = {
  seed: 1337
};

const RUNNER_CONSTANTS = {
  spriteTile: 70,
  baseSpeed: 180,
  speedIncreaseInterval: 10,
  speedIncreaseFactor: 1.05,
  spawnIntervalEarly: 2.5,
  spawnIntervalLate: 1.2,
  spawnRampStart: 15,
  spawnRampEnd: 90,
  minObstacleSpacing: 260,
  gravity: -3000,
  jumpVelocity: 800,
  maxJumps: 3,
  pitWidth: 140,
  playerWidth: 70,
  playerHeight: 70,
  spawnXObstacle: 800,
  spawnXPickup: 840,
  groundCandyHeight: 84,
  airCandyHeight: 147,
  baseCandyScore: 10,
  goldenBonus: 10,
  airborneComboBonus: 25,
  scorePerSecond: 1
} as const;

const METRICS: RunnerMetrics = {
  viewportWidth: RUNNER_CONSTANTS.spriteTile * 8,
  viewportHeight: RUNNER_CONSTANTS.spriteTile * 3,
  groundLevel: RUNNER_CONSTANTS.spriteTile
};

const OBSTACLE_PATTERN: Array<ObstacleType | 'pit'> = [
  'spike',
  'low',
  'bar',
  'spike',
  'pit',
  'low',
  'bar',
  'spike'
];

const CANDY_PATTERN: Array<'air' | 'ground'> = [
  'air',
  'ground',
  'air',
  'air',
  'ground',
  'air',
  'air',
  'ground'
];

export class CandyRunnerEngine {
  readonly state: RunnerState;

  private seed: number;
  private rng: number;
  private elapsedSeconds = 0;
  private spawnTimer = 0;
  private speedTimer = 0;
  private jumpCount = 0;
  private airComboCount = 0;
  private lastGrounded = true;
  private obstacleIndex = 0;
  private candyIndex = 0;
  private gameSpeed = RUNNER_CONSTANTS.baseSpeed;

  constructor(config?: Partial<RunnerConfig>) {
    const resolved = { ...DEFAULT_CONFIG, ...config };
    this.seed = resolved.seed;
    this.rng = this.seed;
    this.state = this.createInitialState();
    this.reset(this.seed);
  }

  reset(seed: number = this.seed) {
    this.seed = seed;
    this.rng = seed;
    this.elapsedSeconds = 0;
    this.spawnTimer = 0;
    this.speedTimer = 0;
    this.jumpCount = 0;
    this.airComboCount = 0;
    this.lastGrounded = true;
    this.gameSpeed = RUNNER_CONSTANTS.baseSpeed;
    this.obstacleIndex = this.randomInt(OBSTACLE_PATTERN.length);
    this.candyIndex = this.randomInt(CANDY_PATTERN.length);

    this.state.mode = 'boot';
    this.state.score = 0;
    this.state.distance = 0;
    this.state.obstacles.length = 0;
    this.state.pickups.length = 0;
    this.state.pits.length = 0;
    this.state.player.x = 100;
    this.state.player.y = METRICS.groundLevel;
    this.state.player.velocityY = 0;
    this.state.player.grounded = true;
  }

  step(dt: number, input: RunnerInput) {
    if (input.resetPressed) {
      this.reset(this.seed);
      return;
    }

    if (this.state.mode === 'boot') {
      if (!input.jumpPressed) {
        return;
      }
      this.state.mode = 'playing';
      this.jump();
    }

    if (this.state.mode === 'over') {
      if (!input.restartPressed) {
        return;
      }
      this.reset(this.seed);
      this.state.mode = 'playing';
    }

    if (input.jumpPressed) {
      this.jump();
    }

    this.update(dt);
  }

  private update(dt: number) {
    this.elapsedSeconds += dt;
    this.speedTimer += dt;

    while (this.speedTimer >= RUNNER_CONSTANTS.speedIncreaseInterval) {
      this.gameSpeed *= RUNNER_CONSTANTS.speedIncreaseFactor;
      this.speedTimer -= RUNNER_CONSTANTS.speedIncreaseInterval;
    }

    this.state.distance += this.gameSpeed * dt;
    this.state.score += RUNNER_CONSTANTS.scorePerSecond * dt;

    this.updatePlayer(dt);
    this.updateSpawns(dt);
    this.updateObstacles(dt);
    this.updatePickups(dt);
    this.updatePits(dt);
    this.resolveCollisions();
  }

  private updatePlayer(dt: number) {
    const player = this.state.player;
    player.velocityY += RUNNER_CONSTANTS.gravity * dt;
    player.y += player.velocityY * dt;

    const grounded = this.isPlayerGrounded();
    if (grounded && player.y <= METRICS.groundLevel) {
      player.y = METRICS.groundLevel;
      player.velocityY = 0;
      if (!this.lastGrounded) {
        this.airComboCount = 0;
        this.jumpCount = 0;
      }
      this.lastGrounded = true;
      player.grounded = true;
    } else {
      this.lastGrounded = false;
      player.grounded = false;
    }

    if (player.y < -player.height) {
      this.state.mode = 'over';
    }
  }

  private updateSpawns(dt: number) {
    this.spawnTimer += dt;
    const spawnInterval = this.getSpawnInterval();
    if (this.spawnTimer >= spawnInterval) {
      const spawned = this.spawnObstacle();
      this.spawnPickup();
      if (spawned) {
        this.spawnTimer = 0;
      }
    }
  }

  private updateObstacles(dt: number) {
    this.state.obstacles.forEach((obstacle) => {
      obstacle.x -= this.gameSpeed * dt;
    });
    this.state.obstacles = this.state.obstacles.filter((obstacle) => obstacle.x > -200);
  }

  private updatePickups(dt: number) {
    this.state.pickups.forEach((pickup) => {
      pickup.x -= this.gameSpeed * dt;
    });
    this.state.pickups = this.state.pickups.filter((pickup) => pickup.x > -120 && !pickup.collected);
  }

  private updatePits(dt: number) {
    this.state.pits.forEach((pit) => {
      pit.x -= this.gameSpeed * dt;
    });
    this.state.pits = this.state.pits.filter((pit) => pit.x + pit.width > -200);
  }

  private resolveCollisions() {
    const player = this.state.player;
    const playerHitbox = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };

    for (const obstacle of this.state.obstacles) {
      if (this.rectsOverlap(playerHitbox, obstacle)) {
        this.state.mode = 'over';
        return;
      }
    }

    for (const pickup of this.state.pickups) {
      if (pickup.collected) {
        continue;
      }
      if (this.rectsOverlap(playerHitbox, pickup)) {
        pickup.collected = true;
        const wasAirborne = !this.isPlayerGrounded();
        const base = RUNNER_CONSTANTS.baseCandyScore;
        const goldenBonus = pickup.kind === 'golden' ? RUNNER_CONSTANTS.goldenBonus : 0;
        this.state.score += base + goldenBonus;
        if (wasAirborne) {
          this.airComboCount += 1;
          if (this.airComboCount > 1) {
            this.state.score += RUNNER_CONSTANTS.airborneComboBonus;
          }
        }
      }
    }
  }

  private jump() {
    if (!this.canJump()) {
      return;
    }
    this.state.player.velocityY = RUNNER_CONSTANTS.jumpVelocity;
    this.jumpCount += 1;
  }

  private canJump() {
    if (this.isPlayerGrounded()) {
      return true;
    }
    return this.jumpCount < RUNNER_CONSTANTS.maxJumps;
  }

  private spawnObstacle(): boolean {
    const type = OBSTACLE_PATTERN[this.obstacleIndex % OBSTACLE_PATTERN.length];
    const spawnX = RUNNER_CONSTANTS.spawnXObstacle;

    if (!this.hasSpacing(spawnX)) {
      return false;
    }

    if (type === 'pit') {
      this.state.pits.push({
        x: spawnX,
        width: RUNNER_CONSTANTS.pitWidth
      });
      this.obstacleIndex += 1;
      return true;
    }

    const { width, height, y } = this.getObstacleDimensions(type);
    this.state.obstacles.push({
      x: spawnX,
      y,
      width,
      height,
      type
    });
    this.obstacleIndex += 1;
    return true;
  }

  private spawnPickup() {
    const lane = CANDY_PATTERN[this.candyIndex % CANDY_PATTERN.length];
    const isGolden = this.candyIndex % 7 === 0 && this.candyIndex !== 0;
    const y = lane === 'air' ? RUNNER_CONSTANTS.airCandyHeight : RUNNER_CONSTANTS.groundCandyHeight;

    this.state.pickups.push({
      x: RUNNER_CONSTANTS.spawnXPickup,
      y,
      width: RUNNER_CONSTANTS.spriteTile,
      height: RUNNER_CONSTANTS.spriteTile,
      collected: false,
      kind: isGolden ? 'golden' : 'standard'
    });
    this.candyIndex += 1;
  }

  private getObstacleDimensions(type: ObstacleType) {
    if (type === 'bar') {
      return {
        width: RUNNER_CONSTANTS.spriteTile,
        height: RUNNER_CONSTANTS.spriteTile,
        y: METRICS.groundLevel + RUNNER_CONSTANTS.spriteTile * 1.4
      };
    }

    if (type === 'low') {
      return {
        width: RUNNER_CONSTANTS.spriteTile,
        height: RUNNER_CONSTANTS.spriteTile * 2,
        y: METRICS.groundLevel
      };
    }

    return {
      width: RUNNER_CONSTANTS.spriteTile,
      height: RUNNER_CONSTANTS.spriteTile,
      y: METRICS.groundLevel
    };
  }

  private hasSpacing(spawnX: number) {
    if (this.state.obstacles.length === 0 && this.state.pits.length === 0) {
      return true;
    }

    const obstacleMax = this.state.obstacles.length > 0
      ? Math.max(...this.state.obstacles.map((obstacle) => obstacle.x + obstacle.width))
      : -Infinity;
    const pitMax = this.state.pits.length > 0
      ? Math.max(...this.state.pits.map((pit) => pit.x + pit.width))
      : -Infinity;
    const furthestX = Math.max(obstacleMax, pitMax);
    return spawnX - furthestX >= RUNNER_CONSTANTS.minObstacleSpacing;
  }

  private isPlayerGrounded() {
    const player = this.state.player;
    if (player.y > METRICS.groundLevel + 2) {
      return false;
    }
    const playerCenter = player.x + player.width * 0.5;
    return !this.isOverPit(playerCenter);
  }

  private isOverPit(x: number) {
    return this.state.pits.some((pit) => x >= pit.x && x <= pit.x + pit.width);
  }

  private getSpawnInterval() {
    if (this.elapsedSeconds <= RUNNER_CONSTANTS.spawnRampStart) {
      return RUNNER_CONSTANTS.spawnIntervalEarly;
    }
    if (this.elapsedSeconds >= RUNNER_CONSTANTS.spawnRampEnd) {
      return RUNNER_CONSTANTS.spawnIntervalLate;
    }
    const t = (this.elapsedSeconds - RUNNER_CONSTANTS.spawnRampStart)
      / (RUNNER_CONSTANTS.spawnRampEnd - RUNNER_CONSTANTS.spawnRampStart);
    return RUNNER_CONSTANTS.spawnIntervalEarly
      + (RUNNER_CONSTANTS.spawnIntervalLate - RUNNER_CONSTANTS.spawnIntervalEarly) * t;
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

  private random() {
    this.rng = (this.rng * 1664525 + 1013904223) >>> 0;
    return this.rng / 0x100000000;
  }

  private randomInt(max: number) {
    return Math.floor(this.random() * max);
  }

  private createInitialState(): RunnerState {
    return {
      mode: 'boot',
      score: 0,
      distance: 0,
      player: {
        x: 100,
        y: METRICS.groundLevel,
        width: RUNNER_CONSTANTS.playerWidth,
        height: RUNNER_CONSTANTS.playerHeight,
        velocityY: 0,
        grounded: true
      },
      obstacles: [],
      pickups: [],
      pits: [],
      metrics: METRICS
    };
  }
}
