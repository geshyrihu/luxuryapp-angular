import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import {
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/buttons/legacy/buttons";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { ActionIconsGroupComponent } from "src/app/core/components/shared/action-icons-group/action-icons-group.component";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import {
  EStatus,
  StatusBadge,
} from "src/app/core/components/web/status-badge/status-badge";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";

@Component({
  selector: "app-catalog-patterns",
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    InputTextModule,
    MessageModule,
    TableModule,
    TabsModule,
    ActionMenu,
    ActionIconsGroupComponent,
    AppIcon,
    StatusBadge,
    PrimeNgCustomCaption,
    CustomButtonDelete,
    CustomButtonEdit,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">UX Design Patterns</h2>
        <p class="text-secondary">
          Combinaciones de componentes para flujos de trabajo mas completos.
        </p>
      </div>

      <div class="grid">
        <div class="col-12">
          <p-card header="Complex Card Item & Action Menu">
            <div class="grid">
              @for (item of complexDataExample; track item.id) {
                <div class="col-12 md:col-6">
                  <div
                    class="surface-card shadow-1 border-round-lg overflow-hidden border-left-3 p-3"
                    [class]="'border-' + item.color + '-500'"
                  >
                    <div
                      class="flex justify-content-between align-items-start mb-2"
                    >
                      <div>
                        <h3 class="m-0 font-bold text-lg">{{ item.name }}</h3>
                        <span class="text-xs text-secondary">{{
                          item.folio
                        }}</span>
                      </div>
                      <app-action-menu>
                        <custom-button-edit />
                        <custom-button-delete />
                      </app-action-menu>
                    </div>

                    <div class="flex align-items-center gap-2 mb-3">
                      <app-icon
                        [icon]="item.icon"
                        class="text-xl"
                        [ngStyle]="{ color: 'var(--ds-' + item.color + ')' }"
                      />
                      <span class="text-xl font-bold">{{
                        item.consumption
                      }}</span>
                    </div>

                    <div
                      class="flex justify-content-between align-items-center pt-2 border-top-1 surface-border"
                    >
                      <app-status-badge [status]="item.status" />
                      <p-button
                        label="Ver historial"
                        size="small"
                        [text]="true"
                      />
                    </div>
                  </div>
                </div>
              }
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-8">
          <p-card header="Data Table Hybrid">
            <primeng-custom-caption
              label="Agregar insumo"
              [rolAuth]="true"
              [showSearch]="true"
            />
            <p-table [value]="[{ id: 1, name: 'Pattern Test' }]" class="mt-2">
              <ng-template #header>
                <tr>
                  <th>Acciones</th>
                  <th>Elemento</th>
                  <th>Status</th>
                </tr>
              </ng-template>
              <ng-template #body let-item>
                <tr>
                  <td>
                    <app-action-icons-group>
                      <custom-button-edit [label]="''" />
                      <custom-button-delete [label]="''" />
                    </app-action-icons-group>
                  </td>
                  <td>{{ item.name }}</td>
                  <td><app-status-badge [status]="EStatus.Proceso" /></td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>

        <div class="col-12 lg:col-6">
          <p-card header="Login de referencia">
            <p class="m-0 mb-3 text-sm text-color-secondary">
              Vista de inicio de sesion como referencia de diseno. Demostracion
              no funcional del flujo de autenticacion.
            </p>
            <div
              class="surface-ground border-round p-4 flex flex-column gap-3"
              style="max-width: 400px"
            >
              <div class="text-center mb-2">
                <div
                  class="logo-box border-round-lg bg-primary flex align-items-center justify-content-center mx-auto mb-2"
                  style="width: 48px; height: 48px"
                >
                  <app-icon [icon]="'bolt'" class="text-white text-2xl" />
                </div>
                <h3 class="m-0 text-lg font-bold">LuxuryApp</h3>
                <span class="text-xs text-color-secondary"
                  >Sistema de gestion corporativa</span
                >
              </div>

              <span class="font-medium text-sm">Correo electronico</span>
              <input
                type="email"
                pInputText
                [(ngModel)]="loginForm.email"
                placeholder="admin@luxuryapp.com"
                class="w-full"
              />

              <span class="font-medium text-sm">Password</span>
              <input
                type="password"
                pInputText
                [(ngModel)]="loginForm.password"
                placeholder="********"
                class="w-full"
              />

              <div class="flex align-items-center gap-2">
                <p-checkbox
                  [(ngModel)]="loginForm.remember"
                  [binary]="true"
                  inputId="remember"
                />
                <label for="remember" class="font-normal text-sm"
                  >Recordar sesion</label
                >
              </div>

              <p-button
                label="Iniciar sesion"
                icon="icon.login"
                styleClass="w-full"
                (onClick)="mockLogin()"
              />

              @if (loginMessage()) {
                <p-message
                  [severity]="
                    loginMessage()!.includes('exitoso') ? 'success' : 'warn'
                  "
                  [text]="loginMessage()!"
                />
              }

              <p-divider></p-divider>

              <div class="flex justify-content-between text-sm">
                <a class="cursor-pointer text-primary"
                  >Olvidaste tu password?</a
                >
                <a class="cursor-pointer text-primary">Crear cuenta</a>
              </div>
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-6">
          <p-card header="Navegacion de referencia">
            <p class="m-0 mb-3 text-sm text-color-secondary">
              Patrones de navegacion del admin template: sidebar, tabs y
              breadcrumbs.
            </p>
            <div class="surface-ground border-round p-3 flex flex-column gap-3">
              <span class="font-medium text-sm">Breadcrumbs</span>
              <nav class="flex align-items-center gap-2 text-sm">
                <a class="text-primary cursor-pointer">Inicio</a>
                <app-icon [icon]="'icon.chevron-right'" class="text-xs" />
                <a class="text-primary cursor-pointer">Sistema</a>
                <app-icon [icon]="'icon.chevron-right'" class="text-xs" />
                <span class="text-color-secondary">Catalogo UI</span>
              </nav>

              <p-divider></p-divider>

              <span class="font-medium text-sm">Navegacion por tabs</span>
              <p-tabs value="0">
                <p-tablist>
                  <p-tab value="0">Dashboard</p-tab>
                  <p-tab value="1">Reportes</p-tab>
                  <p-tab value="2">Configuracion</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel value="0"
                    ><p class="m-0 text-sm text-color-secondary">
                      Contenido del panel Dashboard.
                    </p></p-tabpanel
                  >
                  <p-tabpanel value="1"
                    ><p class="m-0 text-sm text-color-secondary">
                      Contenido del panel Reportes.
                    </p></p-tabpanel
                  >
                  <p-tabpanel value="2"
                    ><p class="m-0 text-sm text-color-secondary">
                      Contenido del panel Configuracion.
                    </p></p-tabpanel
                  >
                </p-tabpanels>
              </p-tabs>
            </div>
          </p-card>
        </div>
      </div>
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogPatterns {
  EStatus = EStatus;

  readonly complexDataExample = [
    {
      id: 1,
      name: "Medidor electrico A1",
      folio: "E-1002",
      consumption: "120 kWh",
      status: EStatus.Concluido,
      icon: "icon.flash-outline",
      color: "success",
    },
    {
      id: 2,
      name: "Medidor agua central",
      folio: "W-2005",
      consumption: "45 m3",
      status: EStatus.Proceso,
      icon: "icon.water-outline",
      color: "primary",
    },
  ];

  loginForm = { email: "", password: "", remember: false };
  loginMessage = signal<string | null>(null);

  mockLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.loginMessage.set("Completa ambos campos para continuar.");
      return;
    }

    this.loginMessage.set(
      `Inicio de sesion exitoso (demo). Bienvenido, ${this.loginForm.email}`,
    );
  }
}
