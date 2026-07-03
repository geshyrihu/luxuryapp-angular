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
import { MOBILE_SHOWCASE_STYLES } from "../../../../../shared/mobile-showcase-styles";

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
          <div class="font-bold text-sm mb-2">Anatomáa de una página Ionic</div>
          <div class="page-anatomy">
            <div class="anatomy-header">
              <span class="anatomy-label">ion-header</span>
              <span class="anatomy-desc">ion-toolbar é ion-title é ion-buttons</span>
            </div>
            <div class="anatomy-content">
              <span class="anatomy-label">ion-content</span>
              <span class="anatomy-desc">órea scrollable. Gestiona padding seguro (notch/home bar).</span>
            </div>
            <div class="anatomy-footer">
              <span class="anatomy-label">ion-footer</span>
              <span class="anatomy-desc">ion-toolbar é acciones persistentes</span>
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

      <!-- --- PATRóN: Page with Segmented Tabs (ui-stiich Corporate Integrity) --- -->
      <div class="stiich-section">
        <div class="stiich-section__header">
          <span class="stiich-section__eyebrow">Corporate Integrity</span>
          <h4 class="stiich-section__title">Detail Page with Segmented Tabs</h4>
        </div>
        <p class="stiich-section__desc">
          Página de detalle con header, segment control y contenido switcheable.
          Inspirado en <code>perfil_y_ajustes_modo_claro</code> y <code>navegación_y_feedback</code>.
        </p>
        <div class="stiich-page-preview">
          <!-- Top Bar -->
          <div class="stiich-page-topbar">
            <button class="stiich-page-topbar__btn">
              <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <span class="stiich-page-topbar__title">Detalle de activo</span>
            <button class="stiich-page-topbar__btn">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          <!-- Hero -->
          <div class="stiich-page-hero">
            <div class="stiich-page-hero__avatar">
              <span class="material-symbols-outlined" style="font-size:1.5rem;color:#fff;">precision_manufacturing</span>
            </div>
            <div class="stiich-page-hero__info">
              <span class="stiich-page-hero__name">Bomba Hidroneumótica</span>
              <span class="stiich-page-hero__meta">EQ-001 é Torre A, Piso 4</span>
              <div class="stiich-page-hero__status">
                <span class="stiich-chip stiich-chip--success">Operativo</span>
                <span class="stiich-chip stiich-chip--info">Programado</span>
              </div>
            </div>
          </div>
          <!-- Segmented Tabs -->
          <div class="stiich-segment">
            @for (tab of tabs; track tab.key) {
              <button
                class="stiich-segment__tab"
                [class.stiich-segment__tab--active]="activeSegment() === tab.key"
                (click)="activeSegment.set(tab.key)"
              >
                <span class="material-symbols-outlined stiich-segment__icon">{{ tab.icon }}</span>
                <span>{{ tab.label }}</span>
              </button>
            }
          </div>
          <!-- Content area -->
          <div class="stiich-page-content">
            @switch (activeSegment()) {
              @case ('info') {
                <div class="stiich-info-grid">
                  <div class="stiich-info-item"><span>Marca</span><span>Grundfos</span></div>
                  <div class="stiich-info-item"><span>Modelo</span><span>CR-20-4</span></div>
                  <div class="stiich-info-item"><span>Ubicación</span><span>Torre A é Piso 4</span></div>
                  <div class="stiich-info-item"><span>Instalación</span><span>2023-08-15</span></div>
                  <div class="stiich-info-item"><span>Próximo servicio</span><span>2026-08-15</span></div>
                  <div class="stiich-info-item"><span>Garantía</span><span>5 años</span></div>
                </div>
              }
              @case ('history') {
                <div class="stiich-timeline">
                  <div class="stiich-timeline__item">
                    <div class="stiich-timeline__dot"></div>
                    <div><strong>Servicio preventivo</strong><p class="text-xs text-secondary m-0">2026-06-15 é Técnico: J. Garcéa</p></div>
                  </div>
                  <div class="stiich-timeline__item">
                    <div class="stiich-timeline__dot stiich-timeline__dot--warn"></div>
                    <div><strong>Falla menor</strong><p class="text-xs text-secondary m-0">2026-05-28 é Vólvula de retención</p></div>
                  </div>
                  <div class="stiich-timeline__item">
                    <div class="stiich-timeline__dot"></div>
                    <div><strong>Instalación inicial</strong><p class="text-xs text-secondary m-0">2023-08-15 é Proveedor: HydraTech</p></div>
                  </div>
                </div>
              }
              @case ('docs') {
                <div class="flex flex-column gap-2 p-2">
                  <div class="stiich-doc-row"><span class="material-symbols-outlined" style="color:#00050e;">description</span><span>Manual tócnico.pdf</span><span class="text-xs text-secondary">2.4 MB</span></div>
                  <div class="stiich-doc-row"><span class="material-symbols-outlined" style="color:#00050e;">receipt</span><span>Factura de compra.pdf</span><span class="text-xs text-secondary">1.1 MB</span></div>
                  <div class="stiich-doc-row"><span class="material-symbols-outlined" style="color:#00050e;">assignment</span><span>Reporte de inspección.pdf</span><span class="text-xs text-secondary">0.8 MB</span></div>
                </div>
              }
            }
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
            El padding del contenido respeta automóticamente el safe-area del dispositivo
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
            El <strong>ion-header</strong> puede contener móltiples <strong>ion-toolbar</strong>
            apilados. ótil para buscadores o filtros persistentes bajo el tótulo.
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
            fuera del órea scrollable.
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
  styles: [MOBILE_SHOWCASE_STYLES, `
    .page-anatomy { border: 1px solid var(--ds-border,#e2e8f0); border-radius: 8px; overflow: hidden; font-size: 0.75rem; }
    .anatomy-header { background: var(--ion-color-primary,#3880ff); color: #fff; padding: 0.5rem 0.75rem; display: flex; flex-direction: column; gap: 2px; }
    .anatomy-content { background: var(--ds-bg-surface,#fff); border-top: 1px solid var(--ds-border,#e2e8f0); border-bottom: 1px solid var(--ds-border,#e2e8f0); padding: 1rem 0.75rem; min-height: 64px; display: flex; flex-direction: column; gap: 4px; }
    .anatomy-footer { background: var(--ds-bg-elevated,#f4f5f8); padding: 0.5rem 0.75rem; display: flex; flex-direction: column; gap: 2px; }
    .anatomy-label { font-weight: 700; font-family: monospace; }
    .anatomy-desc { opacity: 0.8; }

    .demo-item { padding: 0.75rem 0; border-bottom: 1px solid var(--ds-border,#e2e8f0); font-size: 0.875rem; color: var(--ds-text-secondary); }

    .sub-toolbar-content { display: flex; gap: 4px; padding: 4px 8px; }

    .footer-actions { display: flex; gap: 8px; justify-content: flex-end; padding: 0 8px; }

    /* -----------------------------------------------
       Corporate Integrity DS é patrones ui-stiich
       ----------------------------------------------- */
    .stiich-section { margin-top: 1.5rem; }
    .stiich-section__header { margin-bottom: 0.25rem; }
    .stiich-section__eyebrow { font-size: 0.65rem; font-weight: 700; color: var(--ds-primary,#00050e); text-transform: uppercase; letter-spacing: 0.08em; }
    .stiich-section__desc { font-size: 0.75rem; color: var(--ds-text-muted,#64748b); margin: 0.25rem 0 0.75rem 0; line-height: 1.4; }

    .stiich-page-preview { background: #fbf9fb; border: 1px solid #c4c6cd; border-radius: 0.5rem; overflow: hidden; }
    .stiich-page-topbar { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: #00050e; color: #fff; }
    .stiich-page-topbar__btn { background: none; border: none; color: #fff; cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
    .stiich-page-topbar__btn:hover { background: rgba(255,255,255,0.15); }
    .stiich-page-topbar__title { font-weight: 600; font-size: 0.9375rem; }

    .stiich-page-hero { display: flex; gap: 0.75rem; padding: 1rem; border-bottom: 1px solid rgba(196,198,212,0.3); }
    .stiich-page-hero__avatar { width: 48px; height: 48px; border-radius: 0.5rem; background: #00050e; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stiich-page-hero__info { display: flex; flex-direction: column; gap: 2px; }
    .stiich-page-hero__name { font-weight: 700; font-size: 1rem; color: #1b1c1d; }
    .stiich-page-hero__meta { font-size: 0.75rem; color: #64748b; }
    .stiich-page-hero__status { display: flex; gap: 0.375rem; margin-top: 2px; }

    .stiich-chip { font-size: 0.6rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.04em; display: inline-block; }
    .stiich-chip--success { background: #f0fdf4; color: #006837; }
    .stiich-chip--info { background: #eff6ff; color: #1e40af; }

    .stiich-segment { display: flex; gap: 0; padding: 0.5rem; background: #efedef; }
    .stiich-segment__tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.375rem; padding: 0.5rem; border: none; background: transparent; cursor: pointer; font-size: 0.75rem; font-weight: 600; color: #64748b; border-radius: 0.375rem; transition: all 150ms; font-family: inherit; }
    .stiich-segment__tab:hover { color: #00296d; }
    .stiich-segment__tab--active { background: #fff; color: #00296d; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .stiich-segment__icon { font-size: 1rem; }

    .stiich-page-content { padding: 0.5rem; min-height: 120px; }
    .stiich-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .stiich-info-item { display: flex; flex-direction: column; gap: 2px; padding: 0.5rem; border: 1px solid rgba(196,198,212,0.3); border-radius: 0.375rem; }
    .stiich-info-item span:first-child { font-size: 0.65rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .stiich-info-item span:last-child { font-size: 0.8125rem; color: #1b1c1d; font-weight: 500; }

    .stiich-timeline { display: flex; flex-direction: column; gap: 0; padding: 0.5rem; }
    .stiich-timeline__item { display: flex; gap: 0.75rem; padding: 0.5rem 0; position: relative; }
    .stiich-timeline__dot { width: 8px; height: 8px; border-radius: 50%; background: #00050e; margin-top: 6px; flex-shrink: 0; }
    .stiich-timeline__dot--warn { background: #f59e0b; }

    .stiich-doc-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px solid rgba(196,198,212,0.3); border-radius: 0.375rem; }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobilePageStructure {
  basicOpen = signal(false);
  subheaderOpen = signal(false);
  footerOpen = signal(false);

  readonly items = [1, 2, 3, 4, 5, 6, 7, 8];

  // --- Segmented Page pattern ---
  activeSegment = signal('info');
  readonly tabs = [
    { key: 'info', label: 'Info', icon: 'info' },
    { key: 'history', label: 'Historial', icon: 'history' },
    { key: 'docs', label: 'Documentos', icon: 'description' },
  ];

  constructor() {
    addIcons({ closeOutline, documentTextOutline, layersOutline, phonePortraitOutline });
  }
}

