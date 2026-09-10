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
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { DocumentCatalogDto } from "./interfaces/document-catalog.dto";
import { DocumentCatalogForm } from "./document-catalog-form";

@Component({
  selector: "app-document-catalog-list",
  templateUrl: "./document-catalog-list.html",
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
export class DocumentCatalogList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<DocumentCatalogDto[]>([]);

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
      .onGetList<DocumentCatalogDto[]>(
        Endpoints.Catalogs.DocumentCatalog.getAll,
      )
      .then((result) => {
        if (result) this.dataSignal.set(result);
      })
      .finally(() => this.loading.set(false));
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.DocumentCatalog.delete(id))
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        DocumentCatalogForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onRowReorder(event: { dragIndex: number; dropIndex: number }) {
    const orderedIds = this.dataSignal().map((item) => item.id);
    this.apiResponseS.onPut(
      Endpoints.Catalogs.DocumentCatalog.updateOrder,
      { orderedIds },
    );
  }
}
