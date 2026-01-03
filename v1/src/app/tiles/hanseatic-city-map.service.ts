import { Injectable } from '@angular/core';

export type TileCoord = {
  x: number;
  y: number;
};

export type Seed = string;
export type Tick = number;

export enum LedgerEventType {
  AnchorPlaced = 'ANCHOR_PLACED',
  HousePlaced = 'HOUSE_PLACED',
  PathUsage = 'PATH_USAGE',
  RoadUpgraded = 'ROAD_UPGRADED',
  DistrictReclassified = 'DISTRICT_RECLASSIFIED',
  ProjectStarted = 'PROJECT_STARTED',
  MaterialsDelivered = 'MATERIALS_DELIVERED',
  ProjectCompleted = 'PROJECT_COMPLETED',
  GlobalEvent = 'GLOBAL_EVENT',
}

export interface LedgerEventBase {
  id: string;
  t: Tick;
  type: LedgerEventType;
  cause: string;
}

export enum AnchorType {
  Dock = 'dock',
  Church = 'church',
  Market = 'market',
  Hall = 'hall',
  Monastery = 'monastery',
  Fort = 'fort',
  Kontor = 'kontor',
}

export interface AnchorPlacedEvent extends LedgerEventBase {
  type: LedgerEventType.AnchorPlaced;
  anchorType: AnchorType;
  position: TileCoord;
}

export enum BuildingType {
  House = 'house',
  Workshop = 'workshop',
  Warehouse = 'warehouse',
  Public = 'public',
}

export interface HousePlacedEvent extends LedgerEventBase {
  type: LedgerEventType.HousePlaced;
  position: TileCoord;
  householdId: string;
  buildingType: BuildingType;
}

export interface PathUsageEvent extends LedgerEventBase {
  type: LedgerEventType.PathUsage;
  from: TileCoord;
  to: TileCoord;
  amount: number;
}

export interface RoadUpgradedEvent extends LedgerEventBase {
  type: LedgerEventType.RoadUpgraded;
  cells: TileCoord[];
}

export enum GoodType {
  Stone = 'stone',
  Timber = 'timber',
  Lime = 'lime',
  Food = 'food',
  Cloth = 'cloth',
}

export interface MaterialsDeliveredEvent extends LedgerEventBase {
  type: LedgerEventType.MaterialsDelivered;
  good: GoodType;
  quantity: number;
  destination: TileCoord;
}

export interface DistrictReclassifiedEvent extends LedgerEventBase {
  type: LedgerEventType.DistrictReclassified;
  cells: TileCoord[];
  district: DistrictType;
}

export enum ProjectType {
  WallSegment = 'wall_segment',
  RoadPaving = 'road_paving',
}

export interface ProjectStartedEvent extends LedgerEventBase {
  type: LedgerEventType.ProjectStarted;
  projectId: string;
  projectType: ProjectType;
  cells: TileCoord[];
}

export interface ProjectCompletedEvent extends LedgerEventBase {
  type: LedgerEventType.ProjectCompleted;
  projectId: string;
  projectType: ProjectType;
  cells: TileCoord[];
}

export interface GlobalEvent extends LedgerEventBase {
  type: LedgerEventType.GlobalEvent;
  name: string;
}

export type LedgerEvent =
  | AnchorPlacedEvent
  | HousePlacedEvent
  | PathUsageEvent
  | RoadUpgradedEvent
  | MaterialsDeliveredEvent
  | DistrictReclassifiedEvent
  | ProjectStartedEvent
  | ProjectCompletedEvent
  | GlobalEvent;

export interface Ledger {
  readonly seed: Seed;
  append(event: LedgerEvent): void;
  getEvents(until?: Tick): LedgerEvent[];
}

export class BasicLedger implements Ledger {
  private events: LedgerEvent[] = [];

  constructor(public readonly seed: Seed) {}

  append(event: LedgerEvent): void {
    this.events.push(event);
  }

  getEvents(until?: Tick): LedgerEvent[] {
    if (until === undefined) {
      return [...this.events];
    }
    return this.events.filter((event) => event.t <= until);
  }
}

export interface AnchorArchetype {
  type: AnchorType;
  count(ctx: CityContext): number;
  must(site: TileCoord, ctx: CityContext): boolean;
  score(site: TileCoord, ctx: CityContext): number;
  footprint: {
    width: number;
    height: number;
  };
  minDistanceTo?: Partial<Record<AnchorType, number>>;
  prefersNear?: Partial<Record<AnchorType, { distance: number; weight: number }>>;
}

