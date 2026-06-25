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
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
    .section-label { font-weight: 700; font-size: 0.8125rem; color: var(--ds-text-secondary,#64748b); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.25rem; }
    .section-desc { font-size: 0.75rem; color: var(--ds-text-muted,#94a3b8); margin: 0 0 0.75rem 0; line-height: 1.4; }

    .fab-demos { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .fab-demo-box { display: flex; flex-direction: column; gap: 0.25rem; }
    .fab-demo-label { font-size: 0.7rem; color: var(--ds-text-muted); }
    .fab-demo-area { position: relative; height: 100px; background: var(--ds-bg-elevated,#f4f5f8); border-radius: 8px; border: 1px dashed var(--ds-border,#e2e8f0); }
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
