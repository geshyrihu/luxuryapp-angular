import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
@Component({
  selector: "app-task-read-list",
  templateUrl: "./task-read-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,TableModule, ],
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
