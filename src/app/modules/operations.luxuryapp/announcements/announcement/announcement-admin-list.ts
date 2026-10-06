import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AnnouncementAdminForm } from "./announcement-admin-form";
import { IAnnouncementAdminList } from "./announcement.model";
import { AnnouncementAdminListDesktop } from "./desktop/announcement-admin-list-desktop";
import { AnnouncementAdminListMobile } from "./mobile/announcement-admin-list-mobile";

@Component({
  selector: "app-announcement-admin-list",
  imports: [AnnouncementAdminListDesktop, AnnouncementAdminListMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./announcement-admin-list.html",
})
export class AnnouncementAdminList implements OnInit {
  readonly ROUTES = ROUTES;
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  private router = inject(Router);

  dataSignal = signal<IAnnouncementAdminList[]>([]);
  loading = signal(true);
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
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este comunicado?",
    );
    if (!confirmed) return;
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