export interface AnchorPlacer {
  placeAnchors(
    archetypes: AnchorArchetype[],
    ctx: CityContext,
    ledger: Ledger
  ): void;
}

export enum TerrainType {
  Water = 'water',
  Beach = 'beach',
  Land = 'land',
}

export enum DistrictType {
  Housing = 'housing',
  Artisan = 'artisan',
  Merchant = 'merchant',
  Warehouse = 'warehouse',
  Civic = 'civic',
}

export interface PlacedAnchor {
  type: AnchorType;
  position: TileCoord;
}

export interface BuildingInstance {
  id: string;
  type: BuildingType;
  position: TileCoord;
  specialization?: DistrictType;
}

export interface CityContext {
  width: number;
  height: number;
  heightMap: number[][];
  terrain: TerrainType[][];
  anchors: ReadonlyArray<PlacedAnchor>;
  buildings: ReadonlyArray<BuildingInstance>;
  roads: ReadonlySet<string>;
  walls: ReadonlySet<string>;
  districts: ReadonlyMap<string, DistrictType>;
  rng(): number;
}

export interface GrowthRule {
  evaluate(site: TileCoord, ctx: CityContext): number;
  apply(site: TileCoord, ctx: CityContext, ledger: Ledger): void;
}

export interface GrowthSimulator {
  tick(t: Tick, ctx: CityContext, ledger: Ledger): void;
}

export interface RouteCostField {
  cost(cell: TileCoord, ctx: CityContext): number;
}

export interface TravelSimulator {
  simulateTrips(t: Tick, ctx: CityContext, ledger: Ledger): void;
}

export interface ProjectSystem {
  planProjects(ctx: CityContext, ledger: Ledger): void;
  deliverGoods(ctx: CityContext, ledger: Ledger): void;
  completeProjects(ctx: CityContext, ledger: Ledger): void;
}

export interface EconomyContext {
  supply: Partial<Record<GoodType, number>>;
  demand: Partial<Record<GoodType, number>>;
  wealth: number;
}

export enum GlobalEventType {
  HanseCharterGranted = 'hanse_charter',
  Plague = 'plague',
  Fire = 'fire',
}

export interface GlobalEventRule {
  canTrigger(ctx: CityContext, economy: EconomyContext): boolean;
  trigger(ctx: CityContext, ledger: Ledger): void;
}

export interface RenderTile {
  terrain: TerrainType;
  road?: boolean;
  wall?: boolean;
  building?: BuildingType;
  district?: DistrictType;
  anchor?: AnchorType;
  fountain?: boolean;
}

export interface CityRenderer {
  render(ctx: CityContext, ledger: Ledger): RenderTile[][];
}

type BaseLayers = {
  heightMap: number[][];
  terrain: TerrainType[][];
};

@Injectable({ providedIn: 'root' })
export class HanseaticCityMapService {
  private simulations = new Map<string, CitySimulationState>();

  drawCity(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    seed: string,
    cell: number,
    targetTick = 10
  ): void {
    const gridW = Math.max(1, Math.floor(width / cell));
    const gridH = Math.max(1, Math.floor(height / cell));
    const key = `${seed}:${gridW}x${gridH}`;
    const state = this.getOrCreateState(key, seed, gridW, gridH);
    this.advanceSimulation(state, targetTick);

    const renderContext = this.buildContext(
      state.baseLayers,
      state.ledger,
      state.rng,
      gridW,
      gridH
    );
    const renderer = new DefaultCityRenderer();
    const tiles = renderer.render(renderContext, state.ledger);
    drawTiles(ctx, tiles, cell, seededRng(`${seed}:palette`));
  }

  private buildBaseLayers(gridW: number, gridH: number, seed: Seed): BaseLayers {
    const rng = seededRng(`${seed}:terrain`);
    const heightSeed = hashSeed(`${seed}:height`);
    const heightMap = generateHeight(gridW, gridH, heightSeed);
    const terrain = generateTerrain(gridW, gridH, heightMap, rng);
    return { heightMap, terrain };
  }

