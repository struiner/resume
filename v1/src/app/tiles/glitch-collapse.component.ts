import { Component } from '@angular/core';

@Component({
  selector: 'tile-glitch-collapse',
  standalone: true,
  template: `
    <div class="tile">
      <span class="layer a">GLITCH.IO</span>
      <span class="layer b">GLITCH.IO</span>
      <span class="layer c">GLITCH.IO</span>
    </div>
  `,
  styles: [`
    .tile{
      width:200px; height:100px;
      background:#111;
      background-size: 400% 400%;
      position:relative;
      overflow:hidden;
      cursor:pointer;
    }

    .layer{
      position:absolute;
      inset:0;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:22px;
      font-weight:900;
      letter-spacing:2px;
      transition:.35s;
    }

    .a{ color:#0ff; transform:scale(1.02) rotate(-2deg) skewX(3deg) }
    .b{ color:#f0f; mix-blend-mode:screen; transform:scale(1.04) rotate(1deg) skewY(-3deg) }
    .c{ color:#fff; transform:scale(0.98) rotate(-1deg) skewX(-2deg) }

    .tile:hover .a{ transform:translate(-6px,2px) skewX(-12deg) }
    .tile:hover .b{ transform:translate(6px,-2px) skewX(12deg) }
    .tile:hover .c{
      clip-path: polygon(0 0,100% 0,100% 50%,0 100%);
    }
  `]
})
export class TileGlitchCollapse {}



