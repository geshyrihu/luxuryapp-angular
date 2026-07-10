import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { CarouselBase } from "@ui/base/carousel.base";

@Component({
  selector: "ili-carousel",

  imports: [CommonModule],
  template: `
    <div class="ili-carousel">
      <div class="ili-carousel-track" #track (scroll)="onScroll(track)">
        @for (item of value(); track $index) {
          <div
            class="ili-carousel-slide"
            [style.min-width.%]="100 / numVisible()"
          >
            <ng-content />
          </div>
        }
      </div>
      @if (value().length > 1) {
        <div class="ili-carousel-dots">
          @for (item of value(); track $index) {
            <button
              class="ili-carousel-dot"
              [class.ili-carousel-dot-active]="$index === activeIndex()"
              (click)="goTo(track, $index)"
            >
              <span class="ili-carousel-dot-inner"></span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-carousel {
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .ili-carousel-track {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .ili-carousel-track::-webkit-scrollbar {
        display: none;
      }
      .ili-carousel-slide {
        flex-shrink: 0;
        scroll-snap-align: start;
        box-sizing: border-box;
        padding: 0 0.25rem;
      }
      .ili-carousel-dots {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 0;
      }
      .ili-carousel-dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        border: none;
        background: var(--ds-border, #e2e8f0);
        cursor: pointer;
        padding: 0;
        transition:
          background 0.2s,
          transform 0.2s;
      }
      .ili-carousel-dot-active {
        background: var(--ds-primary, #003d9b);
        transform: scale(1.3);
      }
      .ili-carousel-dot-inner {
        display: block;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileCarousel extends CarouselBase {
  activeIndex = signal(0);

  onScroll(track: HTMLElement): void {
    const slideWidth = track.scrollWidth / this.value().length;
    const idx = Math.round(track.scrollLeft / slideWidth);
    this.activeIndex.set(idx);
  }

  goTo(track: HTMLElement, index: number): void {
    const slideWidth = track.scrollWidth / this.value().length;
    track.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    this.activeIndex.set(index);
  }
}
