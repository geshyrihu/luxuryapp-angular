import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { DialogSize } from "src/app/core/enums/dialog-size";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SanctionTypeListDTO } from "../models/hr-catalog.interfaces";
import { SanctionTypeForm } from "./sanction-type-form";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

@Component({
  selector: "app-sanction-type-list",
  templateUrl: "./sanction-type-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,

    IonItem,
    IonLabel,
  ],
})
export class SanctionTypeList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);

  items = signal<SanctionTypeListDTO[]>([]);
  globalFilter = signal<string>("");
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly globalFilterFields = globalFilterFields(["name", "severityLevel"]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<SanctionTypeListDTO[]>(Endpoints.Settings.sanctionTypes)
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogS
      .openDialog(SanctionTypeForm, data, data.title, DialogSize.sm)
      .then(() => this.onLoadData());
  }

  onDelete(id: string): void {
    this.apiS
      .onDelete(Endpoints.Settings.deleteSanctionType(id))
      .then(() => this.onLoadData());
  }
}
