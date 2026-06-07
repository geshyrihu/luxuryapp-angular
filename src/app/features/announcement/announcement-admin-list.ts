import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import {
  IonButtonDelete,
  IonButtonEdit,
  IonButtonItem,
} from "src/app/core/components/buttons/mobile";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AnnouncementAdminForm } from "./announcement-admin-form";
import { IAnnouncementAdminList } from "./announcement.model";
@Component({
  selector: "app-announcement-admin-list",
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TableModule,
    SelectModule,
    CustomButton,
    CustomButtonDownload,
    TagModule,
    TooltipModule,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    AppIcon,
    IonItem,
    IonLabel,
    IonButtonDelete,
    IonButtonEdit,
    IonButtonItem,
  ],
  templateUrl: "./announcement-admin-list.html",
})
export class AnnouncementAdminList implements OnInit {
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
    this.router.navigate(["/announcements/detail", id]);
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
