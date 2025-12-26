import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'candy-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="candy-cinematic">

      <!-- Candy rain -->
      <div class="rain">
        <span *ngFor="let c of candies"
          [style.left.%]="c.x"
          [style.animationDelay.s]="c.delay">
        </span>
      </div>

      <!-- Loader -->
      <div class="boot" *ngIf="!ready">
        <div class="title">SUGAR PANIC</div>

        <div class="subtitle">
          Loading Candy Dimension…
        </div>

        <div class="jar">
          <div class="fill" [style.height.%]="progress"></div>
        </div>

        <div class="percent">{{ progress }}%</div>
      </div>

      <!-- Game reveal -->
      <div class="game" *ngIf="ready">
        🍭 GAME READY 🍭
      </div>

    </div>
  `,
  styles: [`
    .candy-cinematic{
      width:100%;
      height:100%;
      position:relative;
      overflow:hidden;
      background:
        radial-gradient(circle at top,#fff5 0%,transparent 50%),
        linear-gradient(135deg,#ff5fd7,#ffb347);
      color:white;
      display:flex;
      align-items:center;
      justify-content:center;
      font-family:system-ui, sans-serif;
    }

    /* ===================== */
    /* Candy rain            */
    /* ===================== */
    .rain{
      position:absolute;
      inset:0;
      pointer-events:none;
      overflow:hidden;
    }

    .rain span{
      position:absolute;
      top:-20px;
      width:10px;
      height:10px;
      background:
        linear-gradient(135deg,#fff,#ff6);
      animation: candy-fall 1.8s linear infinite;
      opacity:.8;
    }

    @keyframes candy-fall{
      from{ transform:translateY(0) rotate(0deg); }
      to  { transform:translateY(140%) rotate(360deg); }
    }

    /* ===================== */
    /* Loader UI             */
    /* ===================== */
    .boot{
      position:relative;
      z-index:2;
      text-align:center;
      animation: pop-in .6s ease forwards;
    }

    @keyframes pop-in{
      from{ opacity:0; transform:scale(.9); }
      to{ opacity:1; transform:scale(1); }
    }

    .title{
      font-size:28px;
      font-weight:900;
      letter-spacing:2px;
      text-shadow:
        -2px -2px 0 #a1005d,
         2px -2px 0 #a1005d,
        -2px  2px 0 #a1005d,
         2px  2px 0 #a1005d,
         0 0 12px #fff;
      margin-bottom:6px;
    }

    .subtitle{
      font-size:14px;
      opacity:.85;
      margin-bottom:14px;
    }

    /* Candy jar loader */
    .jar{
      width:60px;
      height:80px;
      border-radius:10px 10px 14px 14px;
      background:rgba(255,255,255,.25);
      box-shadow:
        inset 0 0 0 3px #fff,
        0 6px 16px rgba(0,0,0,.3);
      overflow:hidden;
      margin:0 auto 8px;
    }

    .fill{
      position:absolute;
      bottom:0;
      width:100%;
      background:
        linear-gradient(
          to top,
          #ff3cac,
          #784ba0,
          #2b86c5
        );
      transition:height .4s cubic-bezier(.2,.9,.3,1);
      box-shadow:0 0 14px #fff;
    }

    .percent{
      font-size:16px;
      font-weight:800;
      letter-spacing:1px;
    }

    /* ===================== */
    /* Game reveal           */
    /* ===================== */
    .game{
      font-size:34px;
      font-weight:900;
      animation: candy-reveal .8s ease forwards;
      text-shadow:
        0 0 14px #fff,
        0 0 30px rgba(255,255,255,.8);
    }

    @keyframes candy-reveal{
      from{
        opacity:0;
        transform:scale(.8) rotate(-4deg);
      }
      to{
        opacity:1;
        transform:scale(1) rotate(0);
      }
    }
  `]
})
export class CandyPreloaderComponent implements OnInit {
  progress = 0;
  ready = false;

  candies = Array.from({ length: 14 }, () => ({
    x: Math.random() * 100,
    delay: Math.random() * 1.5
  }));

  ngOnInit() {
    const steps = [8, 16, 24, 32, 45, 58, 70, 82, 94, 100];
    let i = 0;

    const tick = () => {
      if (i < steps.length) {
        this.progress = steps[i++];
        setTimeout(tick, 250 + Math.random() * 350);
      } else {
        setTimeout(() => {
          this.ready = true;
        }, 600);
      }
    };

    setTimeout(tick, 600);
  }
}
