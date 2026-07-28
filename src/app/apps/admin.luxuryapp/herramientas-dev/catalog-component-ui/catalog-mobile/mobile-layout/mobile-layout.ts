import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
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
import { MobileCard } from "@ui/mobile/card/card";
import { IliPanel } from "@ui/mobile/panel/panel";
import { IliFieldset } from "@ui/mobile/fieldset/fieldset";
import { IliDivider } from "@ui/mobile/divider/divider";
import { MobileToolbar } from "@ui/mobile/toolbar/toolbar";
import { MobileSplitButton } from "@ui/mobile/split-button/split-button";
import { MobileDock } from "@ui/mobile/dock/dock";
import { MobilePanelMenu } from "@ui/mobile/panel-menu/panel-menu";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MobileIconField } from "@ui/mobile/iconfield/iconfield";
import { MobileInputGroup } from "@ui/mobile/input-group/input-group";
import { MobileInputIcon } from "@ui/mobile/inputicon/inputicon";
import { MobileFluid } from "@ui/mobile/fluid/fluid";
import { MobileInfiniteScroll } from "@ui/mobile/infinite-scroll/infinite-scroll";
import { MobileInplace } from "@ui/mobile/inplace/inplace";

@Component({
  selector: "app-mobile-layout",

  imports: [
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuButton,
    IonSplitPane,
    IonTitle,
    IonToolbar,
    MobileCard,
    IliPanel,
    IliFieldset,
    IliDivider,
    MobileToolbar,
    MobileSplitButton,
    AppIcon,
    MobileDock,
    MobilePanelMenu,
    MobileIconField,
    MobileInputGroup,
    MobileInputIcon,
    MobileFluid,
    MobileInfiniteScroll,
    MobileInplace,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Layout adaptativo (ion-split-pane)</div>
      <div class="mobile-card-body flex flex-column gap-5">
        <!-- Anatomía visual -->
        <div>
          <div class="section-label">Comportamiento por pantalla</div>
          <p class="section-desc">
            <code>ion-split-pane</code> muestra el mené lateral integrado en
            pantallas =768px y lo oculta en mobile (se abre con
            <code>ion-menu-button</code>).
          </p>
          <div class="anatomy-grid">
            <!-- Mobile -->
            <div>
              <div class="anatomy-device-label">?? Mobile (&lt;768px)</div>
              <div class="anatomy-device anatomy-mobile">
                <div class="anatomy-toolbar">
                  <span class="anatomy-hamburger">=</span>
                  <span>Página</span>
                </div>
                <div class="anatomy-body">
                  <div class="anatomy-content-only">
                    <span class="anatomy-tag">ion-content</span>
                    <p class="anatomy-note">
                      El mené se oculta.<br />Deslizar o = para abrir.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tablet / Desktop -->
            <div>
              <div class="anatomy-device-label">
                ??? Tablet / Desktop (=768px)
              </div>
              <div class="anatomy-device anatomy-tablet">
                <div class="anatomy-toolbar">
                  <span>Página</span>
                </div>
                <div class="anatomy-body">
                  <div class="anatomy-sidebar">
                    <span class="anatomy-tag">ion-menu</span>
                    <div class="anatomy-menu-items">
                      <div class="anatomy-menu-item">?? Inicio</div>
                      <div class="anatomy-menu-item active-item">
                        ?? Reportes
                      </div>
                      <div class="anatomy-menu-item">?? Config.</div>
                    </div>
                  </div>
                  <div class="anatomy-content-area">
                    <span class="anatomy-tag">ion-content</span>
                    <p class="anatomy-note">
                      Contenido principal siempre visible.
                    </p>
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
              <span>=768px é tablet y desktop (por defecto)</span>
            </div>
            <div class="config-row">
              <code>when="lg"</code>
              <span>=992px é solo desktop</span>
            </div>
            <div class="config-row">
              <code>when="xs"</code>
              <span>Siempre visible é no colapsa en mobile</span>
            </div>
            <div class="config-row">
              <code>when="false"</code>
              <span>Desactivado é siempre como drawer</span>
            </div>
          </div>
        </div>

        <!-- Patrón de código -->
        <div>
          <div class="section-label">Estructura en código</div>
          <p class="section-desc">
            El <code>contentId</code> enlaza el split-pane con su contenido
            principal.
          </p>
          <pre class="code-block">
&#x3C;ion-split-pane contentId="main"&#x3E;
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
          <p class="section-desc">
            Alterna entre vista mobile y tablet para ver cómo cambia el layout.
          </p>
          <div class="toggle-row">
            <button
              class="sim-btn"
              [class.active]="!tabletMode()"
              (click)="tabletMode.set(false)"
            >
              ?? Mobile
            </button>
            <button
              class="sim-btn"
              [class.active]="tabletMode()"
              (click)="tabletMode.set(true)"
            >
              ??? Tablet
            </button>
          </div>
          <div class="sim-frame" [class.sim-tablet]="tabletMode()">
            @if (tabletMode()) {
              <div class="sim-sidebar">
                <div class="sim-nav-item">?? Inicio</div>
                <div class="sim-nav-item sim-active">?? Reportes</div>
                <div class="sim-nav-item">?? Config.</div>
              </div>
            }
            <div class="sim-content">
              @if (!tabletMode()) {
                <div class="sim-toolbar">
                  <span class="sim-hamburger">=</span>
                  <span>Mi App</span>
                </div>
              }
              <div class="sim-body">
                <p class="text-sm text-secondary">Contenido principal</p>
                @if (tabletMode()) {
                  <p class="text-xs" style="color:var(--ds-success,#006837)">
                    ? Split pane activo é mené siempre visible
                  </p>
                } @else {
                  <p class="text-xs" style="color:var(--ds-text-muted,#94a3b8)">
                    Mené colapsado é toca = para abrir
                  </p>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- --- PATRóN: Bottom Tab Bar (ui-stiich Corporate Integrity) --- -->
        <div>
          <div class="section-label">Bottom Tab Bar (ui-stiich)</div>
          <p class="section-desc">
            Barra de navegación inferior con óconos Material Symbols. Activo:
            Filled, inactivo: Outline. Inspirado en
            <code>listado_de_contactos_modo_claro</code>.
          </p>
          <div class="stiich-tabbar">
            <button
              class="stiich-tab"
              [class.stiich-tab--active]="activeTab() === 'chats'"
              (click)="activeTab.set('chats')"
            >
              <span
                class="material-symbols-outlined"
                [class.stiich-tab__icon--filled]="activeTab() === 'chats'"
                >chat</span
              >
              <span class="stiich-tab__label">Chats</span>
            </button>
            <button
              class="stiich-tab"
              [class.stiich-tab--active]="activeTab() === 'calls'"
              (click)="activeTab.set('calls')"
            >
              <span
                class="material-symbols-outlined"
                [class.stiich-tab__icon--filled]="activeTab() === 'calls'"
                >call</span
              >
              <span class="stiich-tab__label">Calls</span>
            </button>
            <button
              class="stiich-tab stiich-tab--center"
              [class.stiich-tab--active]="activeTab() === 'contacts'"
              (click)="activeTab.set('contacts')"
            >
              <span
                class="material-symbols-outlined"
                [class.stiich-tab__icon--filled]="activeTab() === 'contacts'"
                style="font-variation-settings:'FILL' 1;"
                >contacts</span
              >
              <span class="stiich-tab__label">Contacts</span>
            </button>
            <button
              class="stiich-tab"
              [class.stiich-tab--active]="activeTab() === 'settings'"
              (click)="activeTab.set('settings')"
            >
              <span
                class="material-symbols-outlined"
                [class.stiich-tab__icon--filled]="activeTab() === 'settings'"
                >settings</span
              >
              <span class="stiich-tab__label">Settings</span>
            </button>
            <button
              class="stiich-tab"
              [class.stiich-tab--active]="activeTab() === 'profile'"
              (click)="activeTab.set('profile')"
            >
              <span
                class="material-symbols-outlined"
                [class.stiich-tab__icon--filled]="activeTab() === 'profile'"
                >person</span
              >
              <span class="stiich-tab__label">Profile</span>
            </button>
          </div>
          @if (activeTab() !== "contacts") {
            <p class="text-xs text-secondary mt-2">
              Tab activo: <strong>{{ activeTab() }}</strong>
            </p>
          }
        </div>
      </div>
    </div>

    <div class="mobile-card mt-4">
      <div class="mobile-card-header">Layout Wrappers (ili-*)</div>
      <div class="mobile-card-body flex flex-column gap-5">
        <div>
          <div class="font-bold text-sm mb-3">ili-card</div>
          <ili-card header="Card Header">
            Card Content
          </ili-card>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-panel</div>
          <ili-panel header="Panel Header">
            Panel Content
          </ili-panel>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-fieldset</div>
          <ili-fieldset legend="Fieldset Legend">
            Fieldset Content
          </ili-fieldset>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-divider</div>
          <ili-divider></ili-divider>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-toolbar</div>
          <ili-toolbar>
            <div class="p-toolbar-group-start">Start</div>
            <div class="p-toolbar-group-end">End</div>
          </ili-toolbar>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-split-button</div>
          <ili-split-button label="Save" [model]="[{label:'Update', icon:'mdi:refresh'}, {label:'Delete', icon:'mdi:close'}]"></ili-split-button>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-dock</div>
          <ili-dock [items]="[{label:'Home', icon:'mdi:home'}, {label:'Search', icon:'mdi:magnify'}, {label:'Profile', icon:'mdi:account'}]" position="bottom"></ili-dock>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-panel-menu</div>
          <ili-panel-menu [model]="[{label:'Dashboard', icon:'mdi:view-dashboard'}, {label:'Reports', icon:'mdi:file-chart'}, {label:'Settings', icon:'mdi:cog'}]"></ili-panel-menu>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-iconfield</div>
          <ili-iconfield iconPosition="left">
            <app-icon icon="mdi:magnify" slot="start"></app-icon>
            <span>Search...</span>
          </ili-iconfield>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-input-group</div>
          <ili-input-group addonBefore="$" addonAfter=".00">
            <span>Amount placeholder</span>
          </ili-input-group>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-inputicon</div>
          <ili-inputicon>
            <app-icon icon="mdi:email" slot="start"></app-icon>
          </ili-inputicon>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-fluid</div>
          <ili-fluid>
            <div class="bg-gray-100 p-3 rounded">Fluid content fills width</div>
          </ili-fluid>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-infinite-scroll</div>
          <ili-infinite-scroll [threshold]="'100px'"></ili-infinite-scroll>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-inplace</div>
          <ili-inplace [closable]="true">
            <span inplaceDisplay>Click to edit</span>
            <div inplaceContent>
              <input type="text" value="Edit me" class="w-full p-2 border rounded" />
            </div>
          </ili-inplace>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../../shared/mobile-showcase-styles.css"],
  styles: [
    `
      /* Anatomy */
      .anatomy-grid {
        display: grid;
        grid-template-columns: 1fr 1.6fr;
        gap: 1rem;
      }
      .anatomy-device-label {
        font-size: 0.7rem;
        color: var(--ds-text-muted);
        margin-bottom: 4px;
      }
      .anatomy-device {
        border: 1px solid var(--ds-border);
        border-radius: 8px;
        overflow: hidden;
        font-size: 0.7rem;
      }
      .anatomy-toolbar {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
        padding: 6px 8px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
      }
      .anatomy-hamburger {
        font-size: 1rem;
      }
      .anatomy-body {
        display: flex;
      }
      .anatomy-content-only {
        flex: 1;
        padding: 8px;
        background: var(--ds-bg-surface);
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-height: 70px;
      }
      .anatomy-sidebar {
        width: 90px;
        background: var(--ds-bg-elevated);
        padding: 6px;
        border-right: 1px solid var(--ds-border);
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .anatomy-content-area {
        flex: 1;
        padding: 8px;
        background: var(--ds-bg-surface);
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .anatomy-tag {
        font-family: monospace;
        font-size: 0.65rem;
        color: var(--ds-primary);
        font-weight: 700;
      }
      .anatomy-note {
        color: var(--ds-text-muted);
        margin: 0;
        line-height: 1.3;
      }
      .anatomy-menu-items {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: 4px;
      }
      .anatomy-menu-item {
        padding: 3px 4px;
        border-radius: 4px;
        font-size: 0.65rem;
      }
      .active-item {
        background: var(--ds-primary-50, #edf1ff);
        color: var(--ds-primary);
        font-weight: 700;
      }

      /* Config table */
      .config-table {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .config-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
        font-size: 0.75rem;
        padding: 4px 0;
        border-bottom: 1px solid var(--ds-border);
      }
      .config-row code {
        font-size: 0.7rem;
        background: var(--ds-bg-sunken, #efedef);
        padding: 1px 5px;
        border-radius: 4px;
        flex-shrink: 0;
      }
      .config-row span {
        color: var(--ds-text-secondary);
      }

      /* Code block */
      .code-block {
        background: var(--ds-bg-sunken, #efedef);
        border-radius: 8px;
        padding: 0.75rem;
        font-size: 0.7rem;
        font-family: monospace;
        line-height: 1.6;
        margin: 0;
        overflow-x: auto;
        color: var(--ds-text-primary);
      }

      /* Simulator */
      .toggle-row {
        display: flex;
        gap: 8px;
        margin-bottom: 0.75rem;
      }
      .sim-btn {
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid var(--ds-border);
        background: var(--ds-bg-surface);
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 150ms;
        color: var(--ds-text-secondary);
      }
      .sim-btn.active {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
        border-color: var(--ds-primary);
      }
      .sim-frame {
        border: 1px solid var(--ds-border);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        min-height: 100px;
        transition: all 200ms;
      }
      .sim-tablet .sim-sidebar {
        display: flex;
      }
      .sim-sidebar {
        display: none;
        width: 110px;
        background: var(--ds-bg-elevated);
        border-right: 1px solid var(--ds-border);
        padding: 8px;
        flex-direction: column;
        gap: 4px;
      }
      .sim-nav-item {
        padding: 6px 8px;
        border-radius: 6px;
        font-size: 0.7rem;
        color: var(--ds-text-secondary);
      }
      .sim-active {
        background: var(--ds-primary-50, #edf1ff);
        color: var(--ds-primary);
        font-weight: 700;
      }
      .sim-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .sim-toolbar {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
        padding: 6px 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      .sim-hamburger {
        font-size: 1rem;
      }
      .sim-body {
        padding: 12px;
        flex: 1;
      }

      /* --- Bottom Tab Bar (Corporate Integrity DS) --- */
      .stiich-tabbar {
        display: flex;
        align-items: center;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border-strong);
        border-radius: 0.75rem;
        overflow: hidden;
        height: 64px;
      }
      .stiich-tab {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        border: none;
        background: transparent;
        cursor: pointer;
        padding: 6px 0;
        transition: all 150ms;
        color: var(--ds-text-secondary);
        font-family: inherit;
      }
      .stiich-tab:hover {
        background: color-mix(in srgb, var(--ds-primary) 4%, transparent);
      }
      .stiich-tab--active {
        color: var(--ds-primary-dark, var(--ds-primary));
      }
      .stiich-tab--center {
        background: var(--ds-bg-sunken);
        margin: 6px;
        border-radius: 0.5rem;
      }
      .stiich-tab__icon--filled {
        font-variation-settings: "FILL" 1;
        color: var(--ds-primary-dark, var(--ds-primary));
      }
      .stiich-tab__label {
        font-size: 0.6rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .material-symbols-outlined {
        font-variation-settings:
          "FILL" 0,
          "wght" 400,
          "GRAD" 0,
          "opsz" 24;
        vertical-align: middle;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileLayout {
  tabletMode = signal(false);
  activeTab = signal("contacts");

  constructor() {
    addIcons({ barChartOutline, homeOutline, menuOutline, settingsOutline });
  }
}
