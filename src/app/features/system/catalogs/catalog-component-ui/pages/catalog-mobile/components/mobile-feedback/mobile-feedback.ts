import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonSkeletonText,
  IonSpinner,
  IonAvatar,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-feedback",
  standalone: true,
  imports: [
    CommonModule,
    IonAvatar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonLabel,
    IonList,
    IonProgressBar,
    IonSkeletonText,
    IonSpinner,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Feedback & Estado de carga</div>
      <div class="mobile-card-body flex flex-column gap-5">

        <!-- Spinners -->
        <div>
          <div class="font-bold text-sm mb-3">Spinners (ion-spinner)</div>
          <div class="flex gap-4 align-items-center flex-wrap">
            <div class="flex flex-column align-items-center gap-1">
              <ion-spinner name="crescent" color="primary"></ion-spinner>
              <span class="text-xs text-secondary">crescent</span>
            </div>
            <div class="flex flex-column align-items-center gap-1">
              <ion-spinner name="dots" color="secondary"></ion-spinner>
              <span class="text-xs text-secondary">dots</span>
            </div>
            <div class="flex flex-column align-items-center gap-1">
              <ion-spinner name="lines" color="success"></ion-spinner>
              <span class="text-xs text-secondary">lines</span>
            </div>
            <div class="flex flex-column align-items-center gap-1">
              <ion-spinner name="bubbles" color="warning"></ion-spinner>
              <span class="text-xs text-secondary">bubbles</span>
            </div>
            <div class="flex flex-column align-items-center gap-1">
              <ion-spinner name="circles" color="danger"></ion-spinner>
              <span class="text-xs text-secondary">circles</span>
            </div>
            <div class="flex flex-column align-items-center gap-1">
              <ion-spinner name="circular" color="tertiary"></ion-spinner>
              <span class="text-xs text-secondary">circular</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div>
          <div class="font-bold text-sm mb-3">Progress Bar (ion-progress-bar)</div>
          <div class="flex flex-column gap-3">
            <div>
              <p class="text-xs text-secondary mb-1">Indeterminate</p>
              <ion-progress-bar type="indeterminate"></ion-progress-bar>
            </div>
            <div>
              <p class="text-xs text-secondary mb-1">Determinate — 65%</p>
              <ion-progress-bar type="determinate" [value]="0.65"></ion-progress-bar>
            </div>
            <div>
              <p class="text-xs text-secondary mb-1">Buffer</p>
              <ion-progress-bar type="buffer" [value]="0.4" [buffer]="0.7"></ion-progress-bar>
            </div>
          </div>
        </div>

        <!-- Skeleton Text -->
        <div>
          <div class="font-bold text-sm mb-3">Skeleton Text (ion-skeleton-text)</div>
          <ion-list lines="full" style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            @for (i of [1,2,3]; track i) {
              <ion-item>
                <ion-avatar slot="start">
                  <ion-skeleton-text [animated]="true"></ion-skeleton-text>
                </ion-avatar>
                <ion-label>
                  <h3>
                    <ion-skeleton-text [animated]="true" style="width:60%"></ion-skeleton-text>
                  </h3>
                  <p>
                    <ion-skeleton-text [animated]="true" style="width:80%"></ion-skeleton-text>
                  </p>
                  <p>
                    <ion-skeleton-text [animated]="true" style="width:40%"></ion-skeleton-text>
                  </p>
                </ion-label>
              </ion-item>
            }
          </ion-list>
        </div>

        <!-- Infinite Scroll -->
        <div>
          <div class="font-bold text-sm mb-3">Infinite Scroll (ion-infinite-scroll)</div>
          <div style="max-height:220px;overflow-y:auto;border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-list lines="full">
              @for (item of items(); track item) {
                <ion-item>
                  <ion-label>{{ item }}</ion-label>
                </ion-item>
              }
            </ion-list>
            <ion-infinite-scroll (ionInfinite)="loadMore($event)" [disabled]="disableScroll()">
              <ion-infinite-scroll-content
                loadingSpinner="crescent"
                loadingText="Cargando más..."
              ></ion-infinite-scroll-content>
            </ion-infinite-scroll>
          </div>
          <p class="text-xs text-secondary mt-1">{{ items().length }} items cargados — desplázate para cargar más.</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileFeedback {
  items = signal<string[]>(Array.from({ length: 10 }, (_, i) => `Elemento #${i + 1}`));
  disableScroll = signal(false);

  loadMore(event: CustomEvent): void {
    setTimeout(() => {
      const current = this.items();
      if (current.length >= 30) {
        this.disableScroll.set(true);
      } else {
        this.items.set([
          ...current,
          ...Array.from({ length: 5 }, (_, i) => `Elemento #${current.length + i + 1}`),
        ]);
      }
      (event.target as HTMLIonInfiniteScrollElement).complete();
    }, 800);
  }
}
