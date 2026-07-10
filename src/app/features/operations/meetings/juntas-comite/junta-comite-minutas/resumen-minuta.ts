import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LxTag } from "@ui/adaptive/tag/tag";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { ReportService } from "src/app/core/services/report.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SanitizeHtmlPipe } from "src/app/shared/pipes/sanitize-html.pipe";

@Component({
  selector: "app-resumen-minuta",
  templateUrl: "./resumen-minuta.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    // ResumenMinutaGrafico,
    CommonModule,
    TableModule,
    SanitizeHtmlPipe,
    LxTag,
    TooltipModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CardModule,
    AppIcon,
  ],
})
export class ResumenMinuta implements OnInit {
  reportService = inject(ReportService);
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  activatedRoute = inject(ActivatedRoute);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  dataGrafico: any[] = [];
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList(
        Endpoints.MeetingDetailsTracking.resumenPresentacion(
          this.activatedRoute.snapshot.params.meetingId,
        ),
      )
      .then((result: any[]) => {
        const transformedData = result.map((item) => {
          // Transform deliveryDate
          if (item.deliveryDate) {
            item.deliveryDate = this.dateS.parseDate(item.deliveryDate);
          }

          // Transform seguimiento dates
          if (
            item.meetingDertailsSeguimientos &&
            item.meetingDertailsSeguimientos.length > 0
          ) {
            item.meetingDertailsSeguimientos.forEach((seguimiento: any) => {
              if (seguimiento.fecha) {
                seguimiento.fecha = this.dateS.parseDate(seguimiento.fecha);
              }
            });
          }
          return item;
        });

        this.dataSignal.set(transformedData);
        this.loading.set(false);
      })
      .catch(() => {
        this.loading.set(false);
      });

    this.apiResponseS
      .onGetList(
        Endpoints.MeetingDetailsTracking.resumenGraficoPresentacion(
          this.activatedRoute.snapshot.params.meetingId,
        ),
      )
      .then((result: any) => {
        this.dataGrafico = result;
        this.reportService.setDataGrafico(result);
      });
  }

  getSeverity(
    status: number,
  ): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
    switch (status) {
      case 0: // Pendiente
        return "danger";
      case 1: // Concluido
        return "success";
      case 2: // Cancelado
        return "warn";
      default:
        return "secondary";
    }
  }

  getSeverityText(status: number): string {
    switch (status) {
      case 0:
        return "Pendiente";
      case 1:
        return "Concluido";
      case 2:
        return "Cancelado";
      default:
        return "Desconocido";
    }
  }
}
