import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComicBorderService {
  private seed = 42; // Default seed for deterministic generation
  private edgeStyles = ['wobble', 'bulge', 'notch', 'zigzag', 'straight'];

  constructor() {}

  setSeed(seed: number): void {
    this.seed = seed;
  }

  getSeed(): number {
    return this.seed;
  }

  /**
   * Generate SVG path for a comic-style border edge
   * @param width Width of the edge
   * @param height Height of the edge
   * @param position 'top', 'right', 'bottom', or 'left'
   * @param style Optional style override
   */
  generateEdgePath(
    width: number,
    height: number,
    position: 'top' | 'right' | 'bottom' | 'left',
    style?: string
  ): string {
    const edgeSeed = this.getEdgeSeedForPosition(position, width, height);
    const rng = this.makeRng(edgeSeed);
    const effectiveStyle = style || this.getEdgeStyleFromSeed(edgeSeed);
    const orientation = position === 'top' || position === 'bottom' ? 'h' : 'v';
    const points = this.buildEdgePoints(width, height, position, orientation, effectiveStyle, rng);
    return this.pointsToPath(points);
  }

  private getEdgeStyleFromSeed(seed: number): string {
    const index = seed % this.edgeStyles.length;
    return this.edgeStyles[index];
  }

  private getEdgeSeedForPosition(position: string, length: number, thickness: number): number {
    return this.hashInts(this.seed, position.charCodeAt(0), length, thickness);
  }

  private getSharedEdgeKeyForTile(
    x: number,
    y: number,
    position: 'top' | 'right' | 'bottom' | 'left'
  ): { edgeX: number; edgeY: number; orientation: 'h' | 'v' } {
    if (position === 'top') {
      return { edgeX: x, edgeY: y, orientation: 'h' };
    }
    if (position === 'bottom') {
      return { edgeX: x, edgeY: y + 1, orientation: 'h' };
    }
    if (position === 'left') {
      return { edgeX: x, edgeY: y, orientation: 'v' };
    }
    return { edgeX: x + 1, edgeY: y, orientation: 'v' };
  }

  /**
   * Generate a deterministic edge style based on tile coordinates and edge position
   * This ensures adjacent tiles share the same edge geometry
   * @param x Tile x coordinate
   * @param y Tile y coordinate
   * @param position Edge position ('top', 'right', 'bottom', 'left')
   */
  getEdgeStyleForTile(x: number, y: number, position: 'top' | 'right' | 'bottom' | 'left'): string {
    const edgeKey = this.getSharedEdgeKeyForTile(x, y, position);
    const edgeSeed = this.hashInts(
      this.seed,
      edgeKey.edgeX,
      edgeKey.edgeY,
      edgeKey.orientation === 'h' ? 1 : 2
    );
    return this.getEdgeStyleFromSeed(edgeSeed);
  }

  /**
   * Generate edge path with coordinate-based determinism
   * This ensures adjacent tiles share identical edge geometry
   */
  generateEdgePathForTile(
    x: number,
    y: number,
    width: number,
    height: number,
    position: 'top' | 'right' | 'bottom' | 'left'
  ): string {
    const edgeKey = this.getSharedEdgeKeyForTile(x, y, position);
    const styleSeed = this.hashInts(
      this.seed,
      edgeKey.edgeX,
      edgeKey.edgeY,
      edgeKey.orientation === 'h' ? 1 : 2
    );
    const rngSeed = this.hashInts(styleSeed, width, height);
    const style = this.getEdgeStyleFromSeed(styleSeed);
    const rng = this.makeRng(rngSeed);
    const orientation = position === 'top' || position === 'bottom' ? 'h' : 'v';
    const points = this.buildEdgePoints(width, height, position, orientation, style, rng);
    return this.pointsToPath(points);
  }

  generateEdgePointsForTile(
    x: number,
    y: number,
    length: number,
    depth: number,
    position: 'top' | 'right' | 'bottom' | 'left'
  ): Array<{ x: number; y: number }> {
    const edgeKey = this.getSharedEdgeKeyForTile(x, y, position);
    const styleSeed = this.hashInts(
      this.seed,
      edgeKey.edgeX,
      edgeKey.edgeY,
      edgeKey.orientation === 'h' ? 1 : 2
    );
    const rngSeed = this.hashInts(styleSeed, length, depth);
    const style = this.getEdgeStyleFromSeed(styleSeed);
    const rng = this.makeRng(rngSeed);
    return this.buildEdgePoints(length, depth, position, edgeKey.orientation, style, rng);
  }

  generateTileMaskPathForTile(
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
    offset: number = 0
  ): string {
    const top = this.generateEdgePointsForTile(x, y, width, depth, 'top')
      .map((point) => ({ x: point.x + offset, y: point.y + offset }));
    const right = this.generateEdgePointsForTile(x, y, height, depth, 'right')
      .map((point) => ({ x: width + point.x + offset, y: point.y + offset }));
    const bottom = this.generateEdgePointsForTile(x, y, width, depth, 'bottom')
      .map((point) => ({ x: point.x + offset, y: height + point.y + offset }))
      .reverse();
    const left = this.generateEdgePointsForTile(x, y, height, depth, 'left')
      .map((point) => ({ x: point.x + offset, y: point.y + offset }))
      .reverse();

    const points = [top, right, bottom, left].flat();
    return this.pointsToPath(points, true);
  }

  private buildEdgePoints(
    length: number,
    depth: number,
    position: 'top' | 'right' | 'bottom' | 'left',
    orientation: 'h' | 'v',
    style: string,
    rng: () => number
  ): Array<{ x: number; y: number }> {
    const minSegmentLength = 100;
    const segmentCount = Math.max(1, Math.floor(length / minSegmentLength));
    const segmentLength = length / segmentCount;
    const offsets = this.buildOffsets(segmentCount + 1, depth, style, rng);
    const tickLength = this.getTickLength(depth);
    const tickDirection = this.getTickDirection(position);

    if (orientation === 'h') {
      const points: Array<{ x: number; y: number }> = [{ x: 0, y: offsets[0] ?? 0 }];
      for (let i = 1; i <= segmentCount; i += 1) {
        const x = segmentLength * i;
        const prevY = offsets[i - 1] ?? 0;
        const nextY = offsets[i] ?? 0;
        points.push({ x, y: prevY });
        if (nextY !== prevY) {
          points.push({ x, y: nextY });
        }
      }
      return this.addPerpendicularTicks(points, 'h', tickLength, tickDirection);
    }

    const points: Array<{ x: number; y: number }> = [{ x: offsets[0] ?? 0, y: 0 }];
    for (let i = 1; i <= segmentCount; i += 1) {
      const y = segmentLength * i;
      const prevX = offsets[i - 1] ?? 0;
      const nextX = offsets[i] ?? 0;
      points.push({ x: prevX, y });
      if (nextX !== prevX) {
        points.push({ x: nextX, y });
      }
    }
    return this.addPerpendicularTicks(points, 'v', tickLength, tickDirection);
  }

  private buildOffsets(count: number, depth: number, style: string, rng: () => number): number[] {
    const offsets: number[] = new Array(count).fill(0);
    const amplitude = depth * (0.35 + rng() * 0.35);
    const bulgeSign = rng() > 0.5 ? 1 : -1;
    const notchIndex = Math.floor((0.2 + rng() * 0.6) * (count - 1));
    const zigAmp = depth * (0.4 + rng() * 0.4) * (rng() > 0.5 ? 1 : -1);

    for (let i = 1; i < count - 1; i += 1) {
      let offset = 0;
      switch (style) {
        case 'wobble':
          offset = (rng() - 0.5) * amplitude * 2;
          break;
        case 'bulge': {
          const t = i / (count - 1);
          const curve = 1 - Math.pow((t - 0.5) / 0.5, 2);
          offset = bulgeSign * amplitude * Math.max(0, curve);
          break;
        }
        case 'notch':
          if (i === notchIndex) {
            offset = depth * (0.6 + rng() * 0.4) * (rng() > 0.5 ? 1 : -1);
          }
          break;
        case 'zigzag':
          offset = (i % 2 === 0 ? 1 : -1) * zigAmp;
          break;
        case 'straight':
        default:
          offset = 0;
          break;
      }

      if (style !== 'straight') {
        offset += (rng() - 0.5) * depth * 0.15;
      }

      offsets[i] = offset;
    }

    offsets[0] = 0;
    offsets[count - 1] = 0;
    return offsets;
  }

  private addPerpendicularTicks(
    points: Array<{ x: number; y: number }>,
    orientation: 'h' | 'v',
    tickLength: number,
    tickDirection: number
  ): Array<{ x: number; y: number }> {
    if (points.length < 3) {
      return points;
    }

    const result: Array<{ x: number; y: number }> = [points[0]];
    for (let i = 1; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      result.push(current);

      if (orientation === 'h' && current.x !== next.x) {
        continue;
      }
      if (orientation === 'v' && current.y !== next.y) {
        continue;
      }

      if (orientation === 'h') {
        result.push({ x: current.x, y: current.y + tickLength * tickDirection });
        result.push({ x: current.x, y: current.y });
      } else {
        result.push({ x: current.x + tickLength * tickDirection, y: current.y });
        result.push({ x: current.x, y: current.y });
      }
    }
    result.push(points[points.length - 1]);
    return result;
  }

  private getTickDirection(position: 'top' | 'right' | 'bottom' | 'left'): number {
    if (position === 'top') {
      return -1;
    }
    if (position === 'bottom') {
      return 1;
    }
    if (position === 'left') {
      return -1;
    }
    return 1;
  }

  private getTickLength(depth: number): number {
    return depth * 1.6;
  }

  private pointsToPath(points: Array<{ x: number; y: number }>, closePath = false): string {
    if (!points.length) {
      return '';
    }
    const parts = [`M${this.format(points[0].x)},${this.format(points[0].y)}`];
    for (let i = 1; i < points.length; i += 1) {
      parts.push(`L${this.format(points[i].x)},${this.format(points[i].y)}`);
    }
    if (closePath) {
      parts.push('Z');
    }
    return parts.join(' ');
  }

  private format(value: number): string {
    return Number.isInteger(value) ? `${value}` : value.toFixed(2);
  }

  private makeRng(seed: number): () => number {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let r = t;
      r = Math.imul(r ^ (r >>> 15), r | 1);
      r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  private hashInts(...values: number[]): number {
    let hash = 2166136261;
    values.forEach((value) => {
      hash ^= value >>> 0;
      hash = Math.imul(hash, 16777619);
    });
    return hash >>> 0;
  }

  /**
   * Generate corner decoration SVG
   */
  generateCornerDecoration(size: number = 12): string {
    const radius = size / 2;
    return `<circle cx="${radius}" cy="${radius}" r="${radius}" fill="currentColor"/>`;
  }
}
