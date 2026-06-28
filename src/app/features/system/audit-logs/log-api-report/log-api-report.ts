import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";

/**
 * Entrada de log del API
 */
interface LogEntry {
  id: number;
  message: string;
  messageTemplate: string;
  level: string;
  timestamp: string;
  exception: string;
  properties: string;
  userName: string;
  expanded?: boolean;
}

@Component({
  selector: "app-log-api-report",
  imports: [
    EmptyState,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    CustomButton,
    CustomButtonDelete,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomButton,
    DataViewMobile,
    PrimeNgCustomCaption,
    AppIcon,
  ],
  templateUrl: "./log-api-report.html",
  styleUrls: ["./log-api-report.scss"],
})
export class LogApiReport implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);

  data = signal<LogEntry[]>([]);
  loading = signal(true);

  totalRecords = signal(0);
  rows = signal(tablePrimeNgRows());
  searchTerm = signal<string>("");
  currentPage = signal(1);

  filterLevelControl = new FormControl<string | null>(null);
  filterDateRangeControl = new FormControl<Date[] | null>(null);

  levelOptions: ISelectItem[] = [
    { label: "Information", value: "Information" },
    { label: "Warning", value: "Warning" },
    { label: "Error", value: "Error" },
    { label: "Critical", value: "Critical" },
    { label: "debug", value: "debug" },
    { label: "Trace", value: "Trace" },
  ];

  readonly globalFilterFields = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  /**
   * Valida si el botÃ³n de bÃºsqueda debe estar deshabilitado
   */
  get isSearchDisabled(): boolean {
    const dates = this.filterDateRangeControl.value;
    const isDateRangeMissing = !dates || dates.length < 2;
    return isDateRangeMissing;
  }

  ngOnInit(): void {
    this.onLoadData(true);
  }

  /**
   * Carga el listado de logs con filtros y paginaciÃ³n
   * @param isNewSearch - Si es una nueva bÃºsqueda, reinicia a la pÃ¡gina 1
   */
  onLoadData(isNewSearch: boolean = false): void {
    if (isNewSearch) {
      this.currentPage.set(1);
    }

    this.loading.set(true);
    const urlApi = Endpoints.Logs.getAll;

    // Los parÃ¡metros deben ir prefixeados con "pagination." para que el backend los bindÃ© correctamente
    const params: any = {
      "pagination.Page": this.currentPage(),
      "pagination.RecordsNumber": this.rows(),
      "pagination.Filter": this.searchTerm(),
    };

    if (this.filterLevelControl.value) {
      params.level = this.filterLevelControl.value;
    }

    const dates = this.filterDateRangeControl.value;
    if (dates && dates.length === 2) {
      if (dates[0]) {
        params.startDate = this.dateS.getDateFormat(dates[0]);
      }
      if (dates[1]) {
        params.endDate = this.dateS.getDateFormat(dates[1]);
      }
    }

    this.apiResponseS.onGetList(urlApi, params).then((result: any) => {
      if (result) {
        if (isNewSearch) {
          this.data.set(result.items || []);
          this.totalRecords.set(result.totalRecords ?? 0);
        } else {
          const newItems = result.items || [];
          this.data.update((current) => [...current, ...newItems]);
          this.totalRecords.set(result.totalRecords ?? this.data().length);
        }
      } else {
        this.data.set([]);
        this.totalRecords.set(0);
      }
      this.loading.set(false);
    });
  }

  /**
   * Maneja el cambio de pÃ¡gina en la tabla de escritorio
   */
  onPageChange(event: any): void {
    this.rows.set(event.rows);
    this.currentPage.set(event.first / event.rows + 1);
    this.onLoadData(true);
  }

  /**
   * Alterna el estado de expansiÃ³n de un registro
   */
  toggleExpand(item: LogEntry): void {
    item.expanded = !item.expanded;
  }

  /**
   * BÃºsqueda por tÃ©rmino libre en el mensaje
   */
  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.onLoadData(true);
  }

  /**
   * Carga mÃ¡s registros en la vista mÃ³vil
   */
  loadMore(): void {
    this.currentPage.update((p) => p + 1);
    this.onLoadData();
  }

  /**
   * Elimina todos los registros de logs de la base de datos
   */
  async onDeleteAll(): Promise<void> {
    const result = await this.apiResponseS.onDelete(Endpoints.Logs.deleteAll);
    if (result) {
      this.data.set([]);
      this.totalRecords.set(0);
    }
  }

  /**
   * Obtiene la severidad del tag segÃºn el nivel del log
   */
  getLevelSeverity(level: string): "success" | "info" | "warn" | "danger" {
    switch (level?.toLowerCase()) {
      case "information":
        return "info";
      case "warning":
        return "warn";
      case "error":
      case "critical":
        return "danger";
      default:
        return "info";
    }
  }
}
