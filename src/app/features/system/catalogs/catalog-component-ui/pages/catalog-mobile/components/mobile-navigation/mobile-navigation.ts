import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { IonBackButton, IonButtons, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonMenuButton, IonSegment, IonSegmentButton, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-navigation",
  standalone: true,
  imports: [CommonModule, IonBackButton, IonButtons, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonMenuButton, IonSegment, IonSegmentButton, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Navigation Patterns</div>
      <div class="mobile-card-body flex flex-column gap-4">

        <div>
          <div class="font-bold text-sm mb-2">Segment Control (ion-segment)</div>
          <ion-segment [value]="selectedSegment()" (ionChange)="selectedSegment.set($any($event).detail.value)" style="border:1px solid var(--ds-border,#e2e8f0);border-radius:8px;overflow:hidden;">
            <ion-segment-button value="all">
              <ion-label>Todos</ion-label>
            </ion-segment-button>
            <ion-segment-button value="active">
              <ion-label>Activos</ion-label>
            </ion-segment-button>
            <ion-segment-button value="closed">
              <ion-label>Cerrados</ion-label>
            </ion-segment-button>
          </ion-segment>
          <p class="text-xs text-secondary mt-1">Seleccionado: <strong>{{ selectedSegment() }}</strong></p>
        </div>
        <div>
          <div class="font-bold text-sm mb-2">Tab Bar</div>
          <ion-tabs style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-tab-bar slot="bottom">
              <ion-tab-button tab="home">
                <ion-icon name="home-outline" />
                <ion-label>Inicio</ion-label>
              </ion-tab-button>
              <ion-tab-button tab="search">
                <ion-icon name="search-outline" />
                <ion-label>Buscar</ion-label>
              </ion-tab-button>
              <ion-tab-button tab="notifications">
                <ion-icon name="notifications-outline" />
                <ion-label>Alertas</ion-label>
              </ion-tab-button>
              <ion-tab-button tab="profile">
                <ion-icon name="person-outline" />
                <ion-label>Perfil</ion-label>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-tabs>
        </div>

        <div>
          <div class="font-bold text-sm mb-2">Header con Back Button</div>
          <ion-header style="position:relative;border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button default-href="/" text="Atrás"></ion-back-button>
              </ion-buttons>
              <ion-title>Detalle</ion-title>
              <ion-buttons slot="end">
                <ion-menu-button></ion-menu-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
        </div>

        <div>
          <div class="font-bold text-sm mb-2">FAB (Floating Action Button)</div>
          <div style="position:relative;height:80px;background:var(--ds-bg-elevated,#f4f5f8);border-radius:var(--ds-radius-lg,8px);padding:0.75rem;">
            <p style="margin:0;font-size:var(--ds-font-size-table,0.875rem);color:var(--ds-text-muted);">
              El Floating Action Button (FAB) se sitúa en la esquina inferior derecha.
            </p>
            <ion-fab vertical="bottom" horizontal="end" style="position: absolute; bottom: 10px; right: 10px;">
              <ion-fab-button size="small">
                <ion-icon name="add-outline"></ion-icon>
              </ion-fab-button>
            </ion-fab>
          </div>
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
export class MobileNavigation {
  selectedSegment = signal<string>('all');
}
