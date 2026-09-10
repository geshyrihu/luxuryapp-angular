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
import { EmailDataFormDto } from "src/app/core/interfaces/email-data-form.interface";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
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
  dataSignal = signal<EmailDataFormDto[]>([]);

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
      .onGetList<EmailDataFormDto[]>(Endpoints.Catalogs.EmailData.getAll)
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }
  onModalForm(data: Partial<EmailDataFormDto & { title: string }>) {
    this.dialogHandlerS
      .openDialog(EmailDataForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onSendTestEmail(id: string) {
    this.apiResponseS.onPost(
      Endpoints.Catalogs.EmailData.sendTestEmail(id),
      null,
    );
  }
}
