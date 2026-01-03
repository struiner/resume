import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tile-glitch-pinball',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glitch-pinball-tile">
      <div class="pinball-cabinet">
        <div class="cabinet-display">
          <div class="display-text">GLITCH.IO</div>
          <div class="display-subtext">PINBALL FANTASIES</div>
        </div>
        <div class="cabinet-art">
          <div class="art-element neon-blue"></div>
          <div class="art-element neon-purple"></div>
          <div class="art-element neon-pink"></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .glitch-pinball-tile {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
    }

    .pinball-cabinet {
      width: 90%;
      height: 85%;
      background: linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%);
      border: 3px solid #00ffff;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .cabinet-display {
      height: 20%;
      background: linear-gradient(to right, #000428, #004e92);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-bottom: 2px solid #00ffff;
      position: relative;
    }

    .display-text {
      font-family: 'Arial', sans-serif;
      font-size: 1.8rem;
      font-weight: bold;
      color: #00ffff;
      text-shadow: 0 0 10px #00ffff, 0 0 20px rgba(0, 255, 255, 0.3);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .display-subtext {
      font-family: 'Arial', sans-serif;
      font-size: 0.9rem;
      color: #00ffff;
      opacity: 0.8;
      text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
      letter-spacing: 1px;
    }

    .cabinet-art {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .art-element {
      position: absolute;
      border-radius: 50%;
      opacity: 0.7;
      filter: blur(1px);
    }

    .neon-blue {
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, #00f2ff 0%, #0084ff 100%);
      top: 20%;
      left: 20%;
    }

    .neon-purple {
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, #ff00ff 0%, #8a008a 100%);
      top: 40%;
      right: 30%;
    }

    .neon-pink {
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, #ff00aa 0%, #ff0066 100%);
      bottom: 20%;
      left: 40%;
    }

    .glitch-pinball-tile::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 45%, rgba(0, 255, 255, 0.05) 50%, transparent 55%);
      background-size: 200% 200%;
      animation: glitch-effect 3s infinite alternate;
      pointer-events: none;
      opacity: 0.3;
    }

    @keyframes glitch-effect {
      0% {
        transform: translate(0);
        opacity: 0.2;
      }
      20% {
        transform: translate(-2px, 2px);
        opacity: 0.4;
      }
      40% {
        transform: translate(2px, -2px);
        opacity: 0.3;
      }
      60% {
        transform: translate(-1px, 1px);
        opacity: 0.5;
      }
      80% {
        transform: translate(1px, -1px);
        opacity: 0.3;
      }
      100% {
        transform: translate(0);
        opacity: 0.2;
      }
    }
    `
  ]
})
export class GlitchPinballTileComponent {
  @Input() theme: 'glitch' | 'default' = 'glitch';
}