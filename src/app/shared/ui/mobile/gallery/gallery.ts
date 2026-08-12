import { Component, signal, ViewEncapsulation } from "@angular/core";
import { GalleryBase } from "@ui/base/gallery.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-gallery",

  imports: [AppIcon],
  template: `
    <div class="ili-gallery">
      @if (images().length > 0) {
        <div class="ili-gallery-viewport">
          <div
            class="ili-gallery-track"
            #track
            (touchstart)="onTouchStart($event, track)"
            (touchend)="onTouchEnd($event, track)"
            (mousedown)="onMouseDown($event, track)"
            (mouseup)="onMouseUp($event, track)"
            (mouseleave)="onMouseUp($event, track)"
          >
            @for (image of images(); track $index) {
              <div class="ili-gallery-slide" style="min-width: 100%;">
                <img
                  [src]="image.src || image.url || image"
                  [alt]="image.alt || image.title || ''"
                  class="ili-gallery-image"
                  draggable="false"
                />
              </div>
            }
          </div>
        </div>

        <div class="ili-gallery-controls">
          <button
            class="ili-gallery-nav"
            (click)="prev()"
            [disabled]="currentIndex() === 0"
          >
            <app-icon icon="material-symbols-light:chevron-left" />
          </button>
          <span class="ili-gallery-counter"
            >{{ currentIndex() + 1 }} / {{ images().length }}</span
          >
          <button
            class="ili-gallery-nav"
            (click)="next()"
            [disabled]="currentIndex() === images().length - 1"
          >
            <app-icon icon="material-symbols-light:chevron-right" />
          </button>
        </div>

        @if (thumbnailPosition() !== "bottom") {
          <div
            class="ili-gallery-thumbnails"
            [class.ili-gallery-thumbnails-bottom]="
              thumbnailPosition() === 'bottom'
            "
          >
            @for (image of images(); track $index) {
              <button
                class="ili-gallery-thumb"
                [class.ili-gallery-thumb-active]="$index === currentIndex()"
                (click)="goTo($index)"
              >
                <img
                  [src]="image.thumbnail || image.src || image.url || image"
                  alt=""
                />
              </button>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .ili-gallery {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }
      .ili-gallery-viewport {
        overflow: hidden;
        border-radius: var(--ds-radius-md);
        background: var(--ds-bg-muted);
      }
      .ili-gallery-track {
        display: flex;
        transition: transform 0.3s ease;
        cursor: grab;
        user-select: none;
      }
      .ili-gallery-track:active {
        cursor: grabbing;
      }
      .ili-gallery-slide {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ili-gallery-image {
        width: 100%;
        height: 300px;
        object-fit: contain;
        display: block;
      }
      .ili-gallery-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }
      .ili-gallery-nav {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        border: 1px solid var(--ds-border);
        background: var(--ds-bg-primary);
        color: var(--ds-text-primary);
        cursor: pointer;
        font-size: 1.25rem;
        transition: background 0.15s;
      }
      .ili-gallery-nav:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .ili-gallery-nav:not(:disabled):active {
        background: var(--ds-bg-muted);
      }
      .ili-gallery-counter {
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-secondary);
        min-width: 4rem;
        text-align: center;
      }
      .ili-gallery-thumbnails {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        padding: 0.5rem 0;
      }
      .ili-gallery-thumbnails-bottom {
        order: 1;
      }
      .ili-gallery-thumb {
        flex-shrink: 0;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: var(--ds-radius-sm);
        border: 2px solid transparent;
        overflow: hidden;
        cursor: pointer;
        padding: 0;
        background: none;
        transition: border-color 0.2s;
      }
      .ili-gallery-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .ili-gallery-thumb-active {
        border-color: var(--ds-primary);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileGallery extends GalleryBase {
  currentIndex = signal(0);
  private startX = 0;
  private isDragging = false;

  prev(): void {
    if (this.currentIndex() > 0) this.currentIndex.update((i) => i - 1);
  }

  next(): void {
    if (this.currentIndex() < this.images().length - 1)
      this.currentIndex.update((i) => i + 1);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  onTouchStart(event: TouchEvent, track: HTMLElement): void {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent, track: HTMLElement): void {
    const diff = event.changedTouches[0].clientX - this.startX;
    if (diff > 50) this.prev();
    else if (diff < -50) this.next();
  }

  onMouseDown(event: MouseEvent, track: HTMLElement): void {
    this.isDragging = true;
    this.startX = event.clientX;
  }

  onMouseUp(event: MouseEvent, track: HTMLElement): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    const diff = event.clientX - this.startX;
    if (diff > 50) this.prev();
    else if (diff < -50) this.next();
  }
}