  private getOrCreateState(
    key: string,
    seed: Seed,
    gridW: number,
    gridH: number
  ): CitySimulationState {
    const existing = this.simulations.get(key);
    if (existing) {
      return existing;
    }
    const baseLayers = this.buildBaseLayers(gridW, gridH, seed);
    const ledger = new BasicLedger(seed);
    const rng = seededRng(`${seed}:ledger`);
    const ctxSeed = this.buildContext(baseLayers, ledger, rng, gridW, gridH);
    const anchorPlacer = new DefaultAnchorPlacer();
    anchorPlacer.placeAnchors(DEFAULT_ANCHORS, ctxSeed, ledger);

    const state: CitySimulationState = {
      baseLayers,
      ledger,
      rng,
      lastTick: 0,
    };
    this.simulations.set(key, state);
    return state;
  }

  private advanceSimulation(state: CitySimulationState, targetTick: Tick): void {
    if (targetTick <= state.lastTick) {
      return;
    }
    const growth = new DefaultGrowthSimulator();
    const travel = new DefaultTravelSimulator();
    const projects = new DefaultProjectSystem();
    const events = new DefaultGlobalEvents();

    for (let t = state.lastTick + 1; t <= targetTick; t += 1) {
      const ctxTick = this.buildContext(
        state.baseLayers,
        state.ledger,
        state.rng,
        state.baseLayers.terrain[0].length,
        state.baseLayers.terrain.length
      );
      growth.tick(t, ctxTick, state.ledger);
      travel.simulateTrips(t, ctxTick, state.ledger);
      if (t % 3 === 0) {
        reclassifyDistricts(t, ctxTick, state.ledger);
      }
      projects.planProjects(ctxTick, state.ledger);
      projects.deliverGoods(ctxTick, state.ledger);
      projects.completeProjects(ctxTick, state.ledger);
      events.evaluate(t, ctxTick, state.ledger);
    }
    state.lastTick = targetTick;
  }

  private buildContext(
    baseLayers: BaseLayers,
    ledger: Ledger,
    rng: () => number,
    width: number,
    height: number
  ): CityContext {
    const anchors: PlacedAnchor[] = [];
    const buildings: BuildingInstance[] = [];
    const roads = new Set<string>();
    const walls = new Set<string>();
    const districts = new Map<string, DistrictType>();

    for (const event of ledger.getEvents()) {
      if (event.type === LedgerEventType.AnchorPlaced) {
        anchors.push({ type: event.anchorType, position: event.position });
      }
      if (event.type === LedgerEventType.HousePlaced) {
        buildings.push({
          id: event.householdId,
          type: event.buildingType,
          position: event.position,
          specialization: DistrictType.Housing,
        });
      }
      if (event.type === LedgerEventType.RoadUpgraded) {
        for (const cell of event.cells) {
          roads.add(coordKey(cell));
        }
      }
      if (
        event.type === LedgerEventType.ProjectCompleted &&
        event.projectType === ProjectType.WallSegment
      ) {
        for (const cell of event.cells) {
          walls.add(coordKey(cell));
        }
      }
      if (event.type === LedgerEventType.DistrictReclassified) {
        for (const cell of event.cells) {
          districts.set(coordKey(cell), event.district);
        }
      }
    }

    return {
      width,
      height,
      heightMap: baseLayers.heightMap,
      terrain: baseLayers.terrain,
      anchors,
      buildings,
      roads,
      walls,
      districts,
      rng,
    };
  }
}

type CitySimulationState = {
  baseLayers: BaseLayers;
  ledger: Ledger;
  rng: () => number;
  lastTick: Tick;
};

class DefaultAnchorPlacer implements AnchorPlacer {
  placeAnchors(
    archetypes: AnchorArchetype[],
    ctx: CityContext,
    ledger: Ledger
  ): void {
    for (const archetype of archetypes) {
      const desired = archetype.count(ctx);
      const candidates = sampleCandidates(ctx, ctx.rng, desired * 8);
      const picks: Array<{ score: number; site: TileCoord }> = [];
      for (const site of candidates) {
        if (!archetype.must(site, ctx)) {
          continue;
        }
        picks.push({ score: archetype.score(site, ctx), site });
      }
      picks.sort((a, b) => b.score - a.score);
      const accepted: TileCoord[] = [];
      for (const pick of picks) {
        if (accepted.length >= desired) {
          break;
        }
        if (
          isTooClose(
            pick.site,
            accepted,
            archetype.minDistanceTo?.[archetype.type] ?? 6
          )
        ) {
          continue;
        }
        accepted.push(pick.site);
        ledger.append({
          id: eventId(ledger.seed, LedgerEventType.AnchorPlaced, accepted.length),
          t: 0,
          type: LedgerEventType.AnchorPlaced,
          cause: `Anchor ${archetype.type} placed`,
          anchorType: archetype.type,
          position: pick.site,
        });
      }
    }
  }
}

