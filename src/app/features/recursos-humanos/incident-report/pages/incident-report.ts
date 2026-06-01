import { Component, inject, signal } from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import saveAs from "file-saver";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { DateService } from "src/app/core/services/date.service";
import {
  IncidentPendingDTO,
  IncidentStatsDTO,
} from "../models/incident-report.dto";

interface IReportFilterForm {
  from: import("@angular/forms").FormControl<Date | null>;
  to: import("@angular/forms").FormControl<Date | null>;
  category: import("@angular/forms").FormControl<string>;
  severity: import("@angular/forms").FormControl<string>;
}

@Component({
  selector: "app-incident-report",
  templateUrl: "./incident-report.html",
  imports: [
    ReactiveFormsModule,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomButton,
  ],
})
export class IncidentReport {
  apiS = inject(ApiResponseService);
  dataConnectorS = inject(DataConnectorService);
  toastS = inject(CustomToastService);
  fb = inject(NonNullableFormBuilder);
  private dateS = inject(DateService);

  stats = signal<IncidentStatsDTO | null>(null);
  pending = signal<IncidentPendingDTO[]>([]);
  isLoading = signal(false);

  form!: FormGroup<IReportFilterForm>;

  cb_category: ISelectItem[] = [
    { value: "", label: "Todas las categorías" },
    { value: "Conducta", label: "Conducta" },
    { value: "Desempeno", label: "Desempeño" },
    { value: "Seguridad", label: "Seguridad" },
    { value: "Asistencia", label: "Asistencia" },
    { value: "Etica", label: "Ética" },
  ];

  cb_severity: ISelectItem[] = [
    { value: "", label: "Todas las severidades" },
    { value: "Low", label: "Leve" },
    { value: "Moderate", label: "Moderado" },
    { value: "Medium", label: "Grave" },
    { value: "High", label: "Muy Grave" },
  ];

  ngOnInit(): void {
    this.form = this.fb.group<IReportFilterForm>({
      from: this.fb.control<Date | null>(null),
      to: this.fb.control<Date | null>(null),
      category: this.fb.control(""),
      severity: this.fb.control(""),
    });
    this.onLoadStats();
    this.onLoadPending();
  }

  onLoadStats(): void {
    this.isLoading.set(true);
    const raw = this.form.getRawValue();
    const params: Record<string, string> = {};
    if (raw.from) params["from"] = this.dateS.getDateFormat(raw.from) ?? "";
    if (raw.to) params["to"] = this.dateS.getDateFormat(raw.to) ?? "";
    if (raw.category) params["category"] = raw.category;
    if (raw.severity) params["severity"] = raw.severity;

    // Construir URL con query params manualmente
    let url = Endpoints.HR.IncidentReport.stats;
    const queryString = Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");
    if (queryString) url += (url.includes("?") ? "&" : "?") + queryString;

    this.apiS.onGetItem<IncidentStatsDTO>(url).then((resp) => {
      if (resp) this.stats.set(resp);
      this.isLoading.set(false);
    });
  }

  onLoadPending(): void {
    this.apiS
      .onGetList<
        IncidentPendingDTO[]
      >(Endpoints.HR.IncidentReport.pendingInvestigation)
      .then((resp) => {
        if (resp) this.pending.set(resp);
      });
  }

  onExport(): void {
    const raw = this.form.getRawValue();
    const params: Record<string, string> = {};
    if (raw.from) params["from"] = this.dateS.getDateFormat(raw.from) ?? "";
    if (raw.to) params["to"] = this.dateS.getDateFormat(raw.to) ?? "";
    if (raw.category) params["category"] = raw.category;
    if (raw.severity) params["severity"] = raw.severity;

    this.dataConnectorS
      .getFile(Endpoints.HR.IncidentReport.export, params)
      .subscribe({
        next: (resp: Blob) => {
          const blob = new Blob([resp], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(
            blob,
            `incidencias_${this.dateS.getDateNow()}.xlsx`,
          );
        },
        error: () =>
          this.toastS.showError("Error", "No se pudo generar el reporte."),
      });
  }

  getSeverityBadge(severity: string): string {
    const map: Record<string, string> = {
      Low: "badge-info",
      Moderate: "badge-warning",
      Medium: "badge-danger",
      High: "badge-danger",
    };
    return map[severity] ?? "badge-neutral";
  }
}
