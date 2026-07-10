import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { EAreaMinutasDetallesPipe } from "src/app/shared/pipes/area-minuta-detalles.pipe";
import { SanitizeHtmlPipe } from "src/app/shared/pipes/sanitize-html.pipe";
@Component({
  selector: "app-meeting-detail-form",
  templateUrl: "./meeting-detail-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    TableModule,
    EAreaMinutasDetallesPipe,
    SanitizeHtmlPipe,
  ],
})
export class MeetingDetailForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  tableScrollHeightS = inject(TableScrollHeightService);

  status: number = 0;
  meetingId: string = "";
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit() {
    this.meetingId = this.config.data.id;
    this.status = this.config.data.status;
    this.onLoadData();
  }
  orderData() {
    this.dataSignal.update((data) => data.sort());
  }
  convertirFecha(item: any) {
    return this.dateS.getDateFormat(item);
  }
  onLoadData() {
    const urlApi = `MeetingsDetails/DetallesFiltro/${this.meetingId}/${this.status}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  calculateDetailTotal(name: string) {
    let total = 0;

    if (this.dataSignal()) {
      for (let customer of this.dataSignal()) {
        if (customer.eAreaMinutasDetalles === name) {
          total++;
        }
      }
    }

    return total;
  }
}