class DefaultGrowthSimulator implements GrowthSimulator {
  private rules: GrowthRule[] = [new HouseGrowthRule()];

  tick(t: Tick, ctx: CityContext, ledger: Ledger): void {
    const candidates = sampleCandidates(ctx, ctx.rng, 40, true);
    for (const site of candidates) {
      for (const rule of this.rules) {
        const probability = rule.evaluate(site, ctx);
        if (ctx.rng() < probability) {
          rule.apply(site, ctx, ledger);
          return;
        }
      }
    }
  }
}

class HouseGrowthRule implements GrowthRule {
  evaluate(site: TileCoord, ctx: CityContext): number {
    if (!isBuildable(site, ctx)) {
      return 0;
    }
    const nearAnchor = nearestAnchorDistance(site, ctx) < 10;
    const nearRoad = hasRoadNeighbor(site, ctx);
    let probability = 0.05;
    if (nearAnchor) {
      probability += 0.15;
    }
    if (nearRoad) {
      probability += 0.1;
    }
    return probability;
  }

  apply(site: TileCoord, ctx: CityContext, ledger: Ledger): void {
    ledger.append({
      id: eventId(
        ledger.seed,
        LedgerEventType.HousePlaced,
        ctx.buildings.length + 1
      ),
      t: ctx.buildings.length + 1,
      type: LedgerEventType.HousePlaced,
      cause: 'Population growth',
      position: site,
      householdId: `house_${ctx.buildings.length + 1}`,
      buildingType: BuildingType.House,
    });
  }
}

class DefaultTravelCost implements RouteCostField {
  cost(cell: TileCoord, ctx: CityContext): number {
    if (!isWithin(cell, ctx)) {
      return Infinity;
    }
    const terrain = ctx.terrain[cell.y][cell.x];
    if (terrain === TerrainType.Water) {
      return Infinity;
    }
    let cost = terrain === TerrainType.Beach ? 1.5 : 1;
    if (ctx.roads.has(coordKey(cell))) {
      cost *= 0.4;
    }
    if (ctx.walls.has(coordKey(cell))) {
      cost *= 2;
    }
    return cost;
  }
}

class DefaultTravelSimulator implements TravelSimulator {
  private costField = new DefaultTravelCost();
  private usage: Map<string, number> = new Map();

  simulateTrips(t: Tick, ctx: CityContext, ledger: Ledger): void {
    const anchors = ctx.anchors;
    if (anchors.length === 0) {
      return;
    }
    for (const building of ctx.buildings) {
      const anchor = anchors[Math.floor(ctx.rng() * anchors.length)];
      const path = findPath(
        building.position,
        anchor.position,
        ctx,
        this.costField
      );
      if (path.length === 0) {
        continue;
      }
      ledger.append({
        id: eventId(ledger.seed, LedgerEventType.PathUsage, t + path.length),
        t,
        type: LedgerEventType.PathUsage,
        cause: 'Daily trade route',
        from: building.position,
        to: anchor.position,
        amount: 1,
      });
      for (const cell of path) {
        const key = coordKey(cell);
        const next = (this.usage.get(key) ?? 0) + 1;
        this.usage.set(key, next);
        if (next === 6) {
          ledger.append({
            id: eventId(ledger.seed, LedgerEventType.RoadUpgraded, t + next),
            t,
            type: LedgerEventType.RoadUpgraded,
            cause: 'Well-worn path',
            cells: path,
          });
        }
      }
    }
  }
}

class DefaultProjectSystem implements ProjectSystem {
  private planned = false;
  private projectId = 'wall_1';
  private projectCells: TileCoord[] = [];

