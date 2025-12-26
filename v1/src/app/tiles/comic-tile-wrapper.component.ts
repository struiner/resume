import { Component, Input } from '@angular/core';
import { ComicBorderComponent } from './comic-border.component';

@Component({
  selector: 'comic-tile-wrapper',
  standalone: true,
  imports: [ComicBorderComponent],
  template: `
    <comic-border [theme]="theme" [width]="width" [height]="height">
      <ng-content></ng-content>
    </comic-border>
  `,
  styles: [
    `
    :host {
      display: inline-block;
    }
    `
  ]
})
export class ComicTileWrapperComponent {
  @Input() theme: 'candy' | 'hyperlane' | 'sentient' | 'mana' | 'glitch' | 'quantum' | 'factory' | 'default' = 'default';
  @Input() width = 200;
  @Input() height = 100;
}