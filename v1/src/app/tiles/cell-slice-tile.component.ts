import { Component } from '@angular/core';

@Component({
  selector: 'tile-cell-slice',
  standalone: true,
  template: `
    <div class="tile">
      <div class="membrane"></div>
      <div class="core"></div>
      <div class="organelle organelle-a"></div>
      <div class="organelle organelle-b"></div>
      <div class="organelle organelle-c"></div>
      <div class="cutaway"></div>
      <div class="labels">
        <div class="title">CELL SLICE</div>
        <div class="subtitle">Cut-through pipeline</div>
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
        radial-gradient(circle at 18% 50%, rgba(170, 255, 210, 0.25), transparent 55%),
        radial-gradient(circle at 70% 30%, rgba(80, 220, 180, 0.25), transparent 50%),
        linear-gradient(135deg, #06261f, #0c3a2f);
      box-shadow:
        inset 0 0 0 2px rgba(120, 255, 210, 0.3),
        0 6px 16px rgba(0, 0, 0, 0.35);
    }

    .membrane {
      position: absolute;
      width: 130px;
      height: 80px;
      left: 12px;
      top: 10px;
      border-radius: 50%;
      border: 2px solid rgba(170, 255, 210, 0.7);
      box-shadow: inset 0 0 12px rgba(120, 255, 210, 0.25);
      background:
        radial-gradient(circle at 35% 40%, rgba(170, 255, 210, 0.2), transparent 55%),
        radial-gradient(circle at 70% 55%, rgba(80, 220, 180, 0.2), transparent 50%);
    }

    .core {
      position: absolute;
      width: 42px;
      height: 42px;
      left: 52px;
      top: 28px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #b9fff0, #37bfa4 65%);
      box-shadow: 0 0 12px rgba(120, 255, 210, 0.35);
    }

    .organelle {
      position: absolute;
      width: 16px;
      height: 10px;
      border-radius: 999px;
      background: rgba(120, 255, 210, 0.6);
      box-shadow: 0 0 6px rgba(120, 255, 210, 0.3);
    }

    .organelle-a {
      left: 26px;
      top: 54px;
      transform: rotate(-18deg);
    }

    .organelle-b {
      left: 96px;
      top: 22px;
      transform: rotate(24deg);
    }

    .organelle-c {
      left: 98px;
      top: 64px;
      transform: rotate(-8deg);
    }

    .cutaway {
      position: absolute;
      right: -20px;
      top: -10px;
      width: 120px;
      height: 140px;
      background:
        linear-gradient(120deg, rgba(4, 20, 16, 0) 35%, rgba(4, 20, 16, 0.65) 70%),
        repeating-linear-gradient(
          135deg,
          rgba(140, 255, 220, 0.25) 0 6px,
          rgba(140, 255, 220, 0.05) 6px 12px
        );
      transform: rotate(-6deg);
      mix-blend-mode: screen;
    }

    .labels {
      position: absolute;
      right: 10px;
      bottom: 10px;
      text-align: right;
      z-index: 1;
      color: #d6fff0;
    }

    .title {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1.4px;
      text-transform: uppercase;
    }

    .subtitle {
      font-size: 9px;
      letter-spacing: 1px;
      text-transform: uppercase;
      opacity: 0.7;
    }

    .tile:hover .membrane {
      box-shadow: inset 0 0 18px rgba(120, 255, 210, 0.45);
    }
    `
  ]
})
export class TileCellSlice {}