  planProjects(ctx: CityContext, ledger: Ledger): void {
    if (this.planned) {
      return;
    }
    if (ctx.buildings.length < 6) {
      return;
    }
    const wallCells = traceWallContour(ctx);
    this.projectCells = wallCells;
    ledger.append({
      id: eventId(ledger.seed, LedgerEventType.ProjectStarted, 1),
      t: ctx.buildings.length,
      type: LedgerEventType.ProjectStarted,
      cause: 'City wall commissioned',
      projectId: this.projectId,
      projectType: ProjectType.WallSegment,
      cells: wallCells,
    });
    this.planned = true;
  }

  deliverGoods(ctx: CityContext, ledger: Ledger): void {
    if (!this.planned) {
      return;
    }
    ledger.append({
      id: eventId(
        ledger.seed,
        LedgerEventType.MaterialsDelivered,
        ctx.buildings.length + 1
      ),
      t: ctx.buildings.length + 1,
      type: LedgerEventType.MaterialsDelivered,
      cause: 'Stone delivered',
      good: GoodType.Stone,
      quantity: 120,
      destination: {
        x: Math.floor(ctx.width / 2),
        y: Math.floor(ctx.height / 2),
      },
    });
  }

  completeProjects(ctx: CityContext, ledger: Ledger): void {
    if (!this.planned) {
      return;
    }
    ledger.append({
      id: eventId(
        ledger.seed,
        LedgerEventType.ProjectCompleted,
        ctx.buildings.length + 2
      ),
      t: ctx.buildings.length + 2,
      type: LedgerEventType.ProjectCompleted,
      cause: 'Wall completed',
      projectId: this.projectId,
      projectType: ProjectType.WallSegment,
      cells: this.projectCells,
    });
    this.planned = false;
  }
}

class DefaultGlobalEvents {
  private triggered = false;

  evaluate(t: Tick, ctx: CityContext, ledger: Ledger): void {
    if (this.triggered) {
      return;
    }
    if (ctx.buildings.length > 12) {
      ledger.append({
        id: eventId(ledger.seed, LedgerEventType.GlobalEvent, t),
        t,
        type: LedgerEventType.GlobalEvent,
        cause: 'Hanse charter granted',
        name: GlobalEventType.HanseCharterGranted,
      });
      this.triggered = true;
    }
  }
}

class DefaultCityRenderer implements CityRenderer {
  render(ctx: CityContext, ledger: Ledger): RenderTile[][] {
    const tiles: RenderTile[][] = Array.from(
      { length: ctx.height },
      (_, y) =>
        Array.from({ length: ctx.width }, (_, x) => ({
          terrain: ctx.terrain[y][x],
        }))
    );

    for (const anchor of ctx.anchors) {
      if (!isWithin(anchor.position, ctx)) {
        continue;
      }
      tiles[anchor.position.y][anchor.position.x].anchor = anchor.type;
    }

    for (const building of ctx.buildings) {
      if (!isWithin(building.position, ctx)) {
        continue;
      }
      tiles[building.position.y][building.position.x].building = building.type;
    }

    for (const key of ctx.roads) {
      const cell = decodeKey(key);
      if (!isWithin(cell, ctx)) {
        continue;
      }
      tiles[cell.y][cell.x].road = true;
    }

    for (const key of ctx.walls) {
      const cell = decodeKey(key);
      if (!isWithin(cell, ctx)) {
        continue;
      }
      tiles[cell.y][cell.x].wall = true;
    }

    for (const [key, district] of ctx.districts.entries()) {
      const cell = decodeKey(key);
      if (!isWithin(cell, ctx)) {
        continue;
      }
      tiles[cell.y][cell.x].district = district;
    }

    for (const event of ledger.getEvents()) {
      if (
        event.type === LedgerEventType.AnchorPlaced &&
        event.anchorType === AnchorType.Market
      ) {
        const x = event.position.x;
        const y = event.position.y;
        if (isWithin({ x, y }, ctx)) {
          tiles[y][x].fountain = true;
        }
      }
    }

    return tiles;
  }
}

