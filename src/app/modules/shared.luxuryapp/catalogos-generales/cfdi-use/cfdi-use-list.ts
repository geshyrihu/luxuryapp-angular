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
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { addIcons } from "ionicons";
import { receiptOutline } from "ionicons/icons";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { CfdiUseForm } from "./cfdi-use-form";
import { CfdiUseDto } from "./interfaces/cfdi-use.dto";
@Component({
  selector: "app-cfdi-use-list",
  templateUrl: "./cfdi-use-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    PrimeNgCustomTableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
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
export class CfdiUseList implements OnInit {
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<CfdiUseDto[]>([]);
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ receiptOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS
      .onGetList<CfdiUseDto[]>(Endpoints.Catalogs.CfdiUses.getAll)
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.CfdiUses.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(CfdiUseForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

