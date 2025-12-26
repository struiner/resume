import { Component, Input } from '@angular/core';
import { ComicTileWrapperComponent } from './comic-tile-wrapper.component';

@Component({
  selector: 'tile-comic-demo',
  standalone: true,
  imports: [ComicTileWrapperComponent],
  template: `
    <comic-tile-wrapper [theme]="theme" [width]="200" [height]="100">
      <div class="tile-content">
        <div class="tile-title">COMIC TILE</div>
        <div class="tile-subtitle">Franco-Belgian Style</div>
      </div>
    </comic-tile-wrapper>
  `,
  styles: [
    `
    .tile-content {
      width: 200px;
      height: 100px;
      position: relative;
      overflow: hidden;
      border-radius: 16px;
      cursor: pointer;
      background:
        linear-gradient(180deg, rgba(9, 12, 18, 0.95), rgba(7, 10, 16, 0.98)),
        radial-gradient(circle at 15% 20%, rgba(86, 214, 214, 0.18), transparent 45%),
        radial-gradient(circle at 90% 15%, rgba(190, 88, 164, 0.14), transparent 50%);
      background-size: 200% 200%;
      border: 1px solid rgba(130, 150, 170, 0.35);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.05),
        0 8px 18px rgba(0, 0, 0, 0.45);
    }
 
    /* Use more specific selectors to avoid global style conflicts */
    .tile-content .tile-title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px !important;
      font-weight: 800 !important;
      letter-spacing: 1.6px !important;
      color: #d5dde7 !important;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6) !important;
      margin: 0 !important;
      padding: 0 !important;
    }
 
    .tile-content .tile-subtitle {
      position: absolute;
      top: 65%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 10px !important;
      letter-spacing: 1px !important;
      opacity: 0.65 !important;
      text-transform: uppercase !important;
      color: #d5dde7 !important;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6) !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    `
  ]
})
export class ComicDemoTileComponent {
  @Input() theme: 'candy' | 'hyperlane' | 'sentient' | 'mana' | 'glitch' | 'quantum' | 'factory' | 'default' = 'default';
}
