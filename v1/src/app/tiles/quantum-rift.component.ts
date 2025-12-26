import { Component } from '@angular/core';

@Component({
  selector: 'tile-quantum-rift',
  standalone: true,
  template: `
    <div class="tile">
      <div class="rift"></div>
      <div class="content">
        <h3>QUANTUM RIFT</h3>
        <span>Reality Is Optional</span>
      </div>
    </div>
  `,
  styles: [`
    .tile{
      width:200px; height:100px;
      position:relative; overflow:hidden;
      background:#000;
      background-size: 400% 400%;
      perspective:800px;
      cursor:pointer;
    }

    .rift{
      position:absolute; inset:-40%;
      background:
        conic-gradient(
          from 0deg,
          #ff00ff, #00ff00, #0ff, #ff0, #f0f
        );
      background-size: 400% 400%;
      filter: blur(14px) saturate(180%);
      animation: spin 6s linear infinite;
      transform: scale(.6);
      transition: transform .5s;
    }

    .tile:hover .rift{
      transform: scale(1.4) rotate(40deg);
    }

    .content{
      position:relative; z-index:1;
      height:100%;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      text-align:center;
      font-weight:800;
      color:white;
      text-shadow:0 0 12px #0ff;
      transition: transform .4s;
    }

    .content h3{
      margin:0;
      transform:scale(1.05) rotate(-2deg) skewX(3deg);
    }

    .content span{
      display:block;
      margin-top:4px;
      font-size:12px;
      transform:scale(0.98) rotate(1deg) skewY(-4deg);
    }

    .tile:hover .content{
      transform: translateZ(40px) scale(1.1);
    }

    @keyframes spin{
      to{ rotate:360deg }
    }
  `]
})
export class TileQuantumRift {}



