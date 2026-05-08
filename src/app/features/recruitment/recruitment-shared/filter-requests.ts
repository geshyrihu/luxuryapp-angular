import { Component, DestroyRef, Input, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import saveAs from "file-saver";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { FilterRequestsService } from "src/app/core/services/filter-requests.service";
@Component({
  selector: "app-filter-requests",
  templateUrl: "./filter-requests.html",
  styles: [
    `
      :host ::ng-deep base-input-signal .field {
        margin-bottom: 0;
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CustomButton,
    CustomInputDateSignal,
    CustomInputSelectSignal,
  ],
})
export class FilterRequests {
  apiResponseS = inject(ApiResponseService);
  dataConnectorS = inject(DataConnectorService);
  router = inject(Router);
  filterRequestsService = inject(FilterRequestsService);
  customToastService = inject(CustomToastService);
  menu = [
    { label: "📋 Vacantes", path: "vacancies" },
    { label: "✅ Altas", path: "hirings" },
    { label: "🚪 Bajas", path: "dismissals" },
    { label: "💰 Modificación de salario", path: "salary-increase" },
  ];

  fechaInicial = new Date(new Date().getFullYear(), 0, 1);
  fechaFormateadaControl = new FormControl<Date>(this.fechaInicial);

  statusRequestControl = new FormControl<string>("Pendiente");

  @Input() noCandidates: number = 0;
  cb_status_request: ISelectItem[] = [
    { value: "", label: "Mostrar Todos" },
    { value: "Pendiente", label: "Pendiente" },
    { value: "Proceso", label: "Proceso" },
    { value: "Concluido", label: "Concluido" },
    { value: "Cancelado", label: "Cancelada" },
  ];

  @Input() apiUrl: string;
  @Input() nameFile: string;

  private destroyRef = inject(DestroyRef);

  constructor() {
    this.fechaFormateadaControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onLoadData());
  }

  exportToExcel(): void {
    this.dataConnectorS
      .getFile(this.apiUrl, this.filterRequestsService.getParams())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resp: Blob) => {
          console.log("File received in next callback.");
          const blob = new Blob([resp], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, this.nameFile);
          console.log("File saved successfully.");
        },
        error: (error) => {
          console.error("Error in exportToExcel:", error);
          this.customToastService.showError(
            "Error al crear",
            "No se pudo completar la operación.",
          );
        },
      });
  }

  onSendReportVacants() {
    const urlApi = `solicitudesreclutamiento/sendreportvacants`;
    this.apiResponseS.onPost(urlApi).then(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    // ? Convierte la fecha a string en formato yyyy-MM
    const fechaString = this.formatDateToYearMonth(
      this.fechaFormateadaControl.value,
    );

    this.filterRequestsService.setParams(
      fechaString,
      this.statusRequestControl.value || "",
    );
  }

  // ? Mótodo helper para convertir Date a string "yyyy-MM"
  private formatDateToYearMonth(date: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      // Si la fecha no es vólida, usa la fecha actual
      date = new Date();
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  currentPath = this.router.url;

  isActive(path: string): boolean {
    const currentPath = this.router.url;
    return currentPath.includes("/recruitment/requests/" + path);
  }
}
