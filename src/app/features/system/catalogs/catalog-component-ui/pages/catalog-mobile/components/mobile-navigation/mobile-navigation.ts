import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  MenuController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  addOutline,
  barChartOutline,
  createOutline,
  homeOutline,
  menuOutline,
  settingsOutline,
  shareOutline,
  trashOutline,
} from "ionicons/icons";
import { MOBILE_SHOWCASE_STYLES } from "../../../../shared/mobile-showcase-styles";

@Component({
  selector: "app-mobile-navigation",
  standalone: true,
  imports: [
    CommonModule,
    IonBackButton, IonButton, IonButtons, IonContent,
    IonFab, IonFabButton, IonFabList,
    IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton,
    IonSegment, IonSegmentButton,
    IonTabBar, IonTabButton, IonTabs,
    IonTitle, IonToolbar,
  ],
  template: `
    <!-- ion-menu: se declara en el template, Ionic lo eleva al overlay system -->
    <ion-menu menuId="cat-nav-menu" contentId="cat-nav-content" type="overlay">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Navegación</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list lines="none" class="ion-padding-top">
          <ion-item button (click)="closeMenu()">
            <ion-icon name="home-outline" slot="start"></ion-icon>
            <ion-label>Inicio</ion-label>
          </ion-item>
          <ion-item button (click)="closeMenu()">
            <ion-icon name="bar-chart-outline" slot="start"></ion-icon>
            <ion-label>Reportes</ion-label>
          </ion-item>
          <ion-item button (click)="closeMenu()">
            <ion-icon name="settings-outline" slot="start"></ion-icon>
            <ion-label>Configuración</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>

    <div id="cat-nav-content" class="mobile-card">
      <div class="mobile-card-header">Navigation Patterns</div>
      <div class="mobile-card-body flex flex-column gap-5">

        <!-- ─── HEADER VARIANTS (DS) ─── -->
        <div>
          <div class="section-label">Header Variants (DS)</div>
          <p class="section-desc">Header small (close + title + more) y header medium (search + title).</p>
          <div class="flex flex-column gap-2">
            <div class="ds-header ds-header--small">
              <span class="material-symbols-outlined ds-header__icon">arrow_back</span>
              <span class="ds-header__title">Page Title</span>
              <span class="material-symbols-outlined ds-header__icon">more_vert</span>
            </div>
            <div class="ds-header ds-header--medium">
              <div class="ds-header__top-row">
                <span class="material-symbols-outlined ds-header__icon">close</span>
                <span class="material-symbols-outlined ds-header__icon">search</span>
              </div>
              <span class="ds-header__title ds-header__title--lg">Catalog Library</span>
            </div>
          </div>
        </div>

        <!-- ─── TAB BAR ─── -->
        <div>
          <div class="section-label">Tab Bar (DS)</div>
          <p class="section-desc">Pestañas simples con línea de acento en la activa.</p>
          <div class="ds-tab-bar">
            <button class="ds-tab ds-tab--active">Overview</button>
            <button class="ds-tab">Properties</button>
            <button class="ds-tab">Usage</button>
          </div>
        </div>

        <!-- ─── SEGMENTED CONTROL ─── -->
        <div>
          <div class="section-label">Segmented Control (DS)</div>
          <p class="section-desc">Control segmentado tipo iOS.</p>
          <div class="ds-segmented">
            <button class="ds-segmented__btn ds-segmented__btn--active">Day</button>
            <button class="ds-segmented__btn">Week</button>
            <button class="ds-segmented__btn">Month</button>
          </div>
        </div>

        <!-- Segment -->
        <div>
          <div class="section-label">Segment Control (ion-segment)</div>
          <p class="section-desc">Filtro por categoría. Reemplaza los tabs en vistas de lista.</p>
          <ion-segment
            [value]="selectedSegment()"
            (ionChange)="selectedSegment.set($any($event).detail.value)"
            style="border:1px solid var(--ds-border,#e2e8f0);border-radius:8px;overflow:hidden;">
            <ion-segment-button value="all"><ion-label>Todos</ion-label></ion-segment-button>
            <ion-segment-button value="active"><ion-label>Activos</ion-label></ion-segment-button>
            <ion-segment-button value="closed"><ion-label>Cerrados</ion-label></ion-segment-button>
          </ion-segment>
          <p class="text-xs text-secondary mt-1">Seleccionado: <strong>{{ selectedSegment() }}</strong></p>
        </div>

        <!-- Tab Bar -->
        <div>
          <div class="section-label">Tab Bar (ion-tab-bar)</div>
          <p class="section-desc">Navegación principal inferior. Máximo 5 tabs. Ícono + label obligatorios.</p>
          <ion-tabs style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-tab-bar slot="bottom">
              <ion-tab-button tab="home">
                <ion-icon name="home-outline" />
                <ion-label>Inicio</ion-label>
              </ion-tab-button>
              <ion-tab-button tab="search">
                <ion-icon name="bar-chart-outline" />
                <ion-label>Reportes</ion-label>
              </ion-tab-button>
              <ion-tab-button tab="notifications">
                <ion-icon name="settings-outline" />
                <ion-label>Config.</ion-label>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-tabs>
        </div>

        <!-- Header con Back Button -->
        <div>
          <div class="section-label">Header con Back Button</div>
          <p class="section-desc">Toolbar estándar de vista de detalle.</p>
          <ion-header style="position:relative;border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button default-href="/" text="Atrás"></ion-back-button>
              </ion-buttons>
              <ion-title>Detalle</ion-title>
              <ion-buttons slot="end">
                <ion-menu-button menuId="cat-nav-menu"></ion-menu-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
        </div>

        <!-- ion-menu -->
        <div>
          <div class="section-label">Menú lateral (ion-menu)</div>
          <p class="section-desc">
            Se abre desde <code>ion-menu-button</code> o <code>MenuController.open()</code>.
            Soporta tipos <code>overlay</code>, <code>reveal</code> y <code>push</code>.
          </p>
          <ion-button size="small" color="secondary" (click)="openMenu()">
            <ion-icon name="menu-outline" slot="start"></ion-icon>
            Abrir menú lateral
          </ion-button>
          <p class="text-xs text-secondary mt-1">
            El ≡ del header de arriba también abre este mismo menú.
          </p>
        </div>

        <!-- FAB simple + FAB con lista -->
        <div>
          <div class="section-label">FAB (ion-fab + ion-fab-list)</div>
          <p class="section-desc">
            FAB simple para acción primaria. FAB con lista (<code>ion-fab-list</code>) para 2-4 acciones secundarias.
          </p>
          <div class="fab-demos">

            <!-- FAB simple -->
            <div class="fab-demo-box">
              <span class="fab-demo-label">Simple</span>
              <div class="fab-demo-area">
                <ion-fab style="position:absolute;bottom:10px;right:10px;">
                  <ion-fab-button color="primary">
                    <ion-icon name="add-outline"></ion-icon>
                  </ion-fab-button>
                </ion-fab>
              </div>
            </div>

            <!-- FAB con lista -->
            <div class="fab-demo-box">
              <span class="fab-demo-label">Con lista — toca el FAB</span>
              <div class="fab-demo-area">
                <ion-fab vertical="bottom" horizontal="end" style="position:absolute;bottom:10px;right:10px;">
                  <ion-fab-button color="primary">
                    <ion-icon name="add-outline"></ion-icon>
                  </ion-fab-button>
                  <ion-fab-list side="top">
                    <ion-fab-button color="success" (click)="onFabAction('crear')">
                      <ion-icon name="add-outline"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button color="primary" (click)="onFabAction('editar')">
                      <ion-icon name="create-outline"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button color="tertiary" (click)="onFabAction('compartir')">
                      <ion-icon name="share-outline"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button color="danger" (click)="onFabAction('eliminar')">
                      <ion-icon name="trash-outline"></ion-icon>
                    </ion-fab-button>
                  </ion-fab-list>
                </ion-fab>
              </div>
            </div>

          </div>
          @if (lastFabAction()) {
            <p class="text-xs text-secondary mt-1">Acción: <strong>{{ lastFabAction() }}</strong></p>
          }
        </div>

      </div>
    </div>
  `,
  styles: [MOBILE_SHOWCASE_STYLES, `
    .ds-header { border:1px solid var(--ds-border); border-radius:10px; overflow:hidden; }
    .ds-header--small { display:flex; align-items:center; padding:0.65rem 0.85rem; background:var(--ds-bg-surface); gap:0.5rem; }
    .ds-header--medium { display:flex; flex-direction:column; gap:0.25rem; padding:0.65rem 0.85rem; background:var(--ds-bg-surface); }
    .ds-header__top-row { display:flex; justify-content:space-between; }
    .ds-header__icon { font-size:1.35rem; color:var(--ds-text-secondary); cursor:pointer; }
    .ds-header__title { font-size:1rem; font-weight:600; color:var(--ds-text-primary); flex:1; }
    .ds-header__title--lg { font-size:1.35rem; font-weight:700; color:var(--ds-text-primary); }

    .ds-tab-bar { display:flex; border:1px solid var(--ds-border); border-radius:10px; overflow:hidden; background:var(--ds-bg-surface); }
    .ds-tab { flex:1; padding:0.65rem 0; text-align:center; border:none; background:transparent; font-size:0.82rem; font-weight:500; color:var(--ds-text-secondary); cursor:pointer; border-bottom:2px solid transparent; transition:all 150ms; font-family:inherit; }
    .ds-tab--active { color:var(--ds-primary); border-bottom-color:var(--ds-primary); font-weight:600; }

    .ds-segmented { display:flex; padding:4px; background:var(--ds-bg-elevated); border-radius:8px; max-width:320px; }
    .ds-segmented__btn { flex:1; padding:0.4rem 0.75rem; border:none; border-radius:6px; background:transparent; font-size:0.82rem; font-weight:500; color:var(--ds-text-secondary); cursor:pointer; transition:all 150ms; font-family:inherit; }
    .ds-segmented__btn--active { background:var(--ds-bg-surface); color:var(--ds-primary); font-weight:600; box-shadow:0 1px 3px color-mix(in srgb, var(--ds-text-primary) 10%, transparent); }

    .fab-demos { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .fab-demo-box { display: flex; flex-direction: column; gap: 0.25rem; }
    .fab-demo-label { font-size: 0.7rem; color: var(--ds-text-muted); }
    .fab-demo-area { position: relative; height: 100px; background: var(--ds-bg-elevated); border-radius: 8px; border: 1px dashed var(--ds-border); }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileNavigation {
  private menuCtrl = inject(MenuController);

  selectedSegment = signal<string>('all');
  lastFabAction = signal<string>('');

  async openMenu(): Promise<void> {
    await this.menuCtrl.open('cat-nav-menu');
  }

  async closeMenu(): Promise<void> {
    await this.menuCtrl.close('cat-nav-menu');
  }

  onFabAction(action: string): void {
    this.lastFabAction.set(action);
  }

  constructor() {
    addIcons({ addOutline, barChartOutline, createOutline, homeOutline, menuOutline, settingsOutline, shareOutline, trashOutline });
  }
}
