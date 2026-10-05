import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { PlatformService } from "@core/services/platform.service";
import { ReportService } from "@core/services/report.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ResumenMinutaDesktop } from "./desktop/resumen-minuta-desktop";
import { ResumenMinutaMobile } from "./mobile/resumen-minuta-mobile";

@Component({
  selector: "app-resumen-minuta",
  templateUrl: "./resumen-minuta.html",
  styleUrl: "./resumen-minuta.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ResumenMinutaDesktop, ResumenMinutaMobile],
})
export class ResumenMinuta implements OnInit {
  reportService = inject(ReportService);
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  activatedRoute = inject(ActivatedRoute);
  tableScrollHeightS = inject(TableScrollHeightService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
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
            item.meetingDetailsFollowUps &&
            item.meetingDetailsFollowUps.length > 0
          ) {
            item.meetingDetailsFollowUps.forEach((seguimiento: any) => {
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
      case 2: // No Autorizado
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
        return "No Autorizado";
      default:
        return "Desconocido";
    }
  }
}
