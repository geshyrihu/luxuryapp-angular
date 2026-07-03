import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { AvatarModule } from "primeng/avatar";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ChipModule } from "primeng/chip";
import { DividerModule } from "primeng/divider";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { CustomButtonDelete } from "src/app/core/components/buttons/legacy/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/legacy/buttons/custom-button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { ActionIconsGroupComponent } from "src/app/core/components/shared/action-icons-group/action-icons-group.component";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import {
  EStatus,
  StatusBadge,
} from "src/app/core/components/shared/status-badge/status-badge";

@Component({
  selector: "app-web-badges",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    BadgeModule,
    ButtonModule,
    DividerModule,
    ChipModule,
    AvatarModule,
    OverlayBadgeModule,
    TooltipModule,
    StatusBadge,
    ActionMenu,
    ActionIconsGroupComponent,
    AppIcon,
    CustomButtonEdit,
    CustomButtonDelete,
  ],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card header="Tags - p-tag">
          <div class="flex flex-column gap-4">
            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Severities esténdar
              </span>
              <div class="flex flex-wrap gap-2">
                <p-tag value="Success" severity="success" />
                <p-tag value="Info" severity="info" />
                <p-tag value="Warning" severity="warn" />
                <p-tag value="Danger" severity="danger" />
                <p-tag value="Secondary" severity="secondary" />
                <p-tag value="Contrast" severity="contrast" />
              </div>
            </div>

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Rounded
              </span>
              <div class="flex flex-wrap gap-2">
                <p-tag value="Success" severity="success" [rounded]="true" />
                <p-tag value="Info" severity="info" [rounded]="true" />
                <p-tag value="Warning" severity="warn" [rounded]="true" />
                <p-tag value="Danger" severity="danger" [rounded]="true" />
                <p-tag
                  value="Secondary"
                  severity="secondary"
                  [rounded]="true"
                />
              </div>
            </div>

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Con icono
              </span>
              <div class="flex flex-wrap gap-2">
                <p-tag
                  value="Guardado"
                  severity="success"
                  icon="mdi:check"
                  [rounded]="true"
                />
                <p-tag
                  value="Sincronizar"
                  severity="info"
                  icon="mdi:sync"
                  [rounded]="true"
                />
                <p-tag
                  value="Pendiente"
                  severity="warn"
                  icon="mdi:clock-outline"
                  [rounded]="true"
                />
                <p-tag
                  value="Bloqueado"
                  severity="danger"
                  icon="mdi:lock"
                  [rounded]="true"
                />
              </div>
            </div>

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Valores de negocio ERP (ejemplos)
              </span>
              <div class="flex flex-wrap gap-2">
                @for (s of erpStates; track s.label) {
                  <p-tag
                    [value]="s.label"
                    [severity]="s.severity"
                    [rounded]="true"
                  />
                }
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="Badges numíricos - p-badge">
          <div class="flex flex-column gap-4">
            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Standalone
              </span>
              <div class="flex flex-wrap gap-3 align-items-center">
                <p-badge value="2" />
                <p-badge value="8" severity="success" />
                <p-badge value="4" severity="warn" />
                <p-badge value="12" severity="danger" />
                <p-badge value="99+" severity="info" />
                <p-badge severity="danger" />
              </div>
            </div>

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Sobre botones
              </span>
              <div class="flex flex-wrap gap-2 align-items-center">
                <p-button
                  label="Bandeja"
                  badge="5"
                  badgeSeverity="danger"
                  icon="mdi:inbox"
                />
                <p-button
                  label="Notif."
                  badge="12"
                  badgeSeverity="warn"
                  icon="mdi:bell"
                  severity="secondary"
                />
                <p-button
                  label="Pendientes"
                  badge="3"
                  badgeSeverity="success"
                  icon="mdi:checkbox-marked"
                  severity="secondary"
                  [outlined]="true"
                />
              </div>
            </div>

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Overlay badge (sobre icono)
              </span>
              <div class="flex flex-wrap gap-4 align-items-center">
                <p-overlay-badge value="3" severity="danger">
                  <app-icon icon="mdi:bell" class="text-3xl text-color" />
                </p-overlay-badge>
                <p-overlay-badge value="12" severity="warn">
                  <app-icon icon="mdi:email" class="text-3xl text-color" />
                </p-overlay-badge>
                <p-overlay-badge severity="danger">
                  <app-icon icon="mdi:account" class="text-3xl text-color" />
                </p-overlay-badge>
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="Chips - p-chip">
          <div class="flex flex-column gap-4">
            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Bósicos
              </span>
              <div class="flex flex-wrap gap-2">
                <p-chip label="Angular" />
                <p-chip label="PrimeNG" />
                <p-chip label="Ionic" />
                <p-chip label="TypeScript" />
              </div>
            </div>

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Con icono
              </span>
              <div class="flex flex-wrap gap-2">
                <p-chip label="Administrador" icon="mdi:account-circle" />
                <p-chip label="Activo" icon="mdi:check-circle" />
                <p-chip label="Mantenimiento" icon="mdi:wrench" />
              </div>
            </div>

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Con avatar
              </span>
              <div class="flex flex-wrap gap-2">
                <p-chip label="Carlos M.">
                  <p-avatar label="CM" size="normal" shape="circle" />
                </p-chip>
                <p-chip label="Ana R.">
                  <p-avatar
                    label="AR"
                    size="normal"
                    shape="circle"
                    style="background: var(--ds-success-light); color: var(--ds-success)"
                  />
                </p-chip>
              </div>
            </div>

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Removibles
              </span>
              <div class="flex flex-wrap gap-2">
                <p-chip label="Finanzas" [removable]="true" />
                <p-chip label="Operaciones" [removable]="true" />
                <p-chip label="Sistemas" [removable]="true" />
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="StatusBadge - Custom (app-status-badge)">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Componente propio que encapsula todos los estados del negocio ERP.
            Usa <code>EStatus</code> - nunca hardcodees el texto del estado.
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            @for (s of estatuses; track s.value) {
              <app-status-badge [status]="s.value" />
            }
          </div>
          <p-divider />
          <div class="flex flex-column gap-1 mt-3">
            @for (s of estatuses; track s.value) {
              <div class="flex align-items-center gap-3">
                <app-status-badge [status]="s.value" />
                <code class="text-xs text-color-secondary"
                  >EStatus.{{ s.name }}</code
                >
              </div>
            }
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card
          header="Acciones Contextuales - app-action-menu / app-action-icons-group"
        >
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Usa <strong>ActionIconsGroup</strong> cuando hay 1-2 acciones
            visibles. Usa <strong>ActionMenu</strong> (popover) cuando hay 3 o
            mís o son poco frecuentes.
          </p>

          <div class="flex flex-column gap-4">
            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                ActionIconsGroup (iconos directos)
              </span>
              <app-action-icons-group>
                <custom-button-edit label="" />
                <custom-button-delete label="" />
              </app-action-icons-group>
            </div>

            <p-divider />

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                ActionMenu (popover)
              </span>
              <app-action-menu [mobileMode]="false">
                <p-button
                  label="Ver Detalle"
                  icon="mdi:magnify"
                  [text]="true"
                />
                <p-button
                  label="Exportar PDF"
                  icon="mdi:file-pdf-box"
                  [text]="true"
                />
                <p-button
                  label="Duplicar"
                  icon="mdi:content-copy"
                  [text]="true"
                  severity="secondary"
                />
                <p-button
                  label="Eliminar"
                  icon="mdi:delete"
                  [text]="true"
                  severity="danger"
                />
              </app-action-menu>
            </div>

            <p-divider />

            <div>
              <span
                class="text-xs font-bold text-color-secondary uppercase mb-2 block"
                style="letter-spacing: 0.06em"
              >
                Regla de decisión
              </span>
              <div class="flex flex-column gap-2 text-sm">
                <div class="flex gap-2">
                  <app-icon
                    icon="mdi:check-circle"
                    style="color: var(--ds-success)"
                    class="flex-shrink-0 mt-1"
                  />
                  <span
                    ><strong>1-2 acciones frecuentes</strong> -> IconsGroup
                    (visibles)</span
                  >
                </div>
                <div class="flex gap-2">
                  <app-icon
                    icon="mdi:check-circle"
                    style="color: var(--ds-success)"
                    class="flex-shrink-0 mt-1"
                  />
                  <span
                    ><strong>3+ acciones</strong> o poco frecuentes ->
                    ActionMenu</span
                  >
                </div>
                <div class="flex gap-2">
                  <app-icon
                    icon="mdi:close-circle"
                    style="color: var(--ds-danger)"
                    class="flex-shrink-0 mt-1"
                  />
                  <span
                    ><strong>Nunca</strong> poner 4+ botones visibles en una
                    fila de tabla.</span
                  >
                </div>
              </div>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebBadges {
  readonly EStatus = EStatus;

  readonly estatuses = [
    { value: EStatus.Pendiente, name: "Pendiente" },
    { value: EStatus.Proceso, name: "Proceso" },
    { value: EStatus.Concluido, name: "Concluido" },
    { value: EStatus.noAutorizado, name: "noAutorizado" },
    { value: EStatus.Cancelado, name: "Cancelado" },
  ];

  readonly erpStates = [
    { label: "Aprobado", severity: "success" as const },
    { label: "Revisión", severity: "warn" as const },
    { label: "Rechazado", severity: "danger" as const },
    { label: "Borrador", severity: "secondary" as const },
    { label: "En proceso", severity: "info" as const },
    { label: "Urgente", severity: "danger" as const },
    { label: "Programado", severity: "secondary" as const },
  ];
}
