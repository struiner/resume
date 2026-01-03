import { Component } from '@angular/core';

@Component({
  selector: 'tile-hanse',
  standalone: true,
  template: `
    <div class="tile">
      <div class="sea"></div>
      <div class="dock"></div>
      <div class="warehouse"></div>
      <div class="spire"></div>
      <div class="sail"></div>
      <div class="seal"></div>
      <div class="labels">
        <div class="title">HANSE</div>
        <div class="subtitle">Merchant city sim</div>
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
        radial-gradient(circle at 20% 30%, rgba(234, 201, 126, 0.2), transparent 60%),
        linear-gradient(135deg, #0c2c3b, #1d3b4a 55%, #132832);
      box-shadow:
        inset 0 0 0 2px rgba(217, 190, 128, 0.35),
        0 6px 16px rgba(0, 0, 0, 0.35);
    }

    .sea {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -10px;
      height: 50px;
      background:
        linear-gradient(180deg, rgba(46, 92, 120, 0.15), rgba(15, 42, 60, 0.85)),
        repeating-linear-gradient(
          90deg,
          rgba(121, 170, 196, 0.2) 0 8px,
          rgba(121, 170, 196, 0.05) 8px 16px
        );
    }

    .dock {
      position: absolute;
      left: 18px;
      bottom: 16px;
      width: 60px;
      height: 8px;
      background: #c6a26b;
      box-shadow: 0 0 10px rgba(214, 182, 120, 0.35);
    }

    .dock::after {
      content: '';
      position: absolute;
      left: 6px;
      top: -14px;
      width: 8px;
      height: 14px;
      background: #c6a26b;
      box-shadow: 18px 0 0 #c6a26b, 36px 0 0 #c6a26b;
    }

    .warehouse {
      position: absolute;
      left: 84px;
      bottom: 20px;
      width: 52px;
      height: 26px;
      background:
        linear-gradient(180deg, #c88f58, #a36d40);
      box-shadow: inset 0 0 0 2px rgba(77, 44, 20, 0.4);
    }

    .warehouse::after {
      content: '';
      position: absolute;
      left: 6px;
      top: -12px;
      width: 40px;
      height: 12px;
      background: #7d5738;
      clip-path: polygon(0 100%, 50% 0, 100% 100%);
    }

    .spire {
      position: absolute;
      left: 148px;
      bottom: 22px;
      width: 18px;
      height: 32px;
      background: linear-gradient(180deg, #d9c89a, #bba06f);
      box-shadow: inset 0 0 0 1px rgba(84, 64, 36, 0.4);
    }

    .spire::after {
      content: '';
      position: absolute;
      left: 2px;
      top: -12px;
      width: 14px;
      height: 12px;
      background: #8f7a57;
      clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }

    .sail {
      position: absolute;
      left: 30px;
      bottom: 36px;
      width: 18px;
      height: 28px;
      background: rgba(230, 225, 214, 0.8);
      clip-path: polygon(0 100%, 0 0, 100% 50%);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }

    .seal {
      position: absolute;
      right: 16px;
      top: 10px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid rgba(214, 182, 120, 0.6);
      box-shadow: inset 0 0 6px rgba(214, 182, 120, 0.35);
    }

    .seal::after {
      content: '';
      position: absolute;
      inset: 6px;
      border: 2px solid rgba(214, 182, 120, 0.5);
      border-radius: 50%;
    }

    .labels {
      position: absolute;
      left: 14px;
      top: 10px;
      color: #f3e7c3;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
    }

    .title {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1.6px;
      text-transform: uppercase;
    }

    .subtitle {
      font-size: 9px;
      letter-spacing: 1px;
      text-transform: uppercase;
      opacity: 0.75;
    }
    `
  ]
})
export class TileHanse {}
