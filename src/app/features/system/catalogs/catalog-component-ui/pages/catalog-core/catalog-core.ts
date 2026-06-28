import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { Loader } from "src/app/core/components/shared/loader/loader";
import { NotificationItem } from "src/app/core/components/shared/notification-center/notification-center";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { StatusBadge, EStatus } from "src/app/core/components/shared/status-badge/status-badge";
import { WizardStep, Wizard } from "src/app/core/components/shared/wizard/wizard";
import { CommonCoreCoverage } from "../../shared/common-core-coverage";
import { CustomButtonDelete, CustomButtonEdit } from "src/app/core/components/buttons/web";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { DateRange } from "src/app/core/components/shared/date-range/date-range";
import { NotificationCenter } from "src/app/core/components/shared/notification-center/notification-center";
import { ConfirmDialog } from "src/app/core/components/shared/confirm-dialog/confirm-dialog";
import { FileUpload } from "src/app/core/components/shared/file-upload/file-upload";
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
    DataViewMobile,
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
          Elementos transversales de arquitectura y UX base de src/app/core/components.
        </p>
      </div>

      <div class="grid">

        <div class="col-12 lg:col-6">
          <p-card header="NavegaciÃ³n y UX Base">
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
          <p-card header="MenÃºs e InteracciÃ³n">
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
              <app-notification-center
                [notifications]="sampleNotifications"
                [unreadCount]="2"
              />
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-6">
          <p-card header="Confirm Dialog">
            <div class="surface-ground p-3 border-round flex flex-column align-items-center gap-3">
              <p class="text-sm text-color-secondary m-0">DiÃ¡logo de confirmaciÃ³n con tipo danger.</p>
              <p-button
                label="Abrir confirmaciÃ³n"
                icon="mdi:alert-circle"
                severity="danger"
                (onClick)="confirmVisible.set(true)"
              />
              <app-confirm-dialog
                [(visible)]="confirmVisible"
                title="Eliminar registro"
                message="Â¿EstÃ¡s seguro de eliminar este registro? Esta acciÃ³n no se puede deshacer."
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
          <p-card header="Wizard (Asistente pasos)">
            <app-wizard
              [steps]="wizardSteps"
              [linear]="true"
              finishLabel="Finalizar"
              [(activeStep)]="wizardActiveStep"
            >
              <div step="1" class="flex flex-column gap-2 p-2">
                <strong>Paso 1: Datos bÃ¡sicos</strong>
                <p class="text-sm text-color-secondary m-0">Captura la informaciÃ³n general del registro.</p>
              </div>
              <div step="2" class="flex flex-column gap-2 p-2">
                <strong>Paso 2: RevisiÃ³n</strong>
                <p class="text-sm text-color-secondary m-0">Verifica que los datos capturados sean correctos.</p>
              </div>
              <div step="3" class="flex flex-column gap-2 p-2">
                <strong>Paso 3: ConfirmaciÃ³n</strong>
                <p class="text-sm text-color-secondary m-0">Confirma el registro para completar el proceso.</p>
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
    { id: "1", icon: "mdi:file-document", title: "Documento aprobado", description: "El documento PROC-ADMI-012 ha sido aprobado.", time: "Hace 5 min", read: false, severity: "success" },
    { id: "2", icon: "mdi:alert", title: "Mantenimiento programado", description: "Corte de energÃ­a elÃ©ctrica el 25/06.", time: "Hace 2 h", read: false, severity: "warn" },
    { id: "3", icon: "mdi:check-circle", title: "Reporte completado", description: "Reporte mensual de finanzas disponible.", time: "Hace 1 d", read: true, severity: "info" },
  ];

  readonly wizardSteps: WizardStep[] = [
    { value: 1, label: "Datos", icon: "mdi:file-document-outline" },
    { value: 2, label: "RevisiÃ³n", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ];

  wizardActiveStep = signal(1);
}

