import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cinematic-loader',
  standalone: true,
  imports:[CommonModule],
  template: `
    <div class="cinematic">

      <div class="boot" *ngIf="!ready">
        <div class="title">SYSTEM INITIALIZING</div>

        <div class="loader">
          <div class="bar" [style.width.%]="progress"></div>
        </div>

        <div class="percent">{{ progress }}%</div>

        <div class="subtitle">
          Establishing Hyperlane…
        </div>
      </div>

      <div class="game" *ngIf="ready">
        <div class="game-placeholder">
          GAME COMPONENT ONLINE
        </div>
      </div>

    </div>
  `,
  styles: [`
    .cinematic{
      width:100%;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#020814;
      color:#0ff;
      overflow:hidden;
    }

    /* ===================== */
    /* Boot screen           */
    /* ===================== */
    .boot{
      text-align:center;
      animation: boot-fade-in 1.2s ease forwards;
    }

    @keyframes boot-fade-in{
      from{ opacity:0; }
      to{ opacity:1; }
    }

    .title{
      font-size:22px;
      letter-spacing:3px;
      margin-bottom:18px;
      text-shadow:0 0 20px #0ff;
    }

    .loader{
      width:320px;
      height:6px;
      background:#022;
      overflow:hidden;
      box-shadow:0 0 12px #0ff inset;
      margin:0 auto 10px;
    }

    .bar{
      height:100%;
      background:linear-gradient(90deg,#0ff,#7ff);
      box-shadow:0 0 14px #0ff;
      transition:width .4s ease;
    }

    .percent{
      font-size:14px;
      margin-top:6px;
      letter-spacing:2px;
      opacity:.8;
    }

    .subtitle{
      margin-top:14px;
      font-size:13px;
      opacity:.6;
      letter-spacing:1px;
    }

    /* ===================== */
    /* Game reveal           */
    /* ===================== */
    .game{
      width:100%;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      animation: game-reveal 1s ease forwards;
    }

    @keyframes game-reveal{
      from{
        opacity:0;
        transform:scale(.96);
      }
      to{
        opacity:1;
        transform:scale(1);
      }
    }

    .game-placeholder{
      font-size:32px;
      font-weight:900;
      letter-spacing:3px;
      text-shadow:
        0 0 14px #0ff,
        0 0 30px rgba(0,255,255,.6);
    }
  `]
})
export class CinematicLoaderComponent implements OnInit {
  progress = 0;
  ready = false;

  ngOnInit() {
    // deliberately non-linear, dramatic pacing
    const steps = [5, 12, 18, 25, 33, 41, 52, 66, 78, 90, 100];
    let i = 0;

    const tick = () => {
      if (i < steps.length) {
        this.progress = steps[i++];
        setTimeout(tick, 300 + Math.random() * 400);
      } else {
        setTimeout(() => {
          this.ready = true;
        }, 600);
      }
    };

    setTimeout(tick, 800);
  }
}