const DEFAULT_ANCHORS: AnchorArchetype[] = [
  {
    type: AnchorType.Dock,
    count: () => 1,
    must: (site, ctx) => ctx.terrain[site.y][site.x] === TerrainType.Beach,
    score: (site, ctx) =>
      1 / (1 + Math.abs(site.y - Math.floor(ctx.height * 0.2))),
    footprint: { width: 3, height: 2 },
  },
  {
    type: AnchorType.Market,
    count: () => 1,
    must: (site, ctx) => ctx.terrain[site.y][site.x] === TerrainType.Land,
    score: (site, ctx) =>
      1 -
      distance(
        site.x,
        site.y,
        Math.floor(ctx.width * 0.5),
        Math.floor(ctx.height * 0.55)
      ) /
        ctx.width,
    footprint: { width: 4, height: 4 },
  },
  {
    type: AnchorType.Church,
    count: () => 1,
    must: (site, ctx) => ctx.terrain[site.y][site.x] === TerrainType.Land,
    score: (site, ctx) =>
      1 -
      distance(
        site.x,
        site.y,
        Math.floor(ctx.width * 0.45),
        Math.floor(ctx.height * 0.5)
      ) /
        ctx.width,
    footprint: { width: 3, height: 3 },
  },
  {
    type: AnchorType.Hall,
    count: () => 1,
    must: (site, ctx) => ctx.terrain[site.y][site.x] === TerrainType.Land,
    score: (site, ctx) =>
      1 -
      distance(
        site.x,
        site.y,
        Math.floor(ctx.width * 0.52),
        Math.floor(ctx.height * 0.5)
      ) /
        ctx.width,
    footprint: { width: 3, height: 3 },
  },
];

function reclassifyDistricts(t: Tick, ctx: CityContext, ledger: Ledger): void {
  const updates: TileCoord[] = [];
  for (const building of ctx.buildings) {
    const dist = nearestAnchorDistance(building.position, ctx);
    if (dist < 8) {
      updates.push(building.position);
    }
  }
  if (updates.length === 0) {
    return;
  }
  ledger.append({
    id: eventId(ledger.seed, LedgerEventType.DistrictReclassified, t),
    t,
    type: LedgerEventType.DistrictReclassified,
    cause: 'Market core densifies',
    cells: updates,
    district: DistrictType.Merchant,
  });
}

