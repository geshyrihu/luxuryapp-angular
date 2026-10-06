import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SwalService } from "@core/services/swal.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { IncidentListDesktop } from "./desktop/incident-list-desktop";
import { IncidentFormComponent } from "./incident-form";
import { IncidentResolveComponent } from "./incident-resolve";
import {
  IncidentDetailDTO,
  IncidentListDTO,
} from "./interfaces/incident.interfaces";
import { IncidentListMobile } from "./mobile/incident-list-mobile";

@Component({
  selector: "app-incident-list",
  templateUrl: "./incident-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [IncidentListDesktop, IncidentListMobile],
})
export class IncidentList implements OnInit {
  employeeId = input<string>();

  apiResponseS = inject(ApiResponseService);
  toastS = inject(CustomToastService);
  dialogHandlerS = inject(DialogHandlerService);
  swalS = inject(SwalService);
  confirmS = inject(ConfirmService);
  customerIdService = inject(CustomerIdService);
  platformS = inject(PlatformService);

  dataSignal = signal<IncidentListDTO[]>([]);
  loading = signal(true);

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

  async onDelete(id: string) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta incidencia?",
    );
    if (!confirmed) return;
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
}
