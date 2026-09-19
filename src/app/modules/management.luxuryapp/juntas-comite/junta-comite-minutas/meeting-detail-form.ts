import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { EAreaMinutasDetallesPipe } from "@shared/pipes/area-minuta-detalles.pipe";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
@Component({
  selector: "app-meeting-detail-form",
  templateUrl: "./meeting-detail-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
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
  tableRows: number = tableRows();
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
    const urlApi =
      Endpoints.MeetingsDetails.detailFilter(
        this.meetingId,
        this.status,
      );
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