function drawTiles(
  ctx: CanvasRenderingContext2D,
  tiles: RenderTile[][],
  cell: number,
  rng: () => number
): void {
  for (let y = 0; y < tiles.length; y += 1) {
    for (let x = 0; x < tiles[0].length; x += 1) {
      const tile = tiles[y][x];
      const base = BASE_COLORS[tile.terrain];
      ctx.fillStyle = jitter(
        base,
        rng,
        tile.terrain === TerrainType.Water ? 6 : 10
      );
      ctx.fillRect(x * cell, y * cell, cell, cell);

      if (tile.district) {
        const district = DISTRICT_COLORS[tile.district];
        ctx.fillStyle = jitter(district, rng, 8);
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }

      if (tile.road) {
        ctx.fillStyle = jitter('#c1a47a', rng, 6);
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }

      if (tile.wall) {
        ctx.fillStyle = '#6a5f54';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }

      if (tile.building) {
        ctx.fillStyle = '#6e5137';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }

      if (tile.anchor === AnchorType.Dock) {
        ctx.fillStyle = '#a5835b';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }

      if (tile.fountain) {
        ctx.fillStyle = '#5d91a8';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  }
}

function buildCoastLine(width: number, height: number, rng: () => number): number[] {
  const base = Math.floor(height * 0.2 + rng() * height * 0.05);
  const amp = Math.max(2, Math.floor(height * 0.04));
  const freq = rng() * 0.08 + 0.03;
  const phase = rng() * Math.PI * 2;
  const coast: number[] = [];
  for (let x = 0; x < width; x += 1) {
    const wave = Math.sin(x * freq + phase) * amp;
    const jitter = (rng() - 0.5) * amp * 0.6;
    coast[x] = Math.floor(base + wave + jitter);
  }
  return coast;
}

function generateTerrain(
  gridW: number,
  gridH: number,
  heightMap: number[][],
  rng: () => number
): TerrainType[][] {
  const terrain: TerrainType[][] = Array.from({ length: gridH }, () =>
    Array.from({ length: gridW }, () => TerrainType.Land)
  );
  const coastLine = buildCoastLine(gridW, gridH, rng);
  for (let y = 0; y < gridH; y += 1) {
    for (let x = 0; x < gridW; x += 1) {
      const coastY = coastLine[x];
      if (y < coastY) {
        terrain[y][x] = TerrainType.Water;
      } else if (y < coastY + 2) {
        terrain[y][x] = TerrainType.Beach;
      } else {
        terrain[y][x] =
          heightMap[y][x] > 0.82 ? TerrainType.Beach : TerrainType.Land;
      }
    }
  }
  return terrain;
}

function generateHeight(gridW: number, gridH: number, seed: number): number[][] {
  const height: number[][] = Array.from({ length: gridH }, () =>
    Array.from({ length: gridW }, () => 0)
  );
  const scale = 0.12 + seededRng(`${seed}:scale`)() * 0.05;
  for (let y = 0; y < gridH; y += 1) {
    for (let x = 0; x < gridW; x += 1) {
      const n =
        fbm(x * scale, y * scale, 3, seed) * 0.6 +
        fbm(x * scale * 0.5 + 12.3, y * scale * 0.5 - 7.1, 2, seed) *
          0.4;
      height[y][x] = clamp(n, 0, 1);
    }
  }
  return height;
}

function traceWallContour(ctx: CityContext): TileCoord[] {
  const centerX = Math.floor(ctx.width * 0.5);
  const centerY = Math.floor(ctx.height * 0.55);
  const target = 0.52;
  const points: TileCoord[] = [];
  const maxRadius = Math.min(ctx.width, ctx.height) * 0.38;
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 60) {
    let best = { x: centerX, y: centerY, diff: Infinity };
    for (let r = 10; r < maxRadius; r += 1) {
      const x = Math.floor(centerX + Math.cos(angle) * r);
      const y = Math.floor(centerY + Math.sin(angle) * r);
      if (x <= 1 || y <= 1 || x >= ctx.width - 2 || y >= ctx.height - 2) {
        break;
      }
      const h = ctx.heightMap[y][x];
      const diff = Math.abs(h - target);
      if (diff < best.diff) {
        best = { x, y, diff };
      }
    }
    points.push({ x: best.x, y: best.y });
  }
  return points;
}

function sampleCandidates(
  ctx: CityContext,
  rng: () => number,
  count: number,
  nearAnchors = false
): TileCoord[] {
  const candidates: TileCoord[] = [];
  const anchors =
    ctx.anchors.length > 0
      ? ctx.anchors
      : [
          {
            position: {
              x: Math.floor(ctx.width / 2),
              y: Math.floor(ctx.height / 2),
            },
            type: AnchorType.Market,
          },
        ];
  for (let i = 0; i < count; i += 1) {
    if (nearAnchors) {
      const anchor = anchors[Math.floor(rng() * anchors.length)];
      const x = clamp(
        anchor.position.x + Math.floor((rng() - 0.5) * 16),
        1,
        ctx.width - 2
      );
      const y = clamp(
        anchor.position.y + Math.floor((rng() - 0.5) * 16),
        1,
        ctx.height - 2
      );
      candidates.push({ x, y });
    } else {
      candidates.push({
        x: Math.floor(rng() * ctx.width),
        y: Math.floor(rng() * ctx.height),
      });
    }
  }
  return candidates;
}

function isTooClose(
  site: TileCoord,
  others: TileCoord[],
  minDistance: number
): boolean {
  return others.some(
    (other) => distance(site.x, site.y, other.x, other.y) < minDistance
  );
}

function coordKey(cell: TileCoord): string {
  return `${cell.x}:${cell.y}`;
}

function decodeKey(key: string): TileCoord {
  const [x, y] = key.split(':').map((value) => Number(value));
  return { x, y };
}

function eventId(seed: Seed, type: LedgerEventType, index: number): string {
  return `${seed}-${type}-${index}`;
}

function isBuildable(site: TileCoord, ctx: CityContext): boolean {
  if (!isWithin(site, ctx)) {
    return false;
  }
  if (ctx.terrain[site.y][site.x] !== TerrainType.Land) {
    return false;
  }
  return true;
}

function isWithin(site: TileCoord, ctx: CityContext): boolean {
  return site.x >= 0 && site.x < ctx.width && site.y >= 0 && site.y < ctx.height;
}

function hasRoadNeighbor(site: TileCoord, ctx: CityContext): boolean {
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      const cell = { x: site.x + dx, y: site.y + dy };
      if (!isWithin(cell, ctx)) {
        continue;
      }
      if (ctx.roads.has(coordKey(cell))) {
        return true;
      }
    }
  }
  return false;
}

function nearestAnchorDistance(site: TileCoord, ctx: CityContext): number {
  let best = Infinity;
  for (const anchor of ctx.anchors) {
    const dist = distance(site.x, site.y, anchor.position.x, anchor.position.y);
    if (dist < best) {
      best = dist;
    }
  }
  return best;
}

