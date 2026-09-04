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
import { WorkSchedulePresentationService } from "src/app/core/services/work-schedule-presentation.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { WorkPositionScheduleDto } from "./interfaces/work-position-schedule.dto";
import { WorkPositionScheduleForm } from "./work-position-schedule-form";
import {
  ReplaceUsageResult,
  WorkPositionScheduleReplaceUsageForm,
} from "./work-position-schedule-replace-usage-form";

interface WorkPositionScheduleUsageResponse {
  scheduleId: string;
  positionsCount: number;
}

interface WorkPositionScheduleDeleteWithReplacementResponse {
  deletedScheduleId: string;
  replacementScheduleId: string;
  reassignedPositionsCount: number;
}

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
  readonly schedulePresentationS = inject(WorkSchedulePresentationService);

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

  async onRequestDelete(item: WorkPositionScheduleDto): Promise<void> {
    const usage = await this.fetchUsageCount(item.id);

    // Si no hay puestos asociados, ejecutar el borrado directo (la app service
    // ya devuelve la confirmacion con la desactivacion si encuentra FK en carrera).
    if (!usage || usage.positionsCount <= 0) {
      await this.deleteSchedule(item.id);
      return;
    }

    // Hay puestos: abrir el modal de reasignacion + borrado.
    const result = await this.openReplaceUsageModal(item, usage.positionsCount);
    if (!result) return;

    await this.deleteWithReplacement(item.id, result.replacementScheduleId);
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

  formatHoursSummary(item: WorkPositionScheduleDto): string {
    return this.schedulePresentationS.hoursSummary(item);
  }

  hasOvernightShift(item: WorkPositionScheduleDto): boolean {
    return [
      [item.lunesEntrada, item.lunesSalida],
      [item.martesEntrada, item.martesSalida],
      [item.miercolesEntrada, item.miercolesSalida],
      [item.juevesEntrada, item.juevesSalida],
      [item.viernesEntrada, item.viernesSalida],
      [item.sabadoEntrada, item.sabadoSalida],
      [item.domingoEntrada, item.domingoSalida],
    ].some(([entry, exit]) => !!entry && !!exit && this.formatTime(exit) <= this.formatTime(entry));
  }

  private formatDay(day: string, entry: string | null, exit: string | null) {
    if (!entry || !exit) return "";
    const entryTime = this.formatTime(entry);
    const exitTime = this.formatTime(exit);
    const nextDay = exitTime <= entryTime ? " +1 día" : "";
    return `${day} ${entryTime}-${exitTime}${nextDay}`;
  }

  private formatTime(value: string): string {
    return value.slice(0, 5);
  }

  private async fetchUsageCount(
    id: string,
  ): Promise<WorkPositionScheduleUsageResponse | null> {
    return this.apiResponseS.onGetItem<WorkPositionScheduleUsageResponse>(
      Endpoints.Catalogs.WorkPositionSchedule.getUsageCount(id),
    );
  }

  private async deleteSchedule(id: string): Promise<void> {
    const ok = await this.apiResponseS.onDelete(
      Endpoints.Catalogs.WorkPositionSchedule.delete(id),
    );
    if (ok) this.onLoadData();
  }

  private async openReplaceUsageModal(
    schedule: WorkPositionScheduleDto,
    positionsCount: number,
  ): Promise<ReplaceUsageResult | null> {
    return this.dialogHandlerS.openDialog<ReplaceUsageResult | undefined>(
      WorkPositionScheduleReplaceUsageForm,
      { schedule, positionsCount },
      "Reemplazar horario en uso",
      this.dialogHandlerS.sizeMd,
    );
  }

  private async deleteWithReplacement(
    id: string,
    replacementScheduleId: string,
  ): Promise<void> {
    const result =
      await this.apiResponseS.onPost<WorkPositionScheduleDeleteWithReplacementResponse>(
        Endpoints.Catalogs.WorkPositionSchedule.replaceUsage(id),
        { replacementScheduleId },
      );
    if (result) this.onLoadData();
  }
}
