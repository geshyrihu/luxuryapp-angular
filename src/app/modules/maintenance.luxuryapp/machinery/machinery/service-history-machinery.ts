import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { ServiceOrderForm } from "@operations.luxuryapp/service-orders/service-order/service-order-form";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-service-history-machinery",
  templateUrl: "./service-history-machinery.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    TableEmptyMessage,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    NgbTooltipModule,
    LuxTableCaption,
  ],
})
export class ServiceHistoryMachinery implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  config = inject(DynamicDialogConfig);
  Id: any = this.config.data.id;

  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.Machineries.serviceHistory(this.config.data.id);
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        ServiceOrderForm,
        {
          id: data.id,
          machineryId: data.machineryId,
          providerId: data.providerId,
        },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
