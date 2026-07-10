import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ServiceOrderForm } from "src/app/features/operations/field-service/service-order/service-order-form";

@Component({
  selector: "app-service-history-machinery",
  templateUrl: "./service-history-machinery.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    NgbTooltipModule,
    PrimeNgCustomCaption,
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
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Machineries/ServiceHistory/${this.config.data.id}`;
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
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
