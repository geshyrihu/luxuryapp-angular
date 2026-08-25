import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectButton } from "@ui/inputs/web/custom-input-select-button-signal";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import saveAs from "file-saver";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { FilterRequestsService } from "src/app/core/http/services/filter-requests.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";

@Component({
  selector: "app-filter-requests",
  templateUrl: "./filter-requests.html",
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .requests-filter-toolbar {
        flex-wrap: nowrap;
        row-gap: var(--ds-space-sm);
        width: 100%;
      }

      .requests-filter-toolbar__search {
        flex: 1 1 14rem;
        min-width: 12rem;
      }

      .requests-filter-toolbar__date {
        flex: 0 0 12rem;
      }

      .requests-filter-toolbar__status {
        flex: 1 1 26rem;
        min-width: 24rem;
      }

      .requests-filter-toolbar__action {
        display: flex;
        flex: 0 0 auto;
      }

      :host ::ng-deep base-input-signal .field {
        margin-bottom: 0;
      }

      :host ::ng-deep custom-search-input-signal,
      :host ::ng-deep custom-search-input-signal .field {
        display: block;
        margin-bottom: 0;
        width: 100%;
      }

      :host ::ng-deep custom-input-date-signal .field-horizontal,
      :host ::ng-deep custom-input-select-button-signal .field-horizontal {
        align-items: end;
        gap: var(--ds-space-sm);
      }

      :host ::ng-deep custom-input-date-signal .field-content,
      :host ::ng-deep custom-input-select-button-signal .field-content {
        display: flex;
        align-items: center;
      }

      :host ::ng-deep custom-input-select-button-signal .p-selectbutton {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
      }

      :host ::ng-deep custom-input-select-button-signal .p-togglebutton {
        flex: 1 1 auto;
        justify-content: center;
        white-space: nowrap;
      }

      :host ::ng-deep .requests-filter-toolbar__export-button {
        align-items: center;
        height: 2.5rem;
        min-height: 2.5rem;
        white-space: nowrap;
      }

      @media (max-width: 1280px) {
        .requests-filter-toolbar {
          flex-wrap: wrap;
        }

        .requests-filter-toolbar__date,
        .requests-filter-toolbar__status,
        .requests-filter-toolbar__action {
          flex: 1 1 100%;
        }

        .requests-filter-toolbar__action {
          justify-content: flex-end;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabel,
    CustomInputDateSignal,
    CustomInputSelectButton,
    CustomSearchInput,
  ],
})
export class FilterRequests {
  apiResponseS = inject(ApiResponseService);
  dataConnectorS = inject(DataConnectorService);
  filterRequestsService = inject(FilterRequestsService);
  customToastService = inject(CustomToastService);

  fechaInicial = new Date(new Date().getFullYear(), 0, 1);
  fechaFormateadaControl = new FormControl<Date>(this.fechaInicial);
  statusRequestControl = new FormControl<string>("Pendiente");

  noCandidates = input<number>(0);
  cb_status_request: SelectItemDto[] = [
    { value: "", label: "Mostrar Todos" },
    { value: "Pendiente", label: "Pendiente" },
    { value: "Proceso", label: "Proceso" },
    { value: "Concluido", label: "Concluido" },
    { value: "Cancelado", label: "Cancelado" },
  ];

  apiUrl = input<string>();
  nameFile = input<string>("Reporte.xlsx");
  showRequestFilters = input<boolean>(true);

  private destroyRef = inject(DestroyRef);

  constructor() {
    this.fechaFormateadaControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onLoadData());
  }

  exportToExcel(): void {
    const url = this.apiUrl();
    if (!url) return;

    this.dataConnectorS
      .getFile(url, this.filterRequestsService.getParams())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resp: Blob) => {
          const blob = new Blob([resp], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, this.nameFile());
        },
        error: (error) => {
          console.error("Error in exportToExcel:", error);
          this.customToastService.showError(
            "Error al crear",
            "No se pudo completar la operacion.",
          );
        },
      });
  }

  onSendReportVacants() {
    const urlApi = Endpoints.RecruitmentRequests.sendReportVacants;
    this.apiResponseS.onPost(urlApi).then(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const fechaString = this.formatDateToYearMonth(
      this.fechaFormateadaControl.value,
    );

    this.filterRequestsService.setParams(
      fechaString,
      this.statusRequestControl.value || "",
    );
  }

  private formatDateToYearMonth(date: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      date = new Date();
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  onSearch(term: string) {
    this.filterRequestsService.setSearch(term);
  }
}
