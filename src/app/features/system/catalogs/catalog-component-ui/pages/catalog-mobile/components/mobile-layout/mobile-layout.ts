import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonButtons,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  barChartOutline,
  homeOutline,
  menuOutline,
  settingsOutline,
} from "ionicons/icons";

@Component({
  selector: "app-mobile-layout",
  standalone: true,
  imports: [
    CommonModule,
    IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel,
    IonList, IonMenu, IonMenuButton, IonSplitPane, IonTitle, IonToolbar,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Layout adaptativo (ion-split-pane)</div>
      <div class="mobile-card-body flex flex-column gap-5">

        <!-- Anatomía visual -->
        <div>
          <div class="section-label">Comportamiento por pantalla</div>
          <p class="section-desc">
            <code>ion-split-pane</code> muestra el menú lateral integrado en pantallas ≥768px
            y lo oculta en mobile (se abre con <code>ion-menu-button</code>).
          </p>
          <div class="anatomy-grid">

            <!-- Mobile -->
            <div>
              <div class="anatomy-device-label">📱 Mobile (&lt;768px)</div>
              <div class="anatomy-device anatomy-mobile">
                <div class="anatomy-toolbar">
                  <span class="anatomy-hamburger">≡</span>
                  <span>Página</span>
                </div>
                <div class="anatomy-body">
                  <div class="anatomy-content-only">
                    <span class="anatomy-tag">ion-content</span>
                    <p class="anatomy-note">El menú se oculta.<br>Deslizar o ≡ para abrir.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tablet / Desktop -->
            <div>
              <div class="anatomy-device-label">🖥️ Tablet / Desktop (≥768px)</div>
              <div class="anatomy-device anatomy-tablet">
                <div class="anatomy-toolbar">
                  <span>Página</span>
                </div>
                <div class="anatomy-body">
                  <div class="anatomy-sidebar">
                    <span class="anatomy-tag">ion-menu</span>
                    <div class="anatomy-menu-items">
                      <div class="anatomy-menu-item">🏠 Inicio</div>
                      <div class="anatomy-menu-item active-item">📊 Reportes</div>
                      <div class="anatomy-menu-item">⚙️ Config.</div>
                    </div>
                  </div>
                  <div class="anatomy-content-area">
                    <span class="anatomy-tag">ion-content</span>
                    <p class="anatomy-note">Contenido principal siempre visible.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Variantes del split-pane -->
        <div>
          <div class="section-label">Configuración</div>
          <div class="config-table">
            <div class="config-row">
              <code>when="md"</code>
              <span>≥768px — tablet y desktop (por defecto)</span>
            </div>
            <div class="config-row">
              <code>when="lg"</code>
              <span>≥992px — solo desktop</span>
            </div>
            <div class="config-row">
              <code>when="xs"</code>
              <span>Siempre visible — no colapsa en mobile</span>
            </div>
            <div class="config-row">
              <code>when="false"</code>
              <span>Desactivado — siempre como drawer</span>
            </div>
          </div>
        </div>

        <!-- Patrón de código -->
        <div>
          <div class="section-label">Estructura en código</div>
          <p class="section-desc">El <code>contentId</code> enlaza el split-pane con su contenido principal.</p>
          <pre class="code-block">&#x3C;ion-split-pane contentId="main"&#x3E;
  &#x3C;ion-menu contentId="main"&#x3E;
    &#x3C;ion-content&#x3E;&#x3C;!-- nav items --&#x3E;&#x3C;/ion-content&#x3E;
  &#x3C;/ion-menu&#x3E;
  &#x3C;div id="main"&#x3E;
    &#x3C;ion-header&#x3E;&#x3C;/ion-header&#x3E;
    &#x3C;ion-content&#x3E;&#x3C;/ion-content&#x3E;
  &#x3C;/div&#x3E;
&#x3C;/ion-split-pane&#x3E;</pre>
        </div>

        <!-- Toggle de simulación -->
        <div>
          <div class="section-label">Simulación</div>
          <p class="section-desc">Alterna entre vista mobile y tablet para ver cómo cambia el layout.</p>
          <div class="toggle-row">
            <button class="sim-btn" [class.active]="!tabletMode()" (click)="tabletMode.set(false)">📱 Mobile</button>
            <button class="sim-btn" [class.active]="tabletMode()" (click)="tabletMode.set(true)">🖥️ Tablet</button>
          </div>
          <div class="sim-frame" [class.sim-tablet]="tabletMode()">
            @if (tabletMode()) {
              <div class="sim-sidebar">
                <div class="sim-nav-item">🏠 Inicio</div>
                <div class="sim-nav-item sim-active">📊 Reportes</div>
                <div class="sim-nav-item">⚙️ Config.</div>
              </div>
            }
            <div class="sim-content">
              @if (!tabletMode()) {
                <div class="sim-toolbar">
                  <span class="sim-hamburger">≡</span>
                  <span>Mi App</span>
                </div>
              }
              <div class="sim-body">
                <p class="text-sm text-secondary">Contenido principal</p>
                @if (tabletMode()) {
                  <p class="text-xs" style="color:var(--ds-success,#006837)">✅ Split pane activo — menú siempre visible</p>
                } @else {
                  <p class="text-xs" style="color:var(--ds-text-muted,#94a3b8)">Menú colapsado — toca ≡ para abrir</p>
                }
              </div>
            </div>
          </div>
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

    /* Anatomy */
    .anatomy-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 1rem; }
    .anatomy-device-label { font-size: 0.7rem; color: var(--ds-text-muted); margin-bottom: 4px; }
    .anatomy-device { border: 1px solid var(--ds-border,#e2e8f0); border-radius: 8px; overflow: hidden; font-size: 0.7rem; }
    .anatomy-toolbar { background: var(--ion-color-primary,#003d9b); color: #fff; padding: 6px 8px; display: flex; align-items: center; gap: 6px; font-weight: 600; }
    .anatomy-hamburger { font-size: 1rem; }
    .anatomy-body { display: flex; }
    .anatomy-content-only { flex: 1; padding: 8px; background: #fff; display: flex; flex-direction: column; gap: 4px; min-height: 70px; }
    .anatomy-sidebar { width: 90px; background: var(--ds-bg-elevated,#f4f5f8); padding: 6px; border-right: 1px solid var(--ds-border,#e2e8f0); display: flex; flex-direction: column; gap: 4px; }
    .anatomy-content-area { flex: 1; padding: 8px; background: #fff; display: flex; flex-direction: column; gap: 4px; }
    .anatomy-tag { font-family: monospace; font-size: 0.65rem; color: var(--ds-primary,#003d9b); font-weight: 700; }
    .anatomy-note { color: var(--ds-text-muted); margin: 0; line-height: 1.3; }
    .anatomy-menu-items { display: flex; flex-direction: column; gap: 2px; margin-top: 4px; }
    .anatomy-menu-item { padding: 3px 4px; border-radius: 4px; font-size: 0.65rem; }
    .active-item { background: var(--ds-primary-50,#edf1ff); color: var(--ds-primary,#003d9b); font-weight: 700; }

    /* Config table */
    .config-table { display: flex; flex-direction: column; gap: 4px; }
    .config-row { display: flex; align-items: baseline; gap: 8px; font-size: 0.75rem; padding: 4px 0; border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .config-row code { font-size: 0.7rem; background: var(--ds-bg-sunken,#e8edff); padding: 1px 5px; border-radius: 4px; flex-shrink: 0; }
    .config-row span { color: var(--ds-text-secondary); }

    /* Code block */
    .code-block { background: var(--ds-bg-sunken,#e8edff); border-radius: 8px; padding: 0.75rem; font-size: 0.7rem; font-family: monospace; line-height: 1.6; margin: 0; overflow-x: auto; color: var(--ds-text-primary); }

    /* Simulator */
    .toggle-row { display: flex; gap: 8px; margin-bottom: 0.75rem; }
    .sim-btn { padding: 6px 14px; border-radius: 8px; border: 1px solid var(--ds-border,#e2e8f0); background: var(--ds-bg-surface,#fff); font-size: 0.75rem; cursor: pointer; transition: all 150ms; color: var(--ds-text-secondary); }
    .sim-btn.active { background: var(--ds-primary,#003d9b); color: #fff; border-color: var(--ds-primary); }
    .sim-frame { border: 1px solid var(--ds-border,#e2e8f0); border-radius: 8px; overflow: hidden; display: flex; min-height: 100px; transition: all 200ms; }
    .sim-tablet .sim-sidebar { display: flex; }
    .sim-sidebar { display: none; width: 110px; background: var(--ds-bg-elevated,#f4f5f8); border-right: 1px solid var(--ds-border,#e2e8f0); padding: 8px; flex-direction: column; gap: 4px; }
    .sim-nav-item { padding: 6px 8px; border-radius: 6px; font-size: 0.7rem; color: var(--ds-text-secondary); }
    .sim-active { background: var(--ds-primary-50,#edf1ff); color: var(--ds-primary,#003d9b); font-weight: 700; }
    .sim-content { flex: 1; display: flex; flex-direction: column; }
    .sim-toolbar { background: var(--ion-color-primary,#003d9b); color: #fff; padding: 6px 10px; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600; }
    .sim-hamburger { font-size: 1rem; }
    .sim-body { padding: 12px; flex: 1; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileLayout {
  tabletMode = signal(false);

  constructor() {
    addIcons({ barChartOutline, homeOutline, menuOutline, settingsOutline });
  }
}
