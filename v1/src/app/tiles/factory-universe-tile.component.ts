import { Component } from '@angular/core';

@Component({
  selector: 'tile-factory-universe',
  standalone: true,
  template: `
    <div class="tile">
      <div class="grid"></div>
      <div class="ring"></div>
      <div class="content">
        <div class="title">FACTORY UNIVERSE</div>
        <div class="subtitle">Automation at cosmic scale</div>
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
      cursor: pointer;
      background:
        linear-gradient(180deg, rgba(9, 12, 18, 0.95), rgba(7, 10, 16, 0.98)),
        radial-gradient(circle at 15% 20%, rgba(86, 214, 214, 0.18), transparent 45%),
        radial-gradient(circle at 90% 15%, rgba(190, 88, 164, 0.14), transparent 50%);
      background-size: 400% 400%;
      border: 1px solid rgba(130, 150, 170, 0.35);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.05),
        0 8px 18px rgba(0, 0, 0, 0.45);
    }

    .grid {
      position: absolute;
      inset: -10%;
      background:
        linear-gradient(90deg, rgba(110, 140, 170, 0.25) 1px, transparent 1px),
        linear-gradient(0deg, rgba(110, 140, 170, 0.25) 1px, transparent 1px);
      background-size: 32px 32px;
      opacity: 0.4;
    }

    .ring {
      position: absolute;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      border: 2px solid rgba(86, 214, 214, 0.35);
      top: -70px;
      right: -40px;
      box-shadow: 0 0 16px rgba(86, 214, 214, 0.3);
    }

    .content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: 'IBM Plex Sans', 'Inter', 'Segoe UI', sans-serif;
      color: #d5dde7;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      gap: 2px;
    }

    .title {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1.6px;
    }

    .subtitle {
      font-size: 10px;
      letter-spacing: 1px;
      opacity: 0.65;
      text-transform: uppercase;
    }
    `
  ]
})
export class TileFactoryUniverse {}



