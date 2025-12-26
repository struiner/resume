import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

type Direction = 'up' | 'down' | 'left' | 'right';
type ExitDirection = 'north' | 'south' | 'west' | 'east';
type GameState = 'title' | 'playing' | 'paused' | 'dead' | 'won';
type EnemyKind = 'slime' | 'crawler' | 'wisp';
type PickupKind = 'mana' | 'heart' | 'bloom';

const GRID_COLS = 16;
const GRID_ROWS = 11;
const FIXED_STEP = 1 / 60;

const PLAYER_STATS = {
  moveSpeed: 1.25,
  attackCooldown: 0.35,
  attackRange: 0.75,
  attackDamage: 1,
  spellCooldown: 0.6,
  spellCost: 2,
  spellRange: 3,
  spellDamage: 2,
  knockbackDistance: 0.5,
  knockbackStun: 0.25,
  maxHealthStart: 3,
  maxHealthCap: 6
};

const MANA_STATS = {
  max: 8,
  regenActiveSecondsPerMana: 2,
  regenDelayAfterCast: 1.5,
  castCorruptionDuration: 5,
  bloomActivationCastCount: 1,
  tempBloomDuration: 10,
  tempBloomRegenPerSecond: 1
};

const ENEMY_STATS = {
  slime: { hp: 2, damage: 1, moveSpeed: 0.6, knockback: 0.75 },
  crawler: { hp: 3, damage: 1, moveSpeed: 0.9, dashSpeed: 2, dashCooldown: 3 },
  wisp: { hp: 1, damage: 1, moveSpeed: 0.8, projectileSpeed: 2.5, fireCooldown: 2 }
} as const;

const WORLD_RULES = {
  gateSproutsRequired: 2,
  shrineHealFull: true,
  shrineManaFull: true,
  shrineSingleUse: true,
  manaOrbValue: 1,
  heartFragmentsPerHeart: 2
};

const HEALTH_UNITS_PER_HEART = 2;

interface ScreenExit {
  north?: string;
  south?: string;
  east?: string;
  west?: string;
}

interface WallRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SproutDefinition {
  id: string;
  x: number;
  y: number;
  screenId: string;
}

interface PickupDefinition {
  id: string;
  kind: PickupKind;
  x: number;
  y: number;
  screenId: string;
}

interface GateDefinition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  requiredSprouts: string[];
}

interface ShrineDefinition {
  id: string;
  x: number;
  y: number;
}

interface PortalDefinition {
  id: string;
  x: number;
  y: number;
  target: string;
  targetEntry: { x: number; y: number };
}

interface EnemySpawnDefinition {
  id: string;
  kind: EnemyKind;
  x: number;
  y: number;
}

interface ScreenDefinition {
  id: string;
  kind: 'overworld' | 'dungeon' | 'shrine';
  exits: ScreenExit;
  walls: WallRect[];
  sprouts: SproutDefinition[];
  pickups: PickupDefinition[];
  enemies: EnemySpawnDefinition[];
  gate?: GateDefinition;
  shrine?: ShrineDefinition;
  portal?: PortalDefinition;
  label: string;
}

interface EnemyInstance {
  id: string;
  kind: EnemyKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  dashCooldown: number;
  dashTimer: number;
  fireCooldown: number;
  patrolDir: Direction;
}

interface ProjectileInstance {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
}

interface SpellEffect {
  timer: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

@Component({
  selector: 'mana-bloom-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mana-game" #container>
      <canvas #canvas></canvas>
      <div class="hud" *ngIf="gameState !== 'title'">
        <div class="hud-block">
          <div class="hud-label">Health</div>
          <div class="hearts">
            <span
              class="heart"
              *ngFor="let heart of hearts"
              [class.full]="heart === 'full'"
              [class.half]="heart === 'half'"></span>
          </div>
        </div>
        <div class="hud-block">
          <div class="hud-label">Mana</div>
          <div class="mana-orbs">
            <span
              class="orb"
              *ngFor="let orb of manaOrbs"
              [class.filled]="orb"></span>
          </div>
        </div>
        <div class="hud-block">
          <div class="hud-label">Spell</div>
          <div class="ability">Arcane Pulse</div>
        </div>
      </div>

      <div class="message" *ngIf="messageText">{{ messageText }}</div>

      <div class="overlay" *ngIf="gameState !== 'playing'">
        <div class="overlay-title" *ngIf="gameState === 'title'">MANA BLOOM</div>
        <div class="overlay-subtitle" *ngIf="gameState === 'title'">Enter to Begin</div>

        <div class="overlay-title" *ngIf="gameState === 'paused'">Paused</div>
        <div class="overlay-subtitle" *ngIf="gameState === 'paused'">Esc to Resume</div>

        <div class="overlay-title" *ngIf="gameState === 'dead'">Mana Withered</div>
        <div class="overlay-subtitle" *ngIf="gameState === 'dead'">Enter to Restart</div>

        <div class="overlay-title" *ngIf="gameState === 'won'">The Heart Awakens</div>
        <div class="overlay-subtitle" *ngIf="gameState === 'won'">Enter to Play Again</div>
      </div>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .mana-game {
      position: relative;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 20%, rgba(192, 132, 252, 0.25), transparent 50%), #100013;
      overflow: hidden;
      font-family: "IBM Plex Sans", "Inter", "Segoe UI", sans-serif;
      color: #f1e9ff;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    .hud {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      pointer-events: none;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 11px;
    }

    .hud-block {
      background: rgba(12, 4, 18, 0.75);
      border: 1px solid rgba(192, 132, 252, 0.4);
      padding: 8px 10px;
      min-width: 120px;
      box-shadow: 0 0 18px rgba(192, 132, 252, 0.25);
    }

    .hud-label {
      opacity: 0.7;
      font-size: 10px;
      margin-bottom: 6px;
    }

    .hearts {
      display: flex;
      gap: 4px;
    }

    .heart {
      width: 12px;
      height: 10px;
      border-radius: 3px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);
    }

