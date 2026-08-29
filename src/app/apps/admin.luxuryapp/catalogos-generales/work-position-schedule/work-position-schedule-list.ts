import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { WorkPositionScheduleDto } from "./interfaces/work-position-schedule.dto";
import { WorkPositionScheduleForm } from "./work-position-schedule-form";

@Component({
  selector: "app-work-position-schedule-list",
  templateUrl: "./work-position-schedule-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileActionMenu,
  ],
})
export class WorkPositionScheduleList implements OnInit {
  private dialogHandlerS = inject(DialogHandlerService);
  private apiResponseS = inject(ApiResponseService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<WorkPositionScheduleDto[]>([]);
  loading = signal(true);
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<WorkPositionScheduleDto[]>(
        Endpoints.Catalogs.WorkPositionSchedule.getAll,
      )
      .then((result) => {
        if (result) this.dataSignal.set(result);
      })
      .finally(() => this.loading.set(false));
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.WorkPositionSchedule.delete(id))
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        WorkPositionScheduleForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  formatSchedule(item: WorkPositionScheduleDto): string {
    const days = [
      this.formatDay("Lun", item.lunesEntrada, item.lunesSalida),
      this.formatDay("Mar", item.martesEntrada, item.martesSalida),
      this.formatDay("Mie", item.miercolesEntrada, item.miercolesSalida),
      this.formatDay("Jue", item.juevesEntrada, item.juevesSalida),
      this.formatDay("Vie", item.viernesEntrada, item.viernesSalida),
      this.formatDay("Sab", item.sabadoEntrada, item.sabadoSalida),
      this.formatDay("Dom", item.domingoEntrada, item.domingoSalida),
    ].filter(Boolean);

    return days.length ? days.join(" · ") : "Sin horas definidas";
  }

  private formatDay(day: string, entry: string | null, exit: string | null) {
    if (!entry || !exit) return "";
    return `${day} ${this.formatTime(entry)}-${this.formatTime(exit)}`;
  }

  private formatTime(value: string): string {
    return value.slice(0, 5);
  }
}
