import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  closeOutline,
  documentTextOutline,
  layersOutline,
  phonePortraitOutline,
} from "ionicons/icons";

@Component({
  selector: "app-mobile-page-structure",
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Estructura de página (ion-header / ion-content / ion-footer)</div>
      <div class="mobile-card-body flex flex-column gap-5">

        <!-- Anatomía visual -->
        <div>
          <div class="font-bold text-sm mb-2">Anatomía de una página Ionic</div>
          <div class="page-anatomy">
            <div class="anatomy-header">
              <span class="anatomy-label">ion-header</span>
              <span class="anatomy-desc">ion-toolbar · ion-title · ion-buttons</span>
            </div>
            <div class="anatomy-content">
              <span class="anatomy-label">ion-content</span>
              <span class="anatomy-desc">Área scrollable. Gestiona padding seguro (notch/home bar).</span>
            </div>
            <div class="anatomy-footer">
              <span class="anatomy-label">ion-footer</span>
              <span class="anatomy-desc">ion-toolbar · acciones persistentes</span>
            </div>
          </div>
        </div>

        <!-- Demos -->
        <div>
          <div class="font-bold text-sm mb-2">Demos en modal</div>
          <p class="text-xs text-secondary mb-2">
            Los elementos de estructura sólo tienen significado dentro de una página o modal.
          </p>
          <div class="flex gap-2 flex-wrap">
            <ion-button size="small" color="primary" (click)="basicOpen.set(true)">
              <ion-icon name="phone-portrait-outline" slot="start"></ion-icon>
              Página básica
            </ion-button>
            <ion-button size="small" color="secondary" (click)="subheaderOpen.set(true)">
              <ion-icon name="layers-outline" slot="start"></ion-icon>
              Con sub-toolbar
            </ion-button>
            <ion-button size="small" color="tertiary" (click)="footerOpen.set(true)">
              <ion-icon name="document-text-outline" slot="start"></ion-icon>
              Footer con acciones
            </ion-button>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal: página básica -->
    <ion-modal [isOpen]="basicOpen()" (didDismiss)="basicOpen.set(false)">
      <ng-template>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Detalle</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="basicOpen.set(false)">
                <ion-icon name="close-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p class="text-sm text-secondary mb-3">
            Esta página usa <strong>ion-header</strong> fijo en la parte superior e
            <strong>ion-content</strong> scrollable.
          </p>
          <p class="text-sm text-secondary mb-3">
            El padding del contenido respeta automáticamente el safe-area del dispositivo
            (notch superior, home indicator inferior).
          </p>
          <p class="text-sm text-secondary">
            Scroll para ver el comportamiento del header sticky.
          </p>
          @for (i of items; track i) {
            <div class="demo-item">Elemento {{ i }}</div>
          }
        </ion-content>
      </ng-template>
    </ion-modal>

    <!-- Modal: sub-toolbar (dos toolbars en el header) -->
    <ion-modal [isOpen]="subheaderOpen()" (didDismiss)="subheaderOpen.set(false)">
      <ng-template>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Listado con filtros</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="subheaderOpen.set(false)">
                <ion-icon name="close-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
          <ion-toolbar>
            <div class="sub-toolbar-content">
              <ion-button fill="outline" size="small" color="primary">Todos</ion-button>
              <ion-button fill="clear" size="small" color="medium">Activos</ion-button>
              <ion-button fill="clear" size="small" color="medium">Inactivos</ion-button>
            </div>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p class="text-sm text-secondary mb-3">
            El <strong>ion-header</strong> puede contener múltiples <strong>ion-toolbar</strong>
            apilados. Útil para buscadores o filtros persistentes bajo el título.
          </p>
          @for (i of items; track i) {
            <div class="demo-item">Registro {{ i }}</div>
          }
        </ion-content>
      </ng-template>
    </ion-modal>

    <!-- Modal: footer con acciones -->
    <ion-modal [isOpen]="footerOpen()" (didDismiss)="footerOpen.set(false)">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>Formulario</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="footerOpen.set(false)">
                <ion-icon name="close-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p class="text-sm text-secondary mb-3">
            El <strong>ion-footer</strong> mantiene los botones de acción fijos en la parte inferior,
            fuera del área scrollable.
          </p>
          @for (i of items; track i) {
            <div class="demo-item">Campo {{ i }}</div>
          }
        </ion-content>
        <ion-footer>
          <ion-toolbar>
            <div class="footer-actions">
              <ion-button fill="outline" color="medium" (click)="footerOpen.set(false)">Cancelar</ion-button>
              <ion-button color="primary" (click)="footerOpen.set(false)">Guardar</ion-button>
            </div>
          </ion-toolbar>
        </ion-footer>
      </ng-template>
    </ion-modal>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }

    .page-anatomy { border: 1px solid var(--ds-border,#e2e8f0); border-radius: 8px; overflow: hidden; font-size: 0.75rem; }
    .anatomy-header { background: var(--ion-color-primary,#3880ff); color: #fff; padding: 0.5rem 0.75rem; display: flex; flex-direction: column; gap: 2px; }
    .anatomy-content { background: var(--ds-bg-surface,#fff); border-top: 1px solid var(--ds-border,#e2e8f0); border-bottom: 1px solid var(--ds-border,#e2e8f0); padding: 1rem 0.75rem; min-height: 64px; display: flex; flex-direction: column; gap: 4px; }
    .anatomy-footer { background: var(--ds-bg-elevated,#f4f5f8); padding: 0.5rem 0.75rem; display: flex; flex-direction: column; gap: 2px; }
    .anatomy-label { font-weight: 700; font-family: monospace; }
    .anatomy-desc { opacity: 0.8; }

    .demo-item { padding: 0.75rem 0; border-bottom: 1px solid var(--ds-border,#e2e8f0); font-size: 0.875rem; color: var(--ds-text-secondary); }

    .sub-toolbar-content { display: flex; gap: 4px; padding: 4px 8px; }

    .footer-actions { display: flex; gap: 8px; justify-content: flex-end; padding: 0 8px; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobilePageStructure {
  basicOpen = signal(false);
  subheaderOpen = signal(false);
  footerOpen = signal(false);

  readonly items = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor() {
    addIcons({ closeOutline, documentTextOutline, layersOutline, phonePortraitOutline });
  }
}
