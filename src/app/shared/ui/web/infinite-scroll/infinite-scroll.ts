import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewEncapsulation,
} from "@angular/core";
import { InfiniteScrollBase } from "@ui/base/infinite-scroll.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-infinite-scroll",

  imports: [CommonModule, AppIcon],
  template: `
    <div #sentinel class="infinite-scroll-sentinel">
      @if (loading()) {
        <div class="infinite-scroll-loader">
          <app-icon icon="mdi:loading" class="infinite-scroll-spinner" />
          <span>Cargando más registros...</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .infinite-scroll-sentinel {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 1rem;
      }
      .infinite-scroll-loader {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--ds-text-muted);
        font-size: var(--ds-font-size-table, 0.875rem);
      }
      .infinite-scroll-spinner {
        animation: spin 1s linear infinite;
        font-size: 1.25rem;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class InfiniteScroll
  extends InfiniteScrollBase
  implements AfterViewInit, OnDestroy
{
  private el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.loading() && !this.disabled()) {
          this.loadMore.emit();
        }
      },
      { rootMargin: this.threshold() },
    );

    const sentinel = this.el.nativeElement.querySelector(
      ".infinite-scroll-sentinel",
    );
    if (sentinel) {
      this.observer.observe(sentinel);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
