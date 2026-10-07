import { NgTemplateOutlet } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { CarouselBase } from "@ui/core/carousel.base";

@Component({
  selector: "lux-carousel-mobile",

  imports: [NgTemplateOutlet],
  template: `
    <div class="lux-carousel-mobile">
      <div class="lux-carousel-mobile-track" #track (scroll)="onScroll(track)">
        @for (item of value(); track $index) {
          <div
            class="lux-carousel-mobile-slide"
            [style.min-width.%]="100 / numVisible()"
          >
            <ng-container
              [ngTemplateOutlet]="itemTemplate() ?? null"
              [ngTemplateOutletContext]="{ $implicit: item }"
            />
          </div>
        }
      </div>
      @if (value().length > 1) {
        <div class="lux-carousel-mobile-dots">
          @for (item of value(); track $index) {
            <button
              class="lux-carousel-mobile-dot"
              [class.lux-carousel-mobile-dot-active]="$index === activeIndex()"
              (click)="goTo(track, $index)"
            >
              <span class="lux-carousel-mobile-dot-inner"></span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .lux-carousel-mobile {
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .lux-carousel-mobile-track {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .lux-carousel-mobile-track::-webkit-scrollbar {
        display: none;
      }
      .lux-carousel-mobile-slide {
        flex-shrink: 0;
        scroll-snap-align: start;
        box-sizing: border-box;
        padding: 0 0.25rem;
      }
      .lux-carousel-mobile-dots {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 0;
      }
      .lux-carousel-mobile-dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        border: none;
        background: var(--ds-border);
        cursor: pointer;
        padding: 0;
        transition:
          background 0.2s,
          transform 0.2s;
      }
      .lux-carousel-mobile-dot-active {
        background: var(--ds-primary);
        transform: scale(1.3);
      }
      .lux-carousel-mobile-dot-inner {
        display: block;
      }
    `],
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
