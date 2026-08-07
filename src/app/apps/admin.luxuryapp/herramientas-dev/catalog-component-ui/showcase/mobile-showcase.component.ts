import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import {
  BottomNavItem,
  MobileBottomNav,
} from "@ui/mobile/bottom-nav/bottom-nav";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { MobilePullToRefresh } from "@ui/mobile/pull-to-refresh/pull-to-refresh";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-mobile-showcase",
  imports: [MobileListItem, AppIcon, MobileBottomNav, MobilePullToRefresh],
  template: `
    <div class="p-4 fadein">
      <h2 class="text-2xl font-bold mb-4">Mobile Specific UI</h2>
      <p class="text-secondary mb-6">
        Componentes de interfaz optimizados para mobile (iOS / Android). La
        arquitectura utiliza adaptadores internos ("ili-") para mantener el Core
        agnóstico.
      </p>

      <section class="mb-8">
        <h3 class="section-header">Pull to Refresh</h3>
        <div
          class="card p-0 overflow-hidden relative"
          style="max-width: 400px; height: 150px; border-radius: 8px; border: 1px solid var(--surface-border);"
        >
          <ili-pull-to-refresh (refresh)="onRefresh()">
            <div class="p-4 text-center text-secondary">
              Desliza hacia abajo para actualizar...
            </div>
          </ili-pull-to-refresh>
        </div>
      </section>

      <section class="mb-8">
        <h3 class="section-header">List Items (Mobile)</h3>
        <div
          class="card p-0 overflow-hidden"
          style="max-width: 400px; border-radius: 8px;"
        >
          <ili-list-item>
            <app-icon icon="mdi:account" start />
            <div>
              <div class="font-bold">Perfil del Usuario</div>
              <div class="text-sm text-secondary">Ajustes de cuenta</div>
            </div>
          </ili-list-item>
          <ili-list-item>
            <app-icon icon="mdi:bell" start />
            <div>
              <div class="font-bold">Notificaciones</div>
              <div class="text-sm text-secondary">Control de alertas</div>
            </div>
          </ili-list-item>
          <ili-list-item [divider]="false">
            <app-icon icon="mdi:shield" start />
            <div>
              <div class="font-bold">Seguridad</div>
              <div class="text-sm text-secondary">Contraseñas y biometría</div>
            </div>
          </ili-list-item>
        </div>
      </section>

      <section class="mb-8">
        <h3 class="section-header">Bottom Navigation (App Tab Bar)</h3>
        <div
          class="border-round overflow-hidden"
          style="max-width: 400px; height: 120px; position: relative; background: var(--surface-card); border: 1px solid var(--surface-border);"
        >
          <div class="p-4 text-center text-secondary">
            Contenido de la aplicación...
          </div>
          <div style="position: absolute; bottom: 0; width: 100%;">
            <ili-bottom-nav
              [items]="navItems"
              [activeId]="activeNavId()"
              (activeIdChange)="activeNavId.set($event)"
            />
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileShowcaseComponent {
  activeNavId = signal("home");
  navItems: BottomNavItem[] = [
    {
      id: "home",
      icon: "mdi:home-outline",
      activeIcon: "mdi:home",
      label: "Inicio",
    },
    { id: "search", icon: "mdi:magnify", label: "Buscar" },
    {
      id: "notifications",
      icon: "mdi:bell-outline",
      activeIcon: "mdi:bell",
      label: "Alertas",
      badge: 3,
    },
    {
      id: "profile",
      icon: "mdi:account-outline",
      activeIcon: "mdi:account",
      label: "Perfil",
    },
  ];

  onRefresh() {
    // mock refresh handler
  }
}
