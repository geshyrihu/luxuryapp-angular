import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { Loader } from "src/app/core/components/loader/loader";
import { EStatus, StatusBadge } from "src/app/core/components/status-badge/status-badge";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { NotificationItem } from "src/app/core/components/notification-center/notification-center";
import { CustomButtonDelete, CustomButtonEdit } from "src/app/core/components/buttons/web";
import { EmptyState } from "src/app/core/components/empty-state/empty-state";
import { DateRange } from "src/app/core/components/date-range/date-range";
import { NotificationCenter } from "src/app/core/components/notification-center/notification-center";
import { ConfirmDialog } from "src/app/core/components/confirm-dialog/confirm-dialog";
import { FileUpload } from "src/app/core/components/file-upload/file-upload";
import { Wizard, WizardStep } from "src/app/core/components/wizard/wizard";
import { CommonCoreCoverage } from "../../shared/common-core-coverage";

const CORE_LABELS: Record<string, string> = {
  actionmenu: "Action Menu",
  appicon: "App Icon",
  dataviewmobile: "Data View Mobile",
  loader: "Loader",
  notificationcenter: "Notification Center",
  primengcustomcaption: "PrimeNg Custom Caption",
  statusbadge: "Status Badge",
  wizard: "Wizard",
  emptystate: "Empty State",
  confirmdialog: "Confirm Dialog",
  daterange: "Date Range",
  fileupload: "File Upload",
};

@Component({
  selector: "app-catalog-core-item",
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    TagModule,
    ActionMenu,
    AppIcon,
    DataViewMobile,
    Loader,
    StatusBadge,
    PrimeNgCustomCaption,
    CustomButtonDelete,
    CustomButtonEdit,
    EmptyState,
    DateRange,
    NotificationCenter,
    ConfirmDialog,
    FileUpload,
    Wizard,
    CommonCoreCoverage,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
        @case ('actionmenu') {
          <p-card header="Action Menu">
            <app-action-menu><custom-button-edit /><custom-button-delete /></app-action-menu>
          </p-card>
        }
        @case ('appicon') {
          <p-card header="App Icon">
            <div class="flex gap-3 text-2xl text-primary">
              <app-icon icon="mdi:account" />
              <app-icon icon="mdi:cog" />
              <app-icon icon="mdi:bell" />
            </div>
          </p-card>
        }
        @case ('dataviewmobile') {
          <p-card header="Data View Mobile">
            <app-data-view-mobile [data]="groupedData" groupKey="section">
              <ng-template #header let-group><strong>{{ group.section }}</strong></ng-template>
              <ng-template #body let-item>{{ item.title }}</ng-template>
            </app-data-view-mobile>
          </p-card>
        }
        @case ('loader') {
          <p-card header="Loader">
            <app-loader />
          </p-card>
        }
        @case ('notificationcenter') {
          <p-card header="Notification Center">
            <app-notification-center [notifications]="sampleNotifications" [unreadCount]="2" />
          </p-card>
        }
        @case ('primengcustomcaption') {
          <p-card header="PrimeNg Custom Caption">
            <primeng-custom-caption label="Agregar Insumo" [rolAuth]="true" [showSearch]="true" />
          </p-card>
        }
        @case ('statusbadge') {
          <p-card header="Status Badge">
            <div class="flex gap-2 flex-wrap">
              <app-status-badge [status]="EStatus.Concluido" />
              <app-status-badge [status]="EStatus.Pendiente" />
              <app-status-badge [status]="EStatus.Proceso" />
              <app-status-badge [status]="EStatus.Cancelado" />
              <app-status-badge [status]="EStatus.noAutorizado" />
            </div>
          </p-card>
        }
        @case ('wizard') {
          <p-card header="Wizard">
            <app-wizard [steps]="wizardSteps" [linear]="true" finishLabel="Finalizar" [(activeStep)]="wizardActiveStep">
              <div step="1"><strong>Paso 1</strong></div>
              <div step="2"><strong>Paso 2</strong></div>
              <div step="3"><strong>Paso 3</strong></div>
            </app-wizard>
          </p-card>
        }
        @case ('emptystate') {
          <p-card header="Empty State">
            <app-empty-state icon="mdi:inbox-outline" title="Sin resultados" message="No se encontraron registros." actionLabel="Nuevo registro" actionIcon="mdi:plus" />
          </p-card>
        }
        @case ('confirmdialog') {
          <p-card header="Confirm Dialog">
            <p-button label="Abrir confirmación" severity="danger" (onClick)="confirmVisible.set(true)" />
            <app-confirm-dialog [(visible)]="confirmVisible" title="Eliminar registro" message="¿Estás seguro?" type="danger" confirmLabel="Eliminar" />
          </p-card>
        }
        @case ('daterange') {
          <p-card header="Date Range"><app-date-range /></p-card>
        }
        @case ('fileupload') {
          <p-card header="File Upload">
            <app-file-upload chooseLabel="Subir archivos" accept="image/*,.pdf" [maxFileSize]="5000000" [multiple]="true" />
          </p-card>
        }
      }
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogCoreItem {
  private route = inject(ActivatedRoute);
  item = signal(this.route.snapshot.paramMap.get('item') ?? '');
  label = CORE_LABELS[this.item()] ?? this.item();
  EStatus = EStatus;
  confirmVisible = signal(false);
  wizardActiveStep = signal(1);

  readonly groupedData = [{ section: 'Hoy', title: 'Revisión', status: 'Pendiente' }, { section: 'Mañana', title: 'Junta', status: 'Urgente' }];

  readonly sampleNotifications: NotificationItem[] = [
    { id: "1", icon: "mdi:file-document", title: "Documento aprobado", description: "Aprobado.", time: "Hace 5 min", read: false, severity: "success" },
  ];

  readonly wizardSteps: WizardStep[] = [
    { value: 1, label: "Datos", icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisión", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ];
}
