import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";

import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelSendEmail } from "@ui/buttons/mobile-label/button-send-email";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconSendEmail } from "@ui/buttons/web-icon/button-send-email";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { EmailDataForm } from "./email-data-form";
@Component({
  selector: "app-email-data-list",
  templateUrl: "./email-data-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonIconEdit,
    WebButtonIconSendEmail,
    MobileButtonLabelEdit,
    MobileButtonLabelSendEmail,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileActionMenu,
    MobileListItem,
  ],
})
export class EmailDataList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.EmailData.getAll)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(EmailDataForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onSendTestEmail(id: string) {
    this.apiResponseS.onPost(Endpoints.EmailData.sendTestEmail(id), null);
  }
}
