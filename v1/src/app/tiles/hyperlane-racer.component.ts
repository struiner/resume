import { Component } from '@angular/core';

@Component({
  selector: 'tile-hyperlane',
  standalone: true,
  template: `
    <div class="tile">
      <!-- perspective grid -->
      <div class="grid"></div>

      <!-- vector ship -->
      <div class="ship"></div>

      <!-- title -->
      <div class="label">HYPERLANE</div>
    </div>
  `,
  styles: [`
    .tile{
      width:200px;
      height:100px;
      position:relative;
      overflow:hidden;
      cursor:pointer;
      background:#020814;
      background-size: 400% 400%;
      box-shadow:
        inset 0 0 30px #000,
        0 6px 14px rgba(0,0,0,.5);
    }

    /* ===================== */
    /* Perspective grid      */
    /* ===================== */
    .grid{
      position:absolute;
      inset:-40% -10% 0 -10%;
      background:
        repeating-linear-gradient(
          to right,
          rgba(0,255,255,.18) 0 1px,
          transparent 1px 14px
        ),
        repeating-linear-gradient(
          to top,
          rgba(0,255,255,.18) 0 1px,
          transparent 1px 14px
        );
      background-size: 400% 400%;
      transform-origin:center bottom;
      transform:
        perspective(300px)
        rotateX(65deg)
        translateY(40px);
      animation:grid-scroll 3s linear infinite;
      filter:blur(.2px);
      opacity:.6;
    }

    @keyframes grid-scroll{
      from{ background-position-y:0; }
      to{ background-position-y:140px; }
    }

    /* ===================== */
    /* Vector ship           */
    /* ===================== */
    .ship{
      position:absolute;
      top:48%;
      left:-40px;
      width:28px;
      height:28px;
      border-left:2px solid #0ff;
      border-top:2px solid #0ff;
      transform:
        rotate(45deg)
        scale(.8);
      box-shadow:0 0 10px #0ff;
      opacity:0;
    }

    .tile:hover .ship{
      animation: ship-flyby .7s linear forwards;
    }

    @keyframes ship-flyby{
      0%{
        transform:translateX(0) rotate(45deg) scale(.8);
        opacity:0;
      }
      10%{ opacity:1; }
      100%{
        transform:translateX(260px) rotate(45deg) scale(1.1);
        opacity:0;
      }
    }

    /* ===================== */
    /* Label (Vectrex text)  */
    /* ===================== */
    .label{
      position:relative;
      z-index:2;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;

      font-size:20px;
      font-weight:900;
      letter-spacing:2px;
      text-transform:uppercase;

      color:transparent;
      -webkit-text-stroke:1.5px #0ff;

      text-shadow:
        0 0 6px #0ff,
        0 0 14px rgba(0,255,255,.6);

      filter:brightness(1.1);
      transition:.3s;
      transform:scale(1.06) rotate(-3deg) skewY(2deg);
    }

    .tile:hover .label{
      text-shadow:
        0 0 10px #0ff,
        0 0 22px rgba(0,255,255,.9);
    }

    /* ===================== */
    /* Subtle phosphor bloom */
    /* ===================== */
    .tile::after{
      content:'';
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at center,
          rgba(0,255,255,.15),
          transparent 65%);
      background-size: 400% 400%;
      opacity:.4;
      pointer-events:none;
    }
  `]
})
export class TileHyperlane {}



