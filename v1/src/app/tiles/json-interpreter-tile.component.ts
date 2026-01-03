import { Component } from '@angular/core';

@Component({
  selector: 'tile-json-interpreter',
  standalone: true,
  template: `
    <div class="tile">
      <div class="grid"></div>
      <div class="pulse"></div>
      <div class="bracket left"></div>
      <div class="bracket right"></div>
      <div class="signal"></div>
      <div class="labels">
        <div class="title">JSON INTERPRETER</div>
        <div class="subtitle">structure-first parsing</div>
      </div>
    </div>
  `,
  styles: [
    `
    .tile {
      width: 200px;
      height: 100px;
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 20% 20%, rgba(60, 200, 255, 0.3), transparent 55%),
        radial-gradient(circle at 80% 70%, rgba(120, 255, 210, 0.2), transparent 60%),
        linear-gradient(135deg, #050c14, #0b1826 55%, #08121c);
      box-shadow:
        inset 0 0 0 2px rgba(120, 210, 255, 0.25),
        0 6px 16px rgba(0, 0, 0, 0.35);
    }

    .grid {
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(
          90deg,
          rgba(120, 210, 255, 0.08) 0 1px,
          transparent 1px 18px
        ),
        repeating-linear-gradient(
          0deg,
          rgba(120, 210, 255, 0.08) 0 1px,
          transparent 1px 18px
        );
      opacity: 0.6;
    }

    .pulse {
      position: absolute;
      left: 18px;
      top: 18px;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: 2px solid rgba(120, 210, 255, 0.5);
      box-shadow: 0 0 14px rgba(120, 210, 255, 0.5);
    }

    .pulse::after {
      content: '';
      position: absolute;
      inset: 10px;
      border-radius: 50%;
      border: 2px solid rgba(120, 255, 210, 0.4);
    }

    .bracket {
      position: absolute;
      top: 20px;
      width: 16px;
      height: 60px;
      border: 2px solid rgba(120, 210, 255, 0.6);
      box-shadow: 0 0 12px rgba(120, 210, 255, 0.45);
    }

    .bracket.left {
      left: 88px;
      border-right: none;
    }

    .bracket.right {
      right: 18px;
      border-left: none;
    }

    .signal {
      position: absolute;
      left: 78px;
      top: 50%;
      width: 48px;
      height: 2px;
      background: linear-gradient(90deg, rgba(120, 255, 210, 0), rgba(120, 255, 210, 0.9), rgba(120, 255, 210, 0));
      box-shadow: 0 0 12px rgba(120, 255, 210, 0.7);
    }

    .labels {
      position: absolute;
      left: 14px;
      bottom: 10px;
      color: rgba(210, 245, 255, 0.9);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
    }

    .title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .subtitle {
      font-size: 9px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      opacity: 0.7;
    }
    `
  ]
})
export class TileJsonInterpreter {}
