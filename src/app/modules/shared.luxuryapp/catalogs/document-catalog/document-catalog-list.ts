import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { DocumentCatalogListDesktop } from "./desktop/document-catalog-list-desktop";
import { DocumentCatalogForm } from "./document-catalog-form";
import { DocumentCatalogDto } from "./interfaces/document-catalog.dto";
import { DocumentCatalogListMobile } from "./mobile/document-catalog-list-mobile";

@Component({
  selector: "app-document-catalog-list",
  templateUrl: "./document-catalog-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocumentCatalogListDesktop, DocumentCatalogListMobile],
})
export class DocumentCatalogList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);

  dataSignal = signal<DocumentCatalogDto[]>([]);
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  loading = signal(true);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<DocumentCatalogDto[]>(Endpoints.Catalogs.DocumentCatalog.getAll)
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onRowReorder(event: { dragIndex: number; dropIndex: number }) {
    const reordered = [...this.dataSignal()];
    const [moved] = reordered.splice(event.dragIndex, 1);
    if (!moved) return;
    reordered.splice(event.dropIndex, 0, moved);
    this.dataSignal.set(reordered);
    const orderedIds = reordered.map((item) => item.id);
    this.apiResponseS.onPut(Endpoints.Catalogs.DocumentCatalog.updateOrder, {
      orderedIds,
    });
  }
}
