import { DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CredentialDetailDTO } from "../models/password.dto";
import { PasswordForm } from "./password-form";

@Component({
  selector: "app-password-list",
  templateUrl: "./password-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonItem,
    IonLabel,
    DatePipe,
  ],
})
export class PasswordList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  // Signals para datos y estado
  data = signal<CredentialDetailDTO[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  // Opciones de tabla
  rows = tablePrimeNgRows();
  rowsPerPage = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  // Filtro actual
  lastLoadEvent: TableLazyLoadEvent | null = null;

  ngOnInit(): void {
    // La primera carga la dispara el evento (onLazyLoad) de p-table
  }

  async loadData(event: TableLazyLoadEvent) {
    this.lastLoadEvent = event;
    this.loading.set(true);

    const filter = {
      page: event.first! / event.rows! + 1,
      pageSize: event.rows,
      search: event.globalFilter || "",
    };

    const res = await this.apiS.onPostPaged<CredentialDetailDTO[]>(
      Endpoints.PasswordManager.Credentials.getPaged,
      filter,
    );

    if (res) {
      this.data.set(res.data);
      this.totalRecords.set(res.totalCount || 0);
    }
    this.loading.set(false);
  }

  async onDelete(id: string) {
    const success = await this.apiS.onDelete(
      Endpoints.PasswordManager.Credentials.delete(id),
    );
    if (success && this.lastLoadEvent) {
      this.loadData(this.lastLoadEvent);
    }
  }

  async onModalForm(id?: string) {
    const result = await this.dialogS.openDialog<boolean>(
      PasswordForm,
      { id },
      id ? "Editar Credencial" : "Nueva Credencial",
      this.dialogS.sizeMd,
    );

    if (result && this.lastLoadEvent) {
      this.loadData(this.lastLoadEvent);
    }
  }
}
