import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
@Component({
  selector: "app-task-read-list",
  templateUrl: "./task-read-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon, TableModule],
})
export class TaskReadList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ticketMessageId: any = this.config.data.id;
  data: any[] = [];

  globalFilterFields: string[] = [];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.TaskReads.listByTicketMessage(this.ticketMessageId))
      .then((result: any) => {
        this.data = result;

        this.globalFilterFields = globalFilterFields(this.data);
      });
  }
}

