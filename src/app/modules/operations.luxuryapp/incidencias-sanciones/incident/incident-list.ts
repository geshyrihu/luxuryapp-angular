import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppTable } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";

import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { SwalService } from "@core/services/swal.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { IncidentFormComponent } from "./incident-form";
import { IncidentResolveComponent } from "./incident-resolve";
import {
  IncidentDetailDTO,
  IncidentListDTO,
} from "./interfaces/incident.interfaces";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-incident-list",
  templateUrl: "./incident-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDownload,
    WebButtonIconViewPdf,
    WebButtonIconDelete,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    ApiDatePipe,
    AppTable,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,

    DataViewMobile,
  ],
})
export class IncidentList implements OnInit {
  employeeId = input<string>();

  apiResponseS = inject(ApiResponseService);
  toastS = inject(CustomToastService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  swalS = inject(SwalService);
  customerIdService = inject(CustomerIdService);

  dataSignal = signal<IncidentListDTO[]>([]);
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = signal([
    "employeeName",
    "incidentTypeName",
    "category",
    "severityLevel",
    "investigationStatus",
    "description",
  ]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    const endpoint = this.employeeId()
      ? Endpoints.HR.Incident.byEmployee(
          this.employeeId(),
          this.customerIdService.customerId(),
        )
      : Endpoints.HR.Incident.getAll(this.customerIdService.customerId());
    this.apiResponseS.onGetList<IncidentListDTO[]>(endpoint).then((result) => {
      if (result) this.dataSignal.set(result);
    });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.HR.Incident.delete(id))
      .then((response: boolean) => {
        if (response) {
          this.dataSignal.update((curr) =>
            curr.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: { id: string; title: string }) {
    const dialogData = this.employeeId()
      ? { id: "", employeeId: this.employeeId() }
      : { id: "" };
    this.dialogHandlerS
      .openDialog(
        IncidentFormComponent,
        dialogData,
        data.title,
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onEdit(item: IncidentListDTO): void {
    this.dialogHandlerS
      .openDialog(
        IncidentFormComponent,
        { id: item.id, employeeId: item.employeeId },
        "Editar Incidencia",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onResolve(item: IncidentListDTO): void {
    this.dialogHandlerS
      .openDialog(
        IncidentResolveComponent,
        { id: item.id },
        "Resolver Incidencia",
        this.dialogHandlerS.sizeMd,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onCancel(item: IncidentListDTO): void {
    this.swalS
      .fire({
        title: "Cancelar Incidencia",
        text: "Ingrese el motivón:",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Cancelar Incidencia",
        cancelButtonText: "Cerrar",
      })
      .then((result) => {
        if (result.isConfirmed && result.value) {
          this.apiResponseS
            .onPatch<void>(Endpoints.HR.Incident.cancel(item.id), {
              cancellationReason: result.value,
            })
            .then((success) => {
              if (success) {
                this.swalS.success(
                  "Cancelada",
                  "Incidencia cancelada correctamente.",
                );
                this.onLoadData();
              }
            });
        }
      });
  }

  /** Genera y descarga el acta administrativísica. Persiste en disco y marca IsActGenerated. */
  onGenerateAct(item: IncidentListDTO): void {
    const nombre = item.employeeName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
    const fecha = new Date(item.incidentDateTime);
    const fechaStr = `${String(fecha.getDate()).padStart(2, "0")}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${fecha.getFullYear()}`;
    this.apiResponseS.onDownloadFile(
      Endpoints.HR.Incident.generateAct(item.id),
      `acta-${nombre}-${fechaStr}.pdf`,
    );
    setTimeout(() => this.onLoadData(), 2000);
  }

  /** Dispara el input file oculto para seleccionar el acta firmada. */
  onUploadSignedAct(item: IncidentListDTO): void {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      this.apiResponseS
        .onPostFile<IncidentDetailDTO>(
          Endpoints.HR.Incident.uploadSignedAct(item.id),
          formData,
        )
        .then((result) => {
          if (result !== false) {
            this.toastS.showSuccess(
              "Acta guardada",
              "El acta fió correctamente.",
            );
            this.onLoadData();
          }
        });
    };
    input.click();
  }

  getSeverityBadge(severity: string): string {
    const map: Record<string, string> = {
      Low: "bg-sky-100 text-sky-700 border-sky-200",
      Moderate: "bg-amber-100 text-amber-700 border-amber-200",
      Medium: "bg-red-100 text-red-700 border-red-200",
      High: "bg-red-100 text-red-700 border-red-200",
    };
    return map[severity] ?? "bg-slate-100 text-slate-700 border-slate-200";
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      Reportado: "bg-amber-100 text-amber-700 border-amber-200",
      EnInvestigacion: "bg-sky-100 text-sky-700 border-sky-200",
      ResueltoSinSancion: "bg-green-100 text-green-700 border-green-200",
      ResueltoConSancion: "bg-red-100 text-red-700 border-red-200",
      Archivado: "bg-slate-100 text-slate-700 border-slate-200",
      Cancelado: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return map[status] ?? "bg-slate-100 text-slate-700 border-slate-200";
  }
}