    .heart.full {
      background: linear-gradient(135deg, #ff9ed6, #ff4fa8);
      box-shadow: 0 0 8px rgba(255, 79, 168, 0.7);
    }

    .heart.half {
      background: linear-gradient(90deg, #ff7fc1 50%, rgba(255, 255, 255, 0.1) 50%);
    }

    .mana-orbs {
      display: flex;
      gap: 4px;
    }

    .orb {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid rgba(192, 132, 252, 0.4);
      background: rgba(192, 132, 252, 0.1);
    }

    .orb.filled {
      background: radial-gradient(circle at 30% 30%, #f5e9ff, #9b5cf7);
      box-shadow: 0 0 10px rgba(155, 92, 247, 0.6);
    }

    .ability {
      font-size: 12px;
      text-transform: none;
      letter-spacing: 0;
    }

    .message {
      position: absolute;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(17, 6, 22, 0.9);
      padding: 8px 14px;
      border: 1px solid rgba(192, 132, 252, 0.5);
      box-shadow: 0 0 16px rgba(192, 132, 252, 0.35);
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.1em;
    }

    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-align: center;
      background: radial-gradient(circle at center, rgba(14, 4, 22, 0.35), rgba(5, 2, 10, 0.85));
      pointer-events: auto;
    }

    .overlay-title {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 0.2em;
    }

    .overlay-subtitle {
      font-size: 12px;
      opacity: 0.75;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    `
  ]
})
export class ManaBloomGameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  gameState: GameState = 'title';
  hearts: Array<'full' | 'half' | 'empty'> = [];
  manaOrbs: boolean[] = [];
  messageText = '';

  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private lastTimestamp = 0;
  private accumulator = 0;
  private resizeObserver: ResizeObserver | null = null;
  private tileSize = 24;
  private offsetX = 0;
  private offsetY = 0;

  private readonly keyState = new Set<string>();
  private readonly onKeyDownBound = (event: KeyboardEvent) => this.handleKeyDown(event);
  private readonly onKeyUpBound = (event: KeyboardEvent) => this.handleKeyUp(event);

  private currentScreenId = 'over-1-0';
  private player = {
    x: 8,
    y: 6,
    dir: 'down' as Direction,
    health: PLAYER_STATS.maxHealthStart * HEALTH_UNITS_PER_HEART,
    maxHealth: PLAYER_STATS.maxHealthStart * HEALTH_UNITS_PER_HEART,
    mana: MANA_STATS.max,
    attackCooldown: 0,
    attackTimer: 0,
    attackHits: new Set<string>(),
    spellCooldown: 0,
    knockbackTimer: 0,
    knockbackX: 0,
    knockbackY: 0,
    manaRegenCooldown: 0,
    tempBloomTimer: 0,
    heartFragments: 0
  };

  private worldState = {
    sproutsActive: new Map<string, boolean>(),
    pickupsCollected: new Map<string, boolean>(),
    shrinesUsed: new Map<string, boolean>(),
    enemiesByScreen: new Map<string, EnemyInstance[]>(),
    corruptionTiles: new Map<string, number>(),
    spellEffects: [] as SpellEffect[],
    projectiles: [] as ProjectileInstance[]
  };

  private totalSproutCount = 0;
  private heartAwakened = false;
  private messageTimer = 0;
  private projectileCounter = 0;

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.setupWorldState();
    this.setupResizeObserver();
    this.resetHud();
    window.addEventListener('keydown', this.onKeyDownBound);
    window.addEventListener('keyup', this.onKeyUpBound);
    this.render();
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDownBound);
    window.removeEventListener('keyup', this.onKeyUpBound);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private setupWorldState() {
    const allSprouts = getAllSprouts();
    this.totalSproutCount = allSprouts.length;
    allSprouts.forEach((sprout) => {
      this.worldState.sproutsActive.set(sprout.id, false);
    });
    getAllPickups().forEach((pickup) => {
      this.worldState.pickupsCollected.set(pickup.id, false);
    });
    getAllShrines().forEach((shrine) => {
      this.worldState.shrinesUsed.set(shrine.id, false);
    });
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(this.containerRef.nativeElement);
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    this.tileSize = Math.floor(
      Math.min(canvas.width / GRID_COLS, canvas.height / GRID_ROWS)
    );
    const gridWidth = this.tileSize * GRID_COLS;
    const gridHeight = this.tileSize * GRID_ROWS;
    this.offsetX = (canvas.width - gridWidth) / 2;
    this.offsetY = (canvas.height - gridHeight) / 2;
    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (this.isControlKey(event.code)) {
      event.preventDefault();
    }
    this.keyState.add(event.code);

    if (event.code === 'Escape') {
      if (this.gameState === 'playing') {
        this.gameState = 'paused';
        this.stopLoop();
        this.render();
      } else if (this.gameState === 'paused') {
        this.gameState = 'playing';
        this.startLoop();
      }
      return;
    }

    if (event.code === 'Enter') {
      if (this.gameState === 'title' || this.gameState === 'dead' || this.gameState === 'won') {
        this.resetGame();
        this.gameState = 'playing';
        this.startLoop();
        return;
      }

      if (this.gameState === 'playing') {
        this.handleInteract();
      }
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.keyState.delete(event.code);
  }

  private startLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.lastTimestamp = performance.now();
    this.accumulator = 0;
    this.animationFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }

  private stopLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop(timestamp: number) {
    if (this.gameState !== 'playing') {
      return;
    }
    const delta = Math.min(0.1, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;
    this.accumulator += delta;
    while (this.accumulator >= FIXED_STEP) {
      this.update(FIXED_STEP);
      this.accumulator -= FIXED_STEP;
    }
    this.render();
    this.animationFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }

  private update(dt: number) {
    this.updateTimers(dt);
    this.updatePlayer(dt);
    this.updateEnemies(dt);
    this.updateProjectiles(dt);
    this.resolveCombat();
    this.updateMana(dt);
    this.updateMessages(dt);
    this.checkTransitions();
  }

  private updateTimers(dt: number) {
    this.player.attackCooldown = Math.max(0, this.player.attackCooldown - dt);
    this.player.attackTimer = Math.max(0, this.player.attackTimer - dt);
    this.player.spellCooldown = Math.max(0, this.player.spellCooldown - dt);
    this.player.knockbackTimer = Math.max(0, this.player.knockbackTimer - dt);
    this.player.manaRegenCooldown = Math.max(0, this.player.manaRegenCooldown - dt);
    if (this.player.tempBloomTimer > 0) {
      this.player.tempBloomTimer = Math.max(0, this.player.tempBloomTimer - dt);
    }

    this.worldState.spellEffects.forEach((effect) => {
      effect.timer -= dt;
    });
    this.worldState.spellEffects = this.worldState.spellEffects.filter((effect) => effect.timer > 0);

    for (const [key, remaining] of this.worldState.corruptionTiles.entries()) {
      const next = remaining - dt;
      if (next <= 0) {
        this.worldState.corruptionTiles.delete(key);
      } else {
        this.worldState.corruptionTiles.set(key, next);
      }
    }
  }

  private updatePlayer(dt: number) {
    if (this.player.knockbackTimer > 0) {
      this.moveEntity(this.player.knockbackX * dt, this.player.knockbackY * dt);
      return;
    }

    const input = this.getMovementInput();
    const speed = PLAYER_STATS.moveSpeed;
    const dx = input.x * speed * dt;
    const dy = input.y * speed * dt;
    if (input.x !== 0 || input.y !== 0) {
      this.updateFacing(input.x, input.y);
      this.moveEntity(dx, dy);
    }

    if (this.isAttackTriggered()) {
      this.performAttack();
    }

    if (this.isSpellTriggered()) {
      this.performSpell();
    }
  }

  private updateEnemies(dt: number) {
    const enemies = this.getEnemiesForScreen(this.currentScreenId);
    const manaActive = this.isManaActiveZone(this.currentScreenId);

    enemies.forEach((enemy) => {
      if (enemy.kind === 'slime') {
        if (manaActive) {
          return;
        }
        this.chasePlayer(enemy, ENEMY_STATS.slime.moveSpeed, dt);
      } else if (enemy.kind === 'crawler') {
        this.updateCrawler(enemy, dt);
      } else if (enemy.kind === 'wisp') {
        this.updateWisp(enemy, dt);
      }
    });
  }

  private updateProjectiles(dt: number) {
    this.worldState.projectiles.forEach((projectile) => {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
    });
    this.worldState.projectiles = this.worldState.projectiles.filter(
      (projectile) =>
        projectile.x >= -1 &&
        projectile.x <= GRID_COLS + 1 &&
        projectile.y >= -1 &&
        projectile.y <= GRID_ROWS + 1
    );
  }

  private resolveCombat() {
    this.resolveEnemyHits();
    this.resolvePlayerHits();
  }

  private updateMana(dt: number) {
    if (this.player.manaRegenCooldown > 0) {
      return;
    }

    const regenSources = this.isNearActiveSprout()
      ? 1 / MANA_STATS.regenActiveSecondsPerMana
      : 0;
    const tempBloomRegen = this.player.tempBloomTimer > 0 ? MANA_STATS.tempBloomRegenPerSecond : 0;
    const regenRate = regenSources + tempBloomRegen;
    if (regenRate <= 0) {
      return;
    }
    const manaGain = regenRate * dt;
    this.player.mana = Math.min(MANA_STATS.max, this.player.mana + manaGain);
    this.resetHud();
  }

  private updateMessages(dt: number) {
    if (this.messageTimer > 0) {
      this.messageTimer = Math.max(0, this.messageTimer - dt);
      if (this.messageTimer === 0) {
        this.messageText = '';
      }
    }
  }

  private checkTransitions() {
    const screen = getScreenById(this.currentScreenId);
    if (!screen) {
      return;
    }
    if (this.player.x < 0 && screen.exits.west) {
      this.currentScreenId = screen.exits.west;
      this.player.x = GRID_COLS - 1.2;
      this.syncScreen();
    } else if (this.player.x > GRID_COLS - 1 && screen.exits.east) {
      this.currentScreenId = screen.exits.east;
      this.player.x = 0.2;
      this.syncScreen();
    } else if (this.player.y < 0 && screen.exits.north) {
      this.currentScreenId = screen.exits.north;
      this.player.y = GRID_ROWS - 1.2;
      this.syncScreen();
    } else if (this.player.y > GRID_ROWS - 1 && screen.exits.south) {
      this.currentScreenId = screen.exits.south;
      this.player.y = 0.2;
      this.syncScreen();
    }
  }

  private syncScreen() {
    this.player.attackHits.clear();
    this.worldState.projectiles = this.worldState.projectiles.filter(
      (projectile) => projectile.id.startsWith(this.currentScreenId)
    );
  }

  private handleInteract() {
    const screen = getScreenById(this.currentScreenId);
    if (!screen) {
      return;
    }

    if (screen.portal && this.isWithinRange(screen.portal.x, screen.portal.y, 1)) {
      this.currentScreenId = screen.portal.target;
      this.player.x = screen.portal.targetEntry.x;
      this.player.y = screen.portal.targetEntry.y;
      return;
    }

    if (screen.shrine && this.isWithinRange(screen.shrine.x, screen.shrine.y, 1)) {
      const used = this.worldState.shrinesUsed.get(screen.shrine.id);
      if (!used) {
        if (WORLD_RULES.shrineHealFull) {
          this.player.health = this.player.maxHealth;
        }
        if (WORLD_RULES.shrineManaFull) {
          this.player.mana = MANA_STATS.max;
        }
        if (WORLD_RULES.shrineSingleUse) {
          this.worldState.shrinesUsed.set(screen.shrine.id, true);
        }
        this.resetHud();
      }
      return;
    }

    if (screen.kind === 'shrine' && screen.shrine && this.allSproutsActive()) {
      if (!this.isWithinRange(screen.shrine.x, screen.shrine.y, 1)) {
        return;
      }
      this.gameState = 'won';
      this.stopLoop();
    }
  }

  private getMovementInput() {
    const left = this.keyState.has('ArrowLeft') || this.keyState.has('KeyA');
    const right = this.keyState.has('ArrowRight') || this.keyState.has('KeyD');
    const up = this.keyState.has('ArrowUp') || this.keyState.has('KeyW');
    const down = this.keyState.has('ArrowDown') || this.keyState.has('KeyS');
    const x = (right ? 1 : 0) - (left ? 1 : 0);
    const y = (down ? 1 : 0) - (up ? 1 : 0);
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  }

  private updateFacing(x: number, y: number) {
    if (Math.abs(x) > Math.abs(y)) {
      this.player.dir = x > 0 ? 'right' : 'left';
    } else {
      this.player.dir = y > 0 ? 'down' : 'up';
    }
  }

  private isAttackTriggered(): boolean {
    return (
      (this.keyState.has('KeyZ') || this.keyState.has('Space')) &&
      this.player.attackCooldown === 0
    );
  }

  private performAttack() {
    this.player.attackCooldown = PLAYER_STATS.attackCooldown;
    this.player.attackTimer = PLAYER_STATS.attackCooldown;
    this.player.attackHits.clear();
  }

  private isSpellTriggered(): boolean {
    return this.keyState.has('KeyX') && this.player.spellCooldown === 0;
  }

  private performSpell() {
    if (this.player.mana < PLAYER_STATS.spellCost) {
      return;
    }
    this.player.mana -= PLAYER_STATS.spellCost;
    this.player.spellCooldown = PLAYER_STATS.spellCooldown;
    this.player.manaRegenCooldown = MANA_STATS.regenDelayAfterCast;
    this.resetHud();

    const effect = this.computeSpellEffect();
    this.worldState.spellEffects.push(effect);
    this.applySpellDamage(effect);
    this.applySpellCorruption();
  }

  private computeSpellEffect(): SpellEffect {
    const { dx, dy } = this.directionToVector(this.player.dir);
    const startX = this.player.x + 0.5;
    const startY = this.player.y + 0.5;
    const endX = startX + dx * PLAYER_STATS.spellRange;
    const endY = startY + dy * PLAYER_STATS.spellRange;
    return { timer: PLAYER_STATS.spellCooldown, startX, startY, endX, endY };
  }

  private applySpellDamage(effect: SpellEffect) {
    const enemies = this.getEnemiesForScreen(this.currentScreenId);
    enemies.forEach((enemy) => {
      if (this.isEnemyInLine(enemy, effect)) {
        enemy.hp -= PLAYER_STATS.spellDamage;
      }
    });
  }

  private applySpellCorruption() {
    const screen = getScreenById(this.currentScreenId);
    if (!screen) {
      return;
    }
    const tx = Math.floor(this.player.x);
    const ty = Math.floor(this.player.y);
    let corrupted = false;
    if (this.isWithinBounds(tx, ty) && getTileAt(screen, tx, ty) === 'w') {
      const key = `${screen.id}:${tx}:${ty}`;
      this.worldState.corruptionTiles.set(key, MANA_STATS.castCorruptionDuration);
      corrupted = true;
    }
    if (corrupted) {
      this.showMessage('Mana Withered');
    }

    screen.sprouts.forEach((sprout) => {
      if (!this.worldState.sproutsActive.get(sprout.id)) {
        if (this.isWithinRange(sprout.x, sprout.y, 1)) {
          this.worldState.sproutsActive.set(sprout.id, true);
          this.showMessage('Mana Bloomed');
        }
      }
    });

    if (!this.heartAwakened && this.allSproutsActive()) {
      this.heartAwakened = true;
      this.showMessage('The Heart Awakens');
    }
  }

  private resolveEnemyHits() {
    if (this.player.attackTimer <= 0) {
      return;
    }
    const enemies = this.getEnemiesForScreen(this.currentScreenId);
    enemies.forEach((enemy) => {
      if (this.player.attackHits.has(enemy.id)) {
        return;
      }
      if (this.isEnemyInMeleeRange(enemy)) {
        enemy.hp -= PLAYER_STATS.attackDamage;
        if (enemy.kind === 'slime') {
          const vec = this.directionToVector(this.player.dir);
          enemy.x += vec.dx * ENEMY_STATS.slime.knockback;
          enemy.y += vec.dy * ENEMY_STATS.slime.knockback;
        }
        this.player.attackHits.add(enemy.id);
      }
    });
    this.cleanupDefeatedEnemies();
  }

  private resolvePlayerHits() {
    if (this.player.knockbackTimer > 0) {
      return;
    }
    const enemies = this.getEnemiesForScreen(this.currentScreenId);
    const manaActive = this.isManaActiveZone(this.currentScreenId);
    for (const enemy of enemies) {
      if (manaActive && enemy.kind === 'slime') {
        continue;
      }
      if (this.isOverlapping(enemy.x, enemy.y, 0)) {
        this.applyPlayerDamage(ENEMY_STATS[enemy.kind].damage);
        return;
      }
    }

    for (const projectile of this.worldState.projectiles) {
      if (this.isOverlapping(projectile.x, projectile.y, 0)) {
        this.applyPlayerDamage(projectile.damage);
        return;
      }
    }
  }

  private applyPlayerDamage(damage: number) {
    const damageUnits = damage * HEALTH_UNITS_PER_HEART;
    this.player.health = Math.max(0, this.player.health - damageUnits);
    this.resetHud();
    this.applyPlayerKnockback();
    if (this.player.health <= 0) {
      this.gameState = 'dead';
      this.stopLoop();
    }
  }

  private applyPlayerKnockback() {
    const vec = this.directionToVector(this.player.dir);
    this.player.knockbackTimer = PLAYER_STATS.knockbackStun;
    this.player.knockbackX = -vec.dx * PLAYER_STATS.knockbackDistance / PLAYER_STATS.knockbackStun;
    this.player.knockbackY = -vec.dy * PLAYER_STATS.knockbackDistance / PLAYER_STATS.knockbackStun;
  }

  private updateCrawler(enemy: EnemyInstance, dt: number) {
    enemy.dashCooldown = Math.max(0, enemy.dashCooldown - dt);
    if (enemy.dashTimer > 0) {
      enemy.dashTimer = Math.max(0, enemy.dashTimer - dt);
      this.chasePlayer(enemy, ENEMY_STATS.crawler.dashSpeed, dt);
      return;
    }

    if (enemy.dashCooldown === 0 && this.distanceTo(enemy.x, enemy.y) < PLAYER_STATS.spellRange) {
      enemy.dashTimer = PLAYER_STATS.attackCooldown;
      enemy.dashCooldown = ENEMY_STATS.crawler.dashCooldown;
      return;
    }

    this.patrol(enemy, ENEMY_STATS.crawler.moveSpeed, dt);
  }

  private updateWisp(enemy: EnemyInstance, dt: number) {
    enemy.fireCooldown = Math.max(0, enemy.fireCooldown - dt);
    const distance = this.distanceTo(enemy.x, enemy.y);
    const speed = ENEMY_STATS.wisp.moveSpeed;
    if (distance < PLAYER_STATS.spellRange) {
      this.moveAway(enemy, speed, dt);
    }

    if (enemy.fireCooldown === 0 && distance <= PLAYER_STATS.spellRange) {
      enemy.fireCooldown = ENEMY_STATS.wisp.fireCooldown;
      this.spawnProjectile(enemy);
    }
  }

  private spawnProjectile(enemy: EnemyInstance) {
    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const length = Math.hypot(dx, dy) || 1;
    const speed = ENEMY_STATS.wisp.projectileSpeed;
    this.projectileCounter += 1;
    this.worldState.projectiles.push({
      id: `${this.currentScreenId}-proj-${enemy.id}-${this.projectileCounter}`,
      x: enemy.x + 0.5,
      y: enemy.y + 0.5,
      vx: (dx / length) * speed,
      vy: (dy / length) * speed,
      damage: ENEMY_STATS.wisp.damage
    });
  }

  private chasePlayer(enemy: EnemyInstance, speed: number, dt: number) {
    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const length = Math.hypot(dx, dy) || 1;
    enemy.x += (dx / length) * speed * dt;
    enemy.y += (dy / length) * speed * dt;
  }

  private moveAway(enemy: EnemyInstance, speed: number, dt: number) {
    const dx = enemy.x - this.player.x;
    const dy = enemy.y - this.player.y;
    const length = Math.hypot(dx, dy) || 1;
    enemy.x += (dx / length) * speed * dt;
    enemy.y += (dy / length) * speed * dt;
  }

  private patrol(enemy: EnemyInstance, speed: number, dt: number) {
    const dir = this.directionToVector(enemy.patrolDir);
    enemy.x += dir.dx * speed * dt;
    enemy.y += dir.dy * speed * dt;
    if (!this.isPassable(Math.floor(enemy.x), Math.floor(enemy.y))) {
      enemy.patrolDir = enemy.patrolDir === 'left' ? 'right' : 'left';
    }
  }

  private cleanupDefeatedEnemies() {
    const enemies = this.getEnemiesForScreen(this.currentScreenId);
    const remaining = enemies.filter((enemy) => enemy.hp > 0);
    this.worldState.enemiesByScreen.set(this.currentScreenId, remaining);
  }

  private moveEntity(dx: number, dy: number) {
    const screen = getScreenById(this.currentScreenId);
    if (!screen) {
      return;
    }
    const nextX = this.player.x + dx;
    const nextY = this.player.y + dy;
    if (nextX < 0) {
      if (screen.exits.west && this.isExitAligned('west')) {
        this.player.x = nextX;
      } else {
        this.player.x = 0;
      }
    } else if (nextX > GRID_COLS - 1) {
      if (screen.exits.east && this.isExitAligned('east')) {
        this.player.x = nextX;
      } else {
        this.player.x = GRID_COLS - 1;
      }
    } else if (this.isPassable(Math.floor(nextX), Math.floor(this.player.y))) {
      this.player.x = nextX;
    }
    if (nextY < 0) {
      if (screen.exits.north && this.isExitAligned('north')) {
        this.player.y = nextY;
      } else {
        this.player.y = 0;
      }
    } else if (nextY > GRID_ROWS - 1) {
      if (screen.exits.south && this.isExitAligned('south')) {
        this.player.y = nextY;
      } else {
        this.player.y = GRID_ROWS - 1;
      }
    } else if (this.isPassable(Math.floor(this.player.x), Math.floor(nextY))) {
      this.player.y = nextY;
    }
    this.collectPickups();
  }

  private isExitAligned(direction: ExitDirection): boolean {
    const tileX = Math.floor(this.player.x);
    const tileY = Math.floor(this.player.y);
    if (direction === 'west' || direction === 'east') {
      return tileY === 5 || tileY === 6;
    }
    return tileX === 7 || tileX === 8;
  }

  private collectPickups() {
    const screen = getScreenById(this.currentScreenId);
    if (!screen) {
      return;
    }
    screen.pickups.forEach((pickup) => {
      if (this.worldState.pickupsCollected.get(pickup.id)) {
        return;
      }
      if (this.isWithinRange(pickup.x, pickup.y, 0)) {
        this.worldState.pickupsCollected.set(pickup.id, true);
        if (pickup.kind === 'mana') {
          this.player.mana = Math.min(MANA_STATS.max, this.player.mana + WORLD_RULES.manaOrbValue);
        } else if (pickup.kind === 'heart') {
          this.player.heartFragments += 1;
          if (this.player.heartFragments >= WORLD_RULES.heartFragmentsPerHeart) {
            this.player.heartFragments = 0;
            this.player.maxHealth = Math.min(
              PLAYER_STATS.maxHealthCap * HEALTH_UNITS_PER_HEART,
              this.player.maxHealth + HEALTH_UNITS_PER_HEART
            );
            this.player.health = this.player.maxHealth;
          }
        } else if (pickup.kind === 'bloom') {
          this.player.tempBloomTimer = MANA_STATS.tempBloomDuration;
        }
        this.resetHud();
      }
    });
  }

  private render() {
    const ctx = this.ctx;
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    this.renderTiles(ctx);
    this.renderObjects(ctx);
    ctx.restore();
  }

  private renderTiles(ctx: CanvasRenderingContext2D) {
    const screen = getScreenById(this.currentScreenId);
    if (!screen) {
      return;
    }
    const tiles = buildTilesForScreen(screen);
    const manaActive = this.isManaActiveZone(screen.id);

    for (let y = 0; y < GRID_ROWS; y += 1) {
      for (let x = 0; x < GRID_COLS; x += 1) {
        const tile = tiles[y][x];
        const baseColor = this.getTileColor(tile, manaActive);
        ctx.fillStyle = baseColor;
        ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

        const key = `${screen.id}:${x}:${y}`;
        if (this.worldState.corruptionTiles.has(key)) {
          ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
          ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }
  }

  private renderObjects(ctx: CanvasRenderingContext2D) {
    const screen = getScreenById(this.currentScreenId);
    if (!screen) {
      return;
    }

    screen.sprouts.forEach((sprout) => {
      const active = this.worldState.sproutsActive.get(sprout.id);
      ctx.fillStyle = active ? '#b7ffb7' : '#5a4b3f';
      ctx.beginPath();
      ctx.arc(
        (sprout.x + 0.5) * this.tileSize,
        (sprout.y + 0.5) * this.tileSize,
        this.tileSize * 0.25,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    screen.pickups.forEach((pickup) => {
      if (this.worldState.pickupsCollected.get(pickup.id)) {
        return;
      }
      ctx.fillStyle =
        pickup.kind === 'mana' ? '#7dd3fc' : pickup.kind === 'heart' ? '#fb7185' : '#c084fc';
      ctx.fillRect(
        (pickup.x + 0.2) * this.tileSize,
        (pickup.y + 0.2) * this.tileSize,
        this.tileSize * 0.6,
        this.tileSize * 0.6
      );
    });

    if (screen.gate) {
      const unlocked = this.isGateUnlocked(screen.gate);
      ctx.fillStyle = unlocked ? 'rgba(124, 214, 255, 0.4)' : '#3b1f46';
      ctx.fillRect(
        screen.gate.x * this.tileSize,
        screen.gate.y * this.tileSize,
        screen.gate.width * this.tileSize,
        screen.gate.height * this.tileSize
      );
    }

    if (screen.portal) {
      ctx.strokeStyle = '#f0abfc';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        screen.portal.x * this.tileSize,
        screen.portal.y * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }

    if (screen.shrine) {
      const used = this.worldState.shrinesUsed.get(screen.shrine.id);
      ctx.fillStyle = used ? '#2a1a33' : '#f3d8ff';
      ctx.fillRect(
        screen.shrine.x * this.tileSize,
        screen.shrine.y * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }

    const enemies = this.getEnemiesForScreen(screen.id);
    enemies.forEach((enemy) => {
      ctx.fillStyle = enemy.kind === 'slime' ? '#7f1d1d' : enemy.kind === 'crawler' ? '#4c1d95' : '#38bdf8';
      ctx.fillRect(
        enemy.x * this.tileSize,
        enemy.y * this.tileSize,
        this.tileSize * 0.9,
        this.tileSize * 0.9
      );
    });

    this.worldState.projectiles.forEach((projectile) => {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(
        projectile.x * this.tileSize,
        projectile.y * this.tileSize,
        this.tileSize * 0.2,
        this.tileSize * 0.2
      );
    });

    this.worldState.spellEffects.forEach((effect) => {
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(effect.startX * this.tileSize, effect.startY * this.tileSize);
      ctx.lineTo(effect.endX * this.tileSize, effect.endY * this.tileSize);
      ctx.stroke();
    });

    ctx.fillStyle = '#f9a8d4';
    ctx.fillRect(
      this.player.x * this.tileSize,
      this.player.y * this.tileSize,
      this.tileSize * 0.9,
      this.tileSize * 0.9
    );
  }

  private getTileColor(tile: string, manaActive: boolean): string {
    if (tile === '#') {
      return '#22152d';
    }
    if (tile === 'w') {
      return manaActive ? '#2f3a2b' : '#3a2d24';
    }
    return '#2d2b3a';
  }

  private resetGame() {
    this.currentScreenId = 'over-1-0';
    this.player.x = 8;
    this.player.y = 6;
    this.player.dir = 'down';
    this.player.health = PLAYER_STATS.maxHealthStart * HEALTH_UNITS_PER_HEART;
    this.player.maxHealth = PLAYER_STATS.maxHealthStart * HEALTH_UNITS_PER_HEART;
    this.player.mana = MANA_STATS.max;
    this.player.attackCooldown = 0;
    this.player.attackTimer = 0;
    this.player.spellCooldown = 0;
    this.player.knockbackTimer = 0;
    this.player.manaRegenCooldown = 0;
    this.player.tempBloomTimer = 0;
    this.player.heartFragments = 0;
    this.worldState.sproutsActive.forEach((_, key) => this.worldState.sproutsActive.set(key, false));
    this.worldState.pickupsCollected.forEach((_, key) => this.worldState.pickupsCollected.set(key, false));
    this.worldState.shrinesUsed.forEach((_, key) => this.worldState.shrinesUsed.set(key, false));
    this.worldState.enemiesByScreen.clear();
    this.worldState.projectiles = [];
    this.worldState.spellEffects = [];
    this.worldState.corruptionTiles.clear();
    this.heartAwakened = false;
    this.messageText = '';
    this.messageTimer = 0;
    this.projectileCounter = 0;
    this.resetHud();
  }

  private resetHud() {
    const hearts: Array<'full' | 'half' | 'empty'> = [];
    const maxHearts = this.player.maxHealth / HEALTH_UNITS_PER_HEART;
    let remaining = this.player.health;
    for (let i = 0; i < maxHearts; i += 1) {
      if (remaining >= HEALTH_UNITS_PER_HEART) {
        hearts.push('full');
        remaining -= HEALTH_UNITS_PER_HEART;
      } else if (remaining === 1) {
        hearts.push('half');
        remaining -= 1;
      } else {
        hearts.push('empty');
      }
    }
    this.hearts = hearts;
    this.manaOrbs = Array.from({ length: MANA_STATS.max }, (_, index) => this.player.mana > index + 0.2);
  }

  private showMessage(text: string) {
    this.messageText = text;
    this.messageTimer = 1.5;
  }

  private isPassable(tileX: number, tileY: number): boolean {
    if (!this.isWithinBounds(tileX, tileY)) {
      return false;
    }
    const screen = getScreenById(this.currentScreenId);
    if (!screen) {
      return false;
    }
    const tile = getTileAt(screen, tileX, tileY);
    if (tile === '#') {
      return false;
    }
    if (screen.gate && !this.isGateUnlocked(screen.gate)) {
      const withinGate =
        tileX >= screen.gate.x &&
        tileX < screen.gate.x + screen.gate.width &&
        tileY >= screen.gate.y &&
        tileY < screen.gate.y + screen.gate.height;
      if (withinGate) {
        return false;
      }
    }
    return true;
  }

  private isGateUnlocked(gate: GateDefinition): boolean {
    return gate.requiredSprouts.every((sproutId) => this.worldState.sproutsActive.get(sproutId));
  }

  private isManaActiveZone(screenId: string): boolean {
    const screen = getScreenById(screenId);
    if (!screen) {
      return false;
    }
    return screen.sprouts.some((sprout) => this.worldState.sproutsActive.get(sprout.id));
  }

  private isNearActiveSprout(): boolean {
    const screen = getScreenById(this.currentScreenId);
    if (!screen) {
      return false;
    }
    return screen.sprouts.some((sprout) => {
      if (!this.worldState.sproutsActive.get(sprout.id)) {
        return false;
      }
      return this.isWithinRange(sprout.x, sprout.y, PLAYER_STATS.spellRange);
    });
  }

  private allSproutsActive(): boolean {
    let activeCount = 0;
    this.worldState.sproutsActive.forEach((active) => {
      if (active) {
        activeCount += 1;
      }
    });
    return activeCount >= this.totalSproutCount;
  }

  private isEnemyInMeleeRange(enemy: EnemyInstance): boolean {
    const playerTileX = Math.floor(this.player.x);
    const playerTileY = Math.floor(this.player.y);
    const enemyTileX = Math.floor(enemy.x);
    const enemyTileY = Math.floor(enemy.y);
    switch (this.player.dir) {
      case 'up':
        return enemyTileX === playerTileX && enemyTileY === playerTileY - 1;
      case 'down':
        return enemyTileX === playerTileX && enemyTileY === playerTileY + 1;
      case 'left':
        return enemyTileX === playerTileX - 1 && enemyTileY === playerTileY;
      case 'right':
      default:
        return enemyTileX === playerTileX + 1 && enemyTileY === playerTileY;
    }
  }

  private isEnemyInLine(enemy: EnemyInstance, effect: SpellEffect): boolean {
    const playerTileX = Math.floor(this.player.x);
    const playerTileY = Math.floor(this.player.y);
    const enemyTileX = Math.floor(enemy.x);
    const enemyTileY = Math.floor(enemy.y);
    const range = Math.ceil(PLAYER_STATS.spellRange);
    switch (this.player.dir) {
      case 'up':
        return enemyTileX === playerTileX && playerTileY - enemyTileY <= range && enemyTileY < playerTileY;
      case 'down':
        return enemyTileX === playerTileX && enemyTileY - playerTileY <= range && enemyTileY > playerTileY;
      case 'left':
        return enemyTileY === playerTileY && playerTileX - enemyTileX <= range && enemyTileX < playerTileX;
      case 'right':
      default:
        return enemyTileY === playerTileY && enemyTileX - playerTileX <= range && enemyTileX > playerTileX;
    }
  }

  private isOverlapping(x: number, y: number, radius: number): boolean {
    return Math.floor(this.player.x) === Math.floor(x) && Math.floor(this.player.y) === Math.floor(y);
  }

  private isWithinRange(x: number, y: number, range: number): boolean {
    const playerTileX = Math.floor(this.player.x);
    const playerTileY = Math.floor(this.player.y);
    const distance = Math.abs(playerTileX - x) + Math.abs(playerTileY - y);
    return distance <= range;
  }

  private distanceTo(x: number, y: number): number {
    return Math.hypot(this.player.x - x, this.player.y - y);
  }

  private directionToVector(dir: Direction) {
    switch (dir) {
      case 'up':
        return { dx: 0, dy: -1 };
      case 'down':
        return { dx: 0, dy: 1 };
      case 'left':
        return { dx: -1, dy: 0 };
      case 'right':
      default:
        return { dx: 1, dy: 0 };
    }
  }

  private isWithinBounds(x: number, y: number): boolean {
    return x >= 0 && x < GRID_COLS && y >= 0 && y < GRID_ROWS;
  }

  private isControlKey(code: string): boolean {
    return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyZ', 'KeyX', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Escape', 'Enter'].includes(code);
  }

  private getEnemiesForScreen(screenId: string): EnemyInstance[] {
    const existing = this.worldState.enemiesByScreen.get(screenId);
    if (existing) {
      return existing;
    }
    const screen = getScreenById(screenId);
    if (!screen) {
      return [];
    }
    const instances = screen.enemies.map((spawn) => ({
      id: spawn.id,
      kind: spawn.kind,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      hp: ENEMY_STATS[spawn.kind].hp,
      dashCooldown: 0,
      dashTimer: 0,
      fireCooldown: 0,
      patrolDir: 'left' as Direction
    }));
    this.worldState.enemiesByScreen.set(screenId, instances);
    return instances;
  }
}

const OVERWORLD_SCREENS: ScreenDefinition[] = [
  createScreen({
    id: 'over-0-0',
    label: 'Ash Hollow',
    exits: { east: 'over-1-0', south: 'over-0-1' },
    walls: [{ x: 4, y: 2, w: 2, h: 4 }],
    sprouts: [
      { id: 'sprout-0-0-a', x: 3, y: 7, screenId: 'over-0-0' }
    ],
    pickups: [
      { id: 'pickup-0-0-mana', kind: 'mana', x: 12, y: 7, screenId: 'over-0-0' }
    ],
    enemies: [
      { id: 'enemy-0-0-s1', kind: 'slime', x: 6, y: 6 },
      { id: 'enemy-0-0-w1', kind: 'wisp', x: 10, y: 4 }
    ]
  }),
  createScreen({
    id: 'over-1-0',
    label: 'Lantern Crossing',
    exits: { west: 'over-0-0', east: 'over-2-0', south: 'over-1-1' },
    walls: [{ x: 7, y: 3, w: 2, h: 2 }],
    sprouts: [
      { id: 'sprout-1-0-a', x: 12, y: 6, screenId: 'over-1-0' }
    ],
    pickups: [
      { id: 'pickup-1-0-heart', kind: 'heart', x: 2, y: 5, screenId: 'over-1-0' }
    ],
    enemies: [
      { id: 'enemy-1-0-s1', kind: 'slime', x: 4, y: 7 }
    ]
  }),
  createScreen({
    id: 'over-2-0',
    label: 'Briar Verge',
    exits: { west: 'over-1-0', south: 'over-2-1' },
    walls: [{ x: 5, y: 6, w: 6, h: 1 }],
    sprouts: [
      { id: 'sprout-2-0-a', x: 3, y: 3, screenId: 'over-2-0' }
    ],
    pickups: [
      { id: 'pickup-2-0-bloom', kind: 'bloom', x: 13, y: 5, screenId: 'over-2-0' }
    ],
    enemies: [
      { id: 'enemy-2-0-c1', kind: 'crawler', x: 8, y: 4 }
    ]
  }),
  createScreen({
    id: 'over-0-1',
    label: 'Dust Orchard',
    exits: { north: 'over-0-0', east: 'over-1-1' },
    walls: [{ x: 2, y: 4, w: 3, h: 1 }],
    sprouts: [
      { id: 'sprout-0-1-a', x: 9, y: 8, screenId: 'over-0-1' }
    ],
    pickups: [
      { id: 'pickup-0-1-mana', kind: 'mana', x: 5, y: 2, screenId: 'over-0-1' }
    ],
    enemies: [
      { id: 'enemy-0-1-s1', kind: 'slime', x: 11, y: 5 }
    ]
  }),
  createScreen({
    id: 'over-1-1',
    label: 'Echo Fields',
    exits: { north: 'over-1-0', west: 'over-0-1', east: 'over-2-1' },
    walls: [{ x: 11, y: 2, w: 2, h: 4 }],
    sprouts: [
      { id: 'sprout-1-1-a', x: 6, y: 7, screenId: 'over-1-1' }
    ],
    pickups: [
      { id: 'pickup-1-1-heart', kind: 'heart', x: 3, y: 8, screenId: 'over-1-1' }
    ],
    enemies: [
      { id: 'enemy-1-1-c1', kind: 'crawler', x: 10, y: 7 },
      { id: 'enemy-1-1-w1', kind: 'wisp', x: 4, y: 3 }
    ]
  }),
  createScreen({
    id: 'over-2-1',
    label: 'Gate of Thorns',
    exits: { north: 'over-2-0', west: 'over-1-1' },
    walls: [{ x: 6, y: 4, w: 4, h: 1 }],
    sprouts: [
      { id: 'sprout-2-1-a', x: 12, y: 8, screenId: 'over-2-1' },
      { id: 'sprout-2-1-b', x: 2, y: 8, screenId: 'over-2-1' }
    ],
    pickups: [
      { id: 'pickup-2-1-mana', kind: 'mana', x: 8, y: 2, screenId: 'over-2-1' }
    ],
    enemies: [
      { id: 'enemy-2-1-s1', kind: 'slime', x: 6, y: 8 }
    ],
    gate: {
      id: 'gate-2-1',
      x: 14,
      y: 4,
      width: 1,
      height: 3,
      requiredSprouts: ['sprout-2-1-a', 'sprout-2-1-b']
    },
    portal: {
      id: 'portal-dungeon',
      x: 14,
      y: 5,
      target: 'dungeon-0',
      targetEntry: { x: 1, y: 5 }
    }
  })
];

const DUNGEON_SCREENS: ScreenDefinition[] = [
  createScreen({
    id: 'dungeon-0',
    label: 'Withered Vault',
    kind: 'dungeon',
    exits: {},
    walls: [
      { x: 3, y: 3, w: 10, h: 1 },
      { x: 3, y: 7, w: 10, h: 1 }
    ],
    sprouts: [],
    pickups: [
      { id: 'pickup-d0-mana', kind: 'mana', x: 8, y: 5, screenId: 'dungeon-0' }
    ],
    enemies: [
      { id: 'enemy-d0-c1', kind: 'crawler', x: 5, y: 5 },
      { id: 'enemy-d0-w1', kind: 'wisp', x: 10, y: 5 }
    ],
    gate: {
      id: 'gate-heart',
      x: 14,
      y: 4,
      width: 1,
      height: 3,
      requiredSprouts: [
        'sprout-0-0-a',
        'sprout-1-0-a',
        'sprout-2-0-a',
        'sprout-0-1-a',
        'sprout-1-1-a',
        'sprout-2-1-a',
        'sprout-2-1-b'
      ]
    },
    portal: {
      id: 'portal-shrine',
      x: 14,
      y: 5,
      target: 'shrine-0',
      targetEntry: { x: 2, y: 5 }
    },
    shrine: {
      id: 'shrine-d0',
      x: 8,
      y: 9
    }
  })
];

const SHRINE_SCREENS: ScreenDefinition[] = [
  createScreen({
    id: 'shrine-0',
    label: 'Heart Bloom',
    kind: 'shrine',
    exits: {},
    walls: [{ x: 2, y: 2, w: 12, h: 7 }],
    sprouts: [],
    pickups: [],
    enemies: [],
    shrine: {
      id: 'shrine-heart',
      x: 8,
      y: 5
    },
    portal: {
      id: 'portal-return',
      x: 1,
      y: 5,
      target: 'dungeon-0',
      targetEntry: { x: 13, y: 5 }
    }
  })
];

const ALL_SCREENS = [...OVERWORLD_SCREENS, ...DUNGEON_SCREENS, ...SHRINE_SCREENS];

function createScreen(data: Partial<ScreenDefinition> & { id: string; exits: ScreenExit; walls: WallRect[]; sprouts: SproutDefinition[]; pickups: PickupDefinition[]; enemies: EnemySpawnDefinition[]; label: string; }): ScreenDefinition {
  return {
    id: data.id,
    kind: data.kind ?? 'overworld',
    exits: data.exits,
    walls: data.walls,
    sprouts: data.sprouts,
    pickups: data.pickups,
    enemies: data.enemies,
    gate: data.gate,
    shrine: data.shrine,
    portal: data.portal,
    label: data.label
  };
}

function getScreenById(id: string): ScreenDefinition | undefined {
  return ALL_SCREENS.find((screen) => screen.id === id);
}

function getAllSprouts(): SproutDefinition[] {
  return ALL_SCREENS.flatMap((screen) => screen.sprouts);
}

function getAllPickups(): PickupDefinition[] {
  return ALL_SCREENS.flatMap((screen) => screen.pickups);
}

function getAllShrines(): ShrineDefinition[] {
  return ALL_SCREENS.flatMap((screen) => (screen.shrine ? [screen.shrine] : []));
}

function buildTilesForScreen(screen: ScreenDefinition): string[][] {
  const tiles = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => 'w')
  );

  for (let x = 0; x < GRID_COLS; x += 1) {
    tiles[0][x] = '#';
    tiles[GRID_ROWS - 1][x] = '#';
  }
  for (let y = 0; y < GRID_ROWS; y += 1) {
    tiles[y][0] = '#';
    tiles[y][GRID_COLS - 1] = '#';
  }

  openExit(tiles, screen.exits.north, 'north');
  openExit(tiles, screen.exits.south, 'south');
  openExit(tiles, screen.exits.west, 'west');
  openExit(tiles, screen.exits.east, 'east');

  screen.walls.forEach((wall) => {
    for (let y = wall.y; y < wall.y + wall.h; y += 1) {
      for (let x = wall.x; x < wall.x + wall.w; x += 1) {
        if (x >= 0 && x < GRID_COLS && y >= 0 && y < GRID_ROWS) {
          tiles[y][x] = '#';
        }
      }
    }
  });

  if (screen.kind === 'dungeon') {
    for (let y = 1; y < GRID_ROWS - 1; y += 1) {
      for (let x = 1; x < GRID_COLS - 1; x += 1) {
        if (tiles[y][x] !== '#') {
          tiles[y][x] = '.';
        }
      }
    }
  }

  if (screen.kind === 'shrine') {
    for (let y = 1; y < GRID_ROWS - 1; y += 1) {
      for (let x = 1; x < GRID_COLS - 1; x += 1) {
        if (tiles[y][x] !== '#') {
          tiles[y][x] = '.';
        }
      }
    }
  }

  return tiles;
}

function openExit(tiles: string[][], target: string | undefined, direction: ExitDirection) {
  if (!target) {
    return;
  }
  if (direction === 'north') {
    tiles[0][7] = 'w';
    tiles[0][8] = 'w';
  } else if (direction === 'south') {
    tiles[GRID_ROWS - 1][7] = 'w';
    tiles[GRID_ROWS - 1][8] = 'w';
  } else if (direction === 'west') {
    tiles[5][0] = 'w';
    tiles[6][0] = 'w';
  } else if (direction === 'east') {
    tiles[5][GRID_COLS - 1] = 'w';
    tiles[6][GRID_COLS - 1] = 'w';
  }
}

function getTileAt(screen: ScreenDefinition, x: number, y: number): string {
  const tiles = buildTilesForScreen(screen);
  return tiles[y]?.[x] ?? '#';
}
