import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'tile-mana-bloom',
  standalone: true,
  template: `
    <div class="tile">
      <div class="void"></div>
      <div class="runes"></div>
      <div class="sigil"></div>
      <div class="text">MANA BLOOM</div>
    </div>
  `,
  styles: [`
    .tile{
      width:200px;
      height:100px;
      position:relative;
      overflow:hidden;
      cursor:pointer;
      background:radial-gradient(circle,#220033,#050008);
      background-size: calc(400% + 50px) calc(400% + 50px);
      box-shadow:0 0 40px #000 inset;
      user-select:none;
    }

    .void{
      position:absolute;
      inset:-50%;
      background:
        radial-gradient(circle at 40% 60%, #7e22ce44 0%, transparent 40%),
        radial-gradient(circle at 60% 30%, #a855f744 0%, transparent 45%),
        conic-gradient(from 0deg,#2e004f,#5b21b6,#9333ea,#5b21b6,#2e004f);
      background-size: calc(400% + 50px) calc(400% + 50px);
      filter:blur(24px) saturate(160%);
      animation: slow-rotate 20s linear infinite;
      transition: opacity 0.3s ease, filter 0.3s ease;
    }

    @keyframes slow-rotate{
      to{ transform:rotate(360deg); }
    }

    .runes{
      position:absolute;
      inset:0;
      background:
        repeating-linear-gradient(
          90deg,
          transparent 0 14px,
          rgba(192,132,252,.08) 14px 15px
        );
      background-size: calc(400% + 50px) calc(400% + 50px);
      mix-blend-mode:screen;
      opacity:.4;
    }

    .sigil{
      position:absolute;
      inset:32%;
      border-radius:50%;
      border:2px solid #c084fc;
      box-shadow:
        0 0 20px #c084fc,
        inset 0 0 12px #c084fc;
      background:
        conic-gradient(from 0deg,transparent,#c084fc,transparent);
      background-size: calc(400% + 50px) calc(400% + 50px);
      opacity:.7;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .text{
      position:relative;
      z-index:5;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:900;
      letter-spacing:2px;
      color:#f5e9ff;
      text-shadow:
        0 0 10px #c084fc,
        0 0 20px #7e22ce;
      pointer-events:none;
      transform:scale(1.02) rotate(2deg) skewX(-4deg);
    }
  `]
})
export class TileManaBloom implements AfterViewInit, OnDestroy {
  private hoverActive = false;
  private pulseIntervalId: number | null = null;
  private cleanup: Array<() => void> = [];

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const host = this.el.nativeElement as HTMLElement;
    const tile = host.querySelector('.tile') as HTMLElement | null;
    const sigil = host.querySelector('.sigil') as HTMLElement | null;
    const voidLayer = host.querySelector('.void') as HTMLElement | null;

    if (!tile || !sigil || !voidLayer) {
      return;
    }

    const onEnter = () => {
      this.hoverActive = true;
      sigil.style.opacity = '1';
      this.runJitter(200, 40, () => {
        sigil.style.transform = `scale(${1 + Math.random() * 0.3}) rotate(${Math.random() * 360}deg)`;
      });

      voidLayer.style.opacity = '1';
      this.runJitter(800, 80, () => {
        voidLayer.style.filter = `blur(${18 + Math.random() * 12}px) saturate(${140 + Math.random() * 100}%)`;
      });
    };

    const onLeave = () => {
      this.hoverActive = false;
      sigil.style.opacity = '0.6';
      sigil.style.transform = 'scale(1) rotate(0deg)';
      voidLayer.style.opacity = '0.8';
      voidLayer.style.filter = 'blur(24px) saturate(160%)';
    };

    tile.addEventListener('mouseenter', onEnter);
    tile.addEventListener('mouseleave', onLeave);
    this.cleanup.push(() => tile.removeEventListener('mouseenter', onEnter));
    this.cleanup.push(() => tile.removeEventListener('mouseleave', onLeave));

    this.pulseIntervalId = window.setInterval(() => {
      if (!this.hoverActive) {
        sigil.style.transform = `scale(${0.9 + Math.random() * 0.2}) rotate(${Math.random() * 40 - 20}deg)`;
      }
    }, 1200);
  }

  ngOnDestroy(): void {
    if (this.pulseIntervalId !== null) {
      window.clearInterval(this.pulseIntervalId);
      this.pulseIntervalId = null;
    }
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
  }

  private runJitter(durationMs: number, stepMs: number, update: () => void): void {
    const start = performance.now();
    const tick = () => {
      update();
      if (performance.now() - start < durationMs) {
        window.setTimeout(tick, stepMs);
      }
    };
    tick();
  }
}




