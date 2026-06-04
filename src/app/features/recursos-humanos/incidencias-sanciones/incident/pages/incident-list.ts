import { DatePipe } from "@angular/common";
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SwalService } from "src/app/core/services/swal.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";
import {
  IncidentDetailDTO,
  IncidentListDTO,
} from "../models/incident.interfaces";
import { IncidentFormComponent } from "./incident-form";
import { IncidentResolveComponent } from "./incident-resolve";

@Component({
  selector: "app-incident-list",
  templateUrl: "./incident-list.html",
  imports: [
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonDownload,
    CustomButtonItem,
    CustomButtonViewPdf,
    DataViewMobile,
    ActionMenu,
    IonButtonItem,
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

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

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
        text: "Ingrese el motivo de cancelación:",
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

  /** Genera y descarga el acta administrativa para firma física. Persiste en disco y marca IsActGenerated. */
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
              "El acta firmada se guardó correctamente.",
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
