import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'tile-candy-overload',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="tile">
    <div class="burst"></div>

    <div class="candy-rain">
      <span
        *ngFor="let c of candies"
        class="candy"
        [style.--x.%]="c.x"
        [style.--delay.s]="c.delay"
        [style.--duration.s]="c.duration"
        [style.--rot.deg]="c.rot"
        [style.--sx.px]="c.sx"
        [style.--sy.px]="c.sy">
      </span>
    </div>

    <div class="content">
      <div class="slogan">CANDYTASTIC!</div>
      <div class="subtitle">Sugar Panic Mode</div>
    </div>
  </div>
  `,
  styles: [`
    .tile{
      --tile: 20px;
      width:200px;
      height:100px;
      position:relative;
      overflow:visible;
      border-radius:0;
      cursor:pointer;
      background:
        radial-gradient(circle at 30% 20%, #fff6 0%, transparent 40%),
        linear-gradient(135deg,#ff4fd8,#ffb347);
      background-size: calc(400% + 50px) calc(400% + 50px);
      box-shadow:
        0 6px 16px rgba(0,0,0,.35);
      transform-origin:center;
    }

    /* ===================== */
    /* Sugar burst backdrop  */
    /* ===================== */
    .burst{
      position:absolute;
      inset:-30%;
      background:
        repeating-radial-gradient(
          circle,
          #fff 0 6px,
          transparent 6px 18px
        );
      background-size: calc(400% + 50px) calc(400% + 50px);
      opacity:0;
      transform:scale(.4);
      transition:.4s;
      filter:blur(2px);
    }

    /* ===================== */
    /* Candy rain layer      */
    /* ===================== */
    .candy-rain{
      position:absolute;
      inset:0;
      pointer-events:none;
      overflow:hidden;
    }

    .candy{
      position:absolute;
      top:-40px;
      left:calc(var(--x) * 1%);
      width:var(--tile);
      height:var(--tile);
      background-image:url('/assets/tiles/candy-sheet.svg');
      background-size:calc(var(--tile) * 26) calc(var(--tile) * 14);
      background-position:calc(var(--sx) * 2) calc(var(--sy) * 2);
      opacity:0;
      transform:rotate(var(--rot));
    }

    /* ===================== */
    /* Text content          */
    /* ===================== */
    .content{
      position:relative;
      z-index:2;
      height:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:2px;
      text-align:center;
      transform:translateZ(0);
    }

    .slogan{
      font-size:20px;
      font-weight:900;
      letter-spacing:1px;
      color:#fffc;
      text-transform:uppercase;
      transform:scale(1.05) rotate(-2deg) skewX(-3deg);

      /* chunky amiga-era outline */
      text-shadow:
        -2px -2px 0 #a1005d,
         2px -2px 0 #a1005d,
        -2px  2px 0 #a1005d,
         2px  2px 0 #a1005d,
         0   0   12px #fff;
      transition:.35s cubic-bezier(.2,.9,.3,1.2);
    }

    .subtitle{
      font-size:11px;
      font-weight:800;
      color:#fff;
      opacity:.85;
      text-shadow:0 2px 4px rgba(0,0,0,.4);
      transform:scale(0.98) rotate(1deg) skewY(-4deg);
    }

    /* ===================== */
    /* Hover chaos           */
    /* ===================== */
    .tile:hover{
      animation:wobble .45s;
    }

    .tile:hover .burst{
      opacity:.7;
      transform:scale(1);
    }

    .tile:hover .slogan{
      transform:scale(1.15) rotate(-2deg);
    }

    .tile:hover .candy{     
      opacity:1;
      animation:
        candy-fall var(--duration) linear infinite,
        candy-spin 3s linear infinite;
      animation-delay: var(--delay);
    }

    /* ===================== */
    /* Animations            */
    /* ===================== */
    @keyframes wobble{
      0%   { transform:rotate(0deg) }
      25%  { transform:rotate(2deg) scale(1.02) }
      50%  { transform:rotate(-2deg) scale(1.03) }
      75%  { transform:rotate(1deg) }
      100% { transform:rotate(0deg) }
    }

    @keyframes candy-fall{
      from{ transform:translateY(-20px) rotate(var(--rot)); }
      to  { transform:translateY(140px) rotate(calc(var(--rot) + 180deg)); }
    }

    @keyframes candy-spin{
      to{ filter:hue-rotate(360deg); }
    }
  `]
})
export class TileCandyOverload {
  candies = Array.from({ length: 22 }, () => ({
    x: Math.random() * 200,
    delay: Math.random() * 1.5,
    duration: 1.8 + Math.random() * 1.8,
    rot: Math.random() * 360,
    // sprite map selection (13x7 grid)
    sx: -(Math.floor(Math.random() * 13) * 20),
    sy: -(Math.floor(4 + Math.random() * 2) * 20)
  }));
}




