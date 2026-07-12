import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import {
  IonAvatar,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonSpinner,
} from "@ionic/angular/standalone";


@Component({
  selector: "app-mobile-feedback",

  imports: [
    CommonModule,
    IonAvatar,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonLabel,
    IonList,
    IonProgressBar,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonSpinner,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Feedback & Estado de carga</div>
      <div class="mobile-card-body flex flex-column gap-5">
        <!-- --- ALERT BANNERS --- -->
        <div>
          <div class="font-bold text-sm mb-3">Alert Banners (DS patterns)</div>
          <div class="flex flex-column gap-2">
            <div class="ds-alert ds-alert--success">
              <span class="material-symbols-outlined ds-alert__icon"
                >check_circle</span
              >
              <span class="ds-alert__text"
                >System update successful. All files synced.</span
              >
            </div>
            <div class="ds-alert ds-alert--warning">
              <span class="material-symbols-outlined ds-alert__icon"
                >warning</span
              >
              <span class="ds-alert__text"
                >Storage is reaching 90% capacity.</span
              >
            </div>
            <div class="ds-alert ds-alert--error">
              <span class="material-symbols-outlined ds-alert__icon"
                >error</span
              >
              <span class="ds-alert__text"
                >Failed to upload attachment. Please retry.</span
              >
            </div>
          </div>
        </div>

        <!-- --- PROGRESS INDICATORS --- -->
        <div>
          <div class="font-bold text-sm mb-3">Progress Indicators (DS)</div>
          <div class="flex gap-4 align-items-start flex-wrap">
            <div>
              <span class="ds-progress-label">Linear</span>
              <div class="ds-progress-track">
                <div class="ds-progress-fill" style="width:65%;"></div>
              </div>
              <span class="text-xs text-secondary mt-1 block">65%</span>
            </div>
            <div>
              <span class="ds-progress-label">Circular</span>
              <svg viewBox="0 0 36 36" width="48" height="48">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#e0e3e5"
                  stroke-width="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#00050e"
                  stroke-width="3"
                  stroke-dasharray="100"
                  stroke-dashoffset="30"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

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
          <div class="font-bold text-sm mb-3">
            Progress Bar (ion-progress-bar)
          </div>
          <div class="flex flex-column gap-3">
            <div>
              <p class="text-xs text-secondary mb-1">Indeterminate</p>
              <ion-progress-bar type="indeterminate"></ion-progress-bar>
            </div>
            <div>
              <p class="text-xs text-secondary mb-1">Determinate é 65%</p>
              <ion-progress-bar
                type="determinate"
                [value]="0.65"
              ></ion-progress-bar>
            </div>
            <div>
              <p class="text-xs text-secondary mb-1">Buffer</p>
              <ion-progress-bar
                type="buffer"
                [value]="0.4"
                [buffer]="0.7"
              ></ion-progress-bar>
            </div>
          </div>
        </div>

        <!-- Skeleton Text -->
        <div>
          <div class="font-bold text-sm mb-3">
            Skeleton Text (ion-skeleton-text)
          </div>
          <ion-list
            lines="full"
            style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;"
          >
            @for (i of [1, 2, 3]; track i) {
              <ion-item>
                <ion-avatar slot="start">
                  <ion-skeleton-text [animated]="true"></ion-skeleton-text>
                </ion-avatar>
                <ion-label>
                  <h3>
                    <ion-skeleton-text
                      [animated]="true"
                      style="width:60%"
                    ></ion-skeleton-text>
                  </h3>
                  <p>
                    <ion-skeleton-text
                      [animated]="true"
                      style="width:80%"
                    ></ion-skeleton-text>
                  </p>
                  <p>
                    <ion-skeleton-text
                      [animated]="true"
                      style="width:40%"
                    ></ion-skeleton-text>
                  </p>
                </ion-label>
              </ion-item>
            }
          </ion-list>
        </div>

        <!-- Infinite Scroll -->
        <div>
          <div class="font-bold text-sm mb-3">
            Infinite Scroll (ion-infinite-scroll)
          </div>
          <div
            style="max-height:220px;overflow-y:auto;border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;"
          >
            <ion-list lines="full">
              @for (item of items(); track item) {
                <ion-item>
                  <ion-label>{{ item }}</ion-label>
                </ion-item>
              }
            </ion-list>
            <ion-infinite-scroll
              (ionInfinite)="loadMore($event)"
              [disabled]="disableScroll()"
            >
              <ion-infinite-scroll-content
                loadingSpinner="crescent"
                loadingText="Cargando mós..."
              ></ion-infinite-scroll-content>
            </ion-infinite-scroll>
          </div>
          <p class="text-xs text-secondary mt-1">
            {{ items().length }} items cargados é desplézate para cargar mós.
          </p>
        </div>

        <!-- --- Pull-to-Refresh --- -->
        <div>
          <div class="font-bold text-sm mb-3">
            Pull-to-Refresh (ion-refresher)
          </div>
          <div
            style="height:160px;overflow-y:auto;border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;position:relative;"
          >
            <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
              <ion-refresher-content
                pullingIcon="chevron-down-circle-outline"
                pullingText="Desliza para actualizar"
                refreshingSpinner="crescent"
                refreshingText="Actualizando datos..."
              >
              </ion-refresher-content>
            </ion-refresher>
            <ion-list lines="full" class="p-2">
              @for (r of refreshItems(); track r) {
                <ion-item>
                  <ion-label class="text-sm">{{ r }}</ion-label>
                </ion-item>
              }
            </ion-list>
          </div>
          <p class="text-xs text-secondary mt-1">
            Actualizado: {{ refreshCount() }}x é desliza hacia abajo para
            simular.
          </p>
          <ion-button
            size="small"
            fill="outline"
            (click)="simulateRefresh()"
            class="mt-2"
          >
            Simular refresh
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../../shared/mobile-showcase-styles.css"],
  styles: [
    `
      .ds-alert {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.65rem 0.75rem;
        border-radius: 10px;
        font-size: 0.82rem;
      }
      .ds-alert--success {
        background: #e8f5e9;
        border: 1px solid #a5d6a7;
        color: #1b5e20;
      }
      .ds-alert--warning {
        background: #fffde7;
        border: 1px solid #fff59d;
        color: #f57f17;
      }
      .ds-alert--error {
        background: #ffdad6;
        border: 1px solid #ef9a9a;
        color: #93000a;
      }
      .ds-alert__icon {
        font-size: 1.25rem;
        flex-shrink: 0;
      }
      .ds-alert--success .ds-alert__icon {
        color: #2e7d32;
      }
      .ds-alert--warning .ds-alert__icon {
        color: #fbc02d;
      }
      .ds-alert--error .ds-alert__icon {
        color: #ba1a1a;
      }
      .ds-alert__text {
        line-height: 1.4;
      }
      .ds-progress-label {
        display: block;
        font-size: 0.65rem;
        font-weight: 600;
        color: var(--ds-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.35rem;
      }
      .ds-progress-track {
        width: 120px;
        height: 8px;
        background: var(--ds-bg-elevated);
        border-radius: 999px;
        overflow: hidden;
      }
      .ds-progress-fill {
        height: 100%;
        background: var(--ds-primary);
        border-radius: 999px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MobileFeedback {
  items = signal<string[]>(
    Array.from({ length: 10 }, (_, i) => `Elemento #${i + 1}`),
  );
  disableScroll = signal(false);

  // --- Pull-to-Refresh ---
  refreshCount = signal(0);
  refreshItems = signal<string[]>(["Registro A", "Registro B", "Registro C"]);

  handleRefresh(event: CustomEvent): void {
    setTimeout(() => {
      this.refreshCount.update((n) => n + 1);
      this.refreshItems.set([
        `Registro actualizado #${this.refreshCount()}`,
        "Registro A",
        "Registro B",
      ]);
      (event.target as HTMLIonRefresherElement).complete();
    }, 1200);
  }

  simulateRefresh(): void {
    this.refreshCount.update((n) => n + 1);
    this.refreshItems.set([
      `Simulado #${this.refreshCount()}`,
      "Nuevo dato",
      "Registro fresco",
    ]);
  }

  loadMore(event: CustomEvent): void {
    setTimeout(() => {
      const current = this.items();
      if (current.length >= 30) {
        this.disableScroll.set(true);
      } else {
        this.items.set([
          ...current,
          ...Array.from(
            { length: 5 },
            (_, i) => `Elemento #${current.length + i + 1}`,
          ),
        ]);
      }
      (event.target as HTMLIonInfiniteScrollElement).complete();
    }, 800);
  }
}
