import {
  ChangeDetectionStrategy,
  Component,
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
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
@Component({
  selector: "app-task-read-list",
  templateUrl: "./task-read-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon],
})
export class TaskReadList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ticketMessageId: any = this.config.data.id;
  data: any[] = [];

  globalFilterFields: string[] = [];
  loading = signal(true);
  tableRows: number = tableRows();
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
