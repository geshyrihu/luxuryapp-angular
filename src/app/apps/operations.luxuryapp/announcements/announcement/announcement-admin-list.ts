import { ApiDatePipe } from "../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { SelectModule } from "@ui/web/primeng-select/primeng-select";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { AnnouncementAdminForm } from "./announcement-admin-form";
import { IAnnouncementAdminList } from "./announcement.model";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

@Component({
  selector: "app-announcement-admin-list",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonIconDownload,
    WebButtonIconItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    ApiDatePipe,
    RouterModule,
    ReactiveFormsModule,
    TableModule,
    SelectModule,
    WebButtonLabel,

    LxTag,
    LxTooltipDirective,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    AppIcon,
    CustomInputSelectSignal,
    MobileListItem,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./announcement-admin-list.html",
})
export class AnnouncementAdminList implements OnInit {
  readonly ROUTES = ROUTES;
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router); // Inyectar Router

  dataSignal = signal<IAnnouncementAdminList[]>([]);
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  statusControl = new FormControl<string>("");
  typeControl = new FormControl<string>("");

  statusOptions = signal<SelectItemDto[]>([
    { label: "Todos los estados", value: "" },
    { label: "Borrador", value: "Draft" },
    { label: "Publicado", value: "Published" },
    { label: "Archivado", value: "Archived" },
  ]);

  typeOptions = signal<SelectItemDto[]>([
    { label: "Todos los tipos", value: "" },
    { label: "General", value: "General" },
    { label: "Urgente", value: "Urgente" },
    { label: "Informativo", value: "Informativo" },
  ]);

  onFilterChange() {
    // To do: Implement local filtering logic or pipe to the table
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  async onLoadData() {
    this.loading.set(true);
    const urlApi = Endpoints.Announcements.adminList;
    const result =
      await this.apiResponseS.onGetList<IAnnouncementAdminList[]>(urlApi);
    this.dataSignal.set(result || []);
    this.loading.set(false);
  }

  async onDelete(id: string) {
    const urlApi = Endpoints.Announcements.delete(id);
    const response = await this.apiResponseS.onDelete(urlApi);
    if (response) {
      this.dataSignal.update((currentData) =>
        currentData.filter((item) => item.id !== id),
      );
    }
  }

  onDownloadPdf(id: string) {
    this.apiResponseS.onDownloadFile(
      Endpoints.Announcements.downloadPdf(id),
      `Comunicado-${id}.pdf`,
    );
  }

  onViewPreview(id: string): void {
    this.router.navigate(ROUTES.ANUNCIOS.DETALLE(id));
  }

  onViewAnalytics(id: string): void {
    this.router.navigate(ROUTES.ANUNCIOS.ANALITICA(id));
  }

  async onModalForm(data: any) {
    const result = await this.dialogHandlerS.openDialog(
      AnnouncementAdminForm,
      data,
      data.id ? "Editar Anuncio" : "Nuevo Anuncio",
      this.dialogHandlerS.sizeFull,
    );

    if (result) {
      this.onLoadData();
    }
  }
}
