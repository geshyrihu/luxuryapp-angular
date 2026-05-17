import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ReportService } from "src/app/core/services/report.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

@Component({
  selector: "app-resumen-minuta",
  templateUrl: "./resumen-minuta.html",
  imports: [
    // ResumenMinutaGrafico,
    CommonModule,
    TableModule,
    SanitizeHtmlPipe,
    TagModule,
    TooltipModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
  ],
})
export class ResumenMinuta implements OnInit {
  reportService = inject(ReportService);
  apiResponseS = inject(ApiResponseService);
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
    const urlApi1 = `MeetingDertailsSeguimiento/ResumenMinutasPresentacion/${this.activatedRoute.snapshot.params.meetingId}`;
    this.apiResponseS
      .onGetList(urlApi1)
      .then((result: any[]) => {
        const transformedData = result.map((item) => {
          // Helper function to parse 'dd/MM/yyyy'
          const parseDate = (dateString: string): Date | null => {
            if (!dateString || !/^\d{2}\/\d{2}\/\d{4}/.test(dateString)) {
              return null;
            }
            const [day, month, year] = dateString.split("/");
            return new Date(+year, +month - 1, +day);
          };

          // Transform deliveryDate
          if (item.deliveryDate) {
            item.deliveryDate = parseDate(item.deliveryDate);
          }

          // Transform seguimiento dates
          if (
            item.meetingDertailsSeguimientos &&
            item.meetingDertailsSeguimientos.length > 0
          ) {
            item.meetingDertailsSeguimientos.forEach((seguimiento: any) => {
              if (seguimiento.fecha) {
                seguimiento.fecha = parseDate(seguimiento.fecha);
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

    const urlApi = `MeetingDertailsSeguimiento/ResumenMinutasGraficoPresentacion/${this.activatedRoute.snapshot.params.meetingId}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
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
