import { Component } from '@angular/core';
import { ComicDemoTileComponent } from './tiles/comic-demo-tile.component';
import { ComicMaskedTileComponent } from './tiles/comic-masked-tile.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comic-test-page',
  standalone: true,
  imports: [CommonModule, ComicDemoTileComponent, ComicMaskedTileComponent],
  template: `
    <div class="comic-test-page">
      <h1>Comic Tile Border Test</h1>
      <p>Testing Franco-Belgian 90's comic style borders for tiles</p>
      
      <div class="tile-grid">
        <h2>Phase 1 - Visual Overlay Prototype</h2>
        <div class="tile-row">
          <tile-comic-demo theme="candy"></tile-comic-demo>
          <tile-comic-demo theme="hyperlane"></tile-comic-demo>
          <tile-comic-demo theme="sentient"></tile-comic-demo>
        </div>
        
        <div class="tile-row">
          <tile-comic-demo theme="mana"></tile-comic-demo>
          <tile-comic-demo theme="glitch"></tile-comic-demo>
          <tile-comic-demo theme="quantum"></tile-comic-demo>
        </div>
        
        <div class="tile-row">
          <tile-comic-demo theme="factory"></tile-comic-demo>
          <tile-comic-demo theme="default"></tile-comic-demo>
        </div>
      </div>
      
      <div class="tile-grid phase-2">
        <h2>Phase 2 - SVG Masked Tiles</h2>
        <div class="tile-row">
          <tile-comic-masked theme="candy" [tileX]="0" [tileY]="0"></tile-comic-masked>
          <tile-comic-masked theme="hyperlane" [tileX]="1" [tileY]="0"></tile-comic-masked>
          <tile-comic-masked theme="sentient" [tileX]="2" [tileY]="0"></tile-comic-masked>
        </div>
        
        <div class="tile-row">
          <tile-comic-masked theme="mana" [tileX]="0" [tileY]="1"></tile-comic-masked>
          <tile-comic-masked theme="glitch" [tileX]="1" [tileY]="1"></tile-comic-masked>
          <tile-comic-masked theme="quantum" [tileX]="2" [tileY]="1"></tile-comic-masked>
        </div>
        
        <div class="tile-row">
          <tile-comic-masked theme="factory" [tileX]="0" [tileY]="2"></tile-comic-masked>
          <tile-comic-masked theme="default" [tileX]="1" [tileY]="2"></tile-comic-masked>
        </div>
      </div>
      
      <div class="instructions">
        <h2>Implementation Progress</h2>
        <p>This page demonstrates both phases of the comic tile border epic.</p>
        
        <h3>Phase 1 - Visual Overlay Prototype ✅</h3>
        <ul>
          <li>✅ Rectangular tiles with comic borders</li>
          <li>✅ Hand-drawn border strokes overlaid on top</li>
          <li>✅ Theme-specific border colors</li>
          <li>✅ Deterministic edge generation</li>
        </ul>
        
        <h3>Phase 2 - SVG Masked Tiles ✅</h3>
        <ul>
          <li>✅ Edge-based SVG clipPaths</li>
          <li>✅ Deterministic edge generation with coordinate-based consistency</li>
          <li>✅ Perfect tile-to-tile continuity</li>
          <li>✅ Actual masking using SVG clip-path</li>
          <li>✅ All themes supported</li>
        </ul>
        
        <p><strong>Key Differences:</strong> Phase 2 tiles use actual SVG masking to create the comic border effect, while Phase 1 tiles use visual overlays. Phase 2 provides true edge-based clipping for a more authentic comic panel look.</p>
      </div>
    </div>
  `,
  styles: [
    `
    .comic-test-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: 'IBM Plex Sans', 'Inter', 'Segoe UI', sans-serif;
    }

    h1 {
      color: #2e180d;
      font-size: 2.4rem;
      margin-bottom: 16px;
      text-align: center;
    }

    p {
      color: #5a4a3a;
      text-align: center;
      margin-bottom: 40px;
      font-size: 1.1rem;
    }

    .tile-grid {
      display: flex;
      flex-direction: column;
      gap: 40px;
      margin-bottom: 60px;
    }

    .tile-row {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
    }

    .instructions {
      background: #fef4e6;
      border-radius: 16px;
      padding: 30px;
      border: 2px dashed rgba(197, 97, 43, 0.3);
    }

    .instructions h2 {
      color: #c5612b;
      margin-top: 0;
      font-size: 1.6rem;
    }

    .instructions ul {
      padding-left: 24px;
      color: #5a4a3a;
    }

    .instructions li {
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .tile-row {
        flex-direction: column;
        align-items: center;
        gap: 30px;
      }

      .comic-test-page {
        padding: 20px 15px;
      }
    }
    `
  ]
})
export class ComicTestPageComponent {}