function findPath(
  start: TileCoord,
  goal: TileCoord,
  ctx: CityContext,
  costField: RouteCostField
): TileCoord[] {
  const frontier: TileCoord[] = [start];
  const cameFrom = new Map<string, TileCoord | null>();
  const costSoFar = new Map<string, number>();
  cameFrom.set(coordKey(start), null);
  costSoFar.set(coordKey(start), 0);

  while (frontier.length > 0) {
    frontier.sort(
      (a, b) =>
        (costSoFar.get(coordKey(a)) ?? 0) -
        (costSoFar.get(coordKey(b)) ?? 0)
    );
    const current = frontier.shift();
    if (!current) {
      break;
    }
    if (current.x === goal.x && current.y === goal.y) {
      break;
    }
    for (const next of neighbors(current)) {
      if (!isWithin(next, ctx)) {
        continue;
      }
      const stepCost = costField.cost(next, ctx);
      if (!Number.isFinite(stepCost)) {
        continue;
      }
      const newCost = (costSoFar.get(coordKey(current)) ?? 0) + stepCost;
      const nextKey = coordKey(next);
      if (
        !costSoFar.has(nextKey) ||
        newCost < (costSoFar.get(nextKey) ?? Infinity)
      ) {
        costSoFar.set(nextKey, newCost);
        cameFrom.set(nextKey, current);
        frontier.push(next);
      }
    }
  }

  const path: TileCoord[] = [];
  let current: TileCoord | null = goal;
  while (current) {
    path.push(current);
    current = cameFrom.get(coordKey(current)) ?? null;
  }
  path.reverse();
  if (path.length > 1) {
    return path;
  }
  return [];
}

function neighbors(cell: TileCoord): TileCoord[] {
  return [
    { x: cell.x + 1, y: cell.y },
    { x: cell.x - 1, y: cell.y },
    { x: cell.x, y: cell.y + 1 },
    { x: cell.x, y: cell.y - 1 },
  ];
}

const BASE_COLORS: Record<TerrainType, string> = {
  [TerrainType.Water]: '#295070',
  [TerrainType.Beach]: '#d7c08c',
  [TerrainType.Land]: '#7f8f66',
};

const DISTRICT_COLORS: Record<DistrictType, string> = {
  [DistrictType.Housing]: '#b08a5d',
  [DistrictType.Artisan]: '#8d6a48',
  [DistrictType.Merchant]: '#b99263',
  [DistrictType.Warehouse]: '#9a744d',
  [DistrictType.Civic]: '#a78d63',
};

function jitter(hex: string, rng: () => number, range: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return hex;
  }
  const delta = (rng() - 0.5) * range;
  const r = clamp(Math.round(rgb.r + delta), 0, 255);
  const g = clamp(Math.round(rgb.g + delta), 0, 255);
  const b = clamp(Math.round(rgb.b + delta), 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) {
    return null;
  }
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
}

function seededRng(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  let state = hash >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fbm(x: number, y: number, octaves: number, seed: number): number {
  let value = 0;
  let amplitude = 0.6;
  let frequency = 1;
  let max = 0;
  for (let i = 0; i < octaves; i += 1) {
    value += amplitude * valueNoise(x * frequency, y * frequency, seed);
    max += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / max;
}

function valueNoise(x: number, y: number, seed: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const sx = fade(x - x0);
  const sy = fade(y - y0);
  const n00 = hash2d(x0, y0, seed);
  const n10 = hash2d(x1, y0, seed);
  const n01 = hash2d(x0, y1, seed);
  const n11 = hash2d(x1, y1, seed);
  const ix0 = lerp(n00, n10, sx);
  const ix1 = lerp(n01, n11, sx);
  return lerp(ix0, ix1, sy);
}

function hash2d(x: number, y: number, seed: number): number {
  let n = seed ^ (x * 374761393 + y * 668265263);
  n = (n ^ (n >> 13)) * 1274126177;
  n ^= n >> 16;
  return (n >>> 0) / 4294967296;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function fade(t: number): number {
  return t * t * (3 - 2 * t);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function distance(x0: number, y0: number, x1: number, y1: number): number {
  return Math.hypot(x0 - x1, y0 - y1);
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}
