import { Component } from '@angular/core';

@Component({
  selector: 'tile-sentient-os',
  standalone: true,
  template: `
    <div class="tile">
      <div class="eye"></div>
      <span>SENTIENT OS</span>
    </div>
  `,
  styles: [`
    .tile{
      width:200px;height:100px;
      background:#000;
      background-size: 400% 400%;
      position:relative;
      overflow:hidden;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#0f0;
      font-weight:800;
    }

    .tile span{
      transform:scale(1.04) rotate(-1.5deg) skewX(3deg);
      letter-spacing:1px;
    }

    .eye{
      position:absolute;
      width:140px;height:40px;
      background:radial-gradient(circle,#0f0 10%,transparent 11%);
      background-size: 400% 400%;
      filter:blur(8px);
      transition:.4s;
    }

    .tile:hover .eye{
      transform:scale(1.4) rotate(180deg);
    }
  `]
})
export class TileSentientOS {}



