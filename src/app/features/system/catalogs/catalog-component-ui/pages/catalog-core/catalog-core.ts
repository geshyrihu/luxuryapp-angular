import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { CustomButtonDelete, CustomButtonEdit } from "src/app/core/components/web/buttons";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { ConfirmDialog } from "src/app/core/components/shared/confirm-dialog/confirm-dialog";
import { DateRange } from "src/app/core/components/shared/date-range/date-range";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { FileUpload } from "src/app/core/components/shared/file-upload/file-upload";
import { Loader } from "src/app/core/components/shared/loader/loader";
import { NotificationCenter } from "src/app/core/components/shared/notification-center/notification-center";
import { NotificationItem } from "src/app/core/components/shared/notification-center/notification-center";
import { EStatus, StatusBadge } from "src/app/core/components/shared/status-badge/status-badge";
import { Wizard, WizardStep } from "src/app/core/components/shared/wizard/wizard";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { CommonCoreCoverage } from "../../shared/common-core-coverage";

@Component({
  selector: "app-catalog-core",
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    DividerModule,
    TagModule,
    TooltipModule,
    ActionMenu,
    AppIcon,
    Loader,
    PrimeNgCustomCaption,
    StatusBadge,
    CustomButtonDelete,
    CustomButtonEdit,
    CommonCoreCoverage,
    EmptyState,
    DateRange,
    NotificationCenter,
    ConfirmDialog,
    FileUpload,
    Wizard,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">Core Components</h2>
        <p class="text-secondary">
          Elementos transversales de arquitectura y UX base de
          <code>src/app/core/components</code>.
        </p>
      </div>

      <div class="grid">
        <div class="col-12 lg:col-6">
          <p-card header="Navegacion y UX base">
            <div class="flex flex-column gap-4">
              <div class="surface-ground p-3 border-round flex flex-column gap-3">
                <h4 class="mt-0 mb-2 text-color-secondary">Status Badge</h4>
                <div class="flex gap-2 flex-wrap">
                  <app-status-badge [status]="EStatus.Concluido" />
                  <app-status-badge [status]="EStatus.Pendiente" />
                  <app-status-badge [status]="EStatus.Proceso" />
                  <app-status-badge [status]="EStatus.Cancelado" />
                  <app-status-badge [status]="EStatus.noAutorizado" />
                </div>
              </div>

              <div class="surface-ground p-3 border-round flex flex-column gap-3">
                <h4 class="mt-0 mb-2 text-color-secondary">App Icon (SVG/MDI)</h4>
                <div class="flex gap-3 text-2xl text-primary">
                  <app-icon icon="mdi:account" />
                  <app-icon icon="mdi:cog" />
                  <app-icon icon="mdi:bell" />
                </div>
              </div>

              <div class="surface-ground p-3 border-round relative min-h-[150px]">
                <h4 class="mt-0 mb-2 text-color-secondary">Loader (Spinner)</h4>
                <app-loader></app-loader>
              </div>
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-6">
          <p-card header="Menus e interaccion">
            <div class="surface-ground p-3 border-round">
              <h4 class="mt-0 mb-3 text-color-secondary">Action Menu</h4>
              <app-action-menu>
                <ng-container actions>
                  <custom-button-edit />
                  <custom-button-delete />
                </ng-container>
              </app-action-menu>
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-4">
          <p-card header="Empty State">
            <div class="surface-ground p-3 border-round">
              <app-empty-state
                icon="mdi:inbox-outline"
                title="Sin resultados"
                message="No se encontraron registros para los filtros aplicados."
                actionLabel="Nuevo registro"
                actionIcon="mdi:plus"
              />
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-4">
          <p-card header="Date Range">
            <div class="surface-ground p-3 border-round">
              <app-date-range />
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-4">
          <p-card header="Notification Center">
            <div class="surface-ground p-3 border-round flex align-items-center justify-content-center" style="min-height: 120px">
              <app-notification-center [notifications]="sampleNotifications" [unreadCount]="2" />
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-6">
          <p-card header="Confirm Dialog">
            <div class="surface-ground p-3 border-round flex flex-column align-items-center gap-3">
              <p class="text-sm text-color-secondary m-0">
                Dialogo de confirmacion con variante danger.
              </p>
              <p-button
                label="Abrir confirmacion"
                icon="mdi:alert-circle"
                severity="danger"
                (onClick)="confirmVisible.set(true)"
              />
              <app-confirm-dialog
                [(visible)]="confirmVisible"
                title="Eliminar registro"
                message="Estas seguro de eliminar este registro? Esta accion no se puede deshacer."
                type="danger"
                confirmLabel="Eliminar"
              />
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-6">
          <p-card header="File Upload">
            <div class="surface-ground p-3 border-round">
              <app-file-upload
                chooseLabel="Subir archivos"
                accept="image/*,.pdf"
                [maxFileSize]="5000000"
                [multiple]="true"
              />
            </div>
          </p-card>
        </div>

        <div class="col-12">
          <p-card header="Wizard (Asistente por pasos)">
            <app-wizard
              [steps]="wizardSteps"
              [linear]="true"
              finishLabel="Finalizar"
              [(activeStep)]="wizardActiveStep"
            >
              <div step="1" class="flex flex-column gap-2 p-2">
                <strong>Paso 1: Datos basicos</strong>
                <p class="text-sm text-color-secondary m-0">
                  Captura la informacion general del registro.
                </p>
              </div>
              <div step="2" class="flex flex-column gap-2 p-2">
                <strong>Paso 2: Revision</strong>
                <p class="text-sm text-color-secondary m-0">
                  Verifica que los datos capturados sean correctos.
                </p>
              </div>
              <div step="3" class="flex flex-column gap-2 p-2">
                <strong>Paso 3: Confirmacion</strong>
                <p class="text-sm text-color-secondary m-0">
                  Confirma el registro para completar el proceso.
                </p>
              </div>
            </app-wizard>
          </p-card>
        </div>

        <div class="col-12">
          <app-common-core-coverage />
        </div>
      </div>
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogCore {
  EStatus = EStatus;
  confirmVisible = signal(false);

  readonly sampleNotifications: NotificationItem[] = [
    {
      id: "1",
      icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "El documento PROC-ADMI-012 ha sido aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
    {
      id: "2",
      icon: "mdi:alert",
      title: "Mantenimiento programado",
      description: "Corte de energia electrica el 25/06.",
      time: "Hace 2 h",
      read: false,
      severity: "warn",
    },
    {
      id: "3",
      icon: "mdi:check-circle",
      title: "Reporte completado",
      description: "Reporte mensual de finanzas disponible.",
      time: "Hace 1 d",
      read: true,
      severity: "info",
    },
  ];

  readonly wizardSteps: WizardStep[] = [
    { value: 1, label: "Datos", icon: "mdi:file-document-outline" },
    { value: 2, label: "Revision", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ];

  wizardActiveStep = signal(1);
}

