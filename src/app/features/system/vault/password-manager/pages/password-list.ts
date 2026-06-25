import { EmptyState } from "src/app/core/components/empty-state/empty-state";
import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
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
    EmptyState,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
    CustomButtonDelete,
    CustomButtonEdit,
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
      page: (event.first! / event.rows!) + 1,
      pageSize: event.rows,
      search: event.globalFilter || "",
    };

    const res = await this.apiS.onPostPaged<CredentialDetailDTO[]>(
      Endpoints.PasswordManager.Credentials.getPaged,
      filter
    );

    if (res) {
      this.data.set(res.data);
      this.totalRecords.set(res.totalCount || 0);
    }
    this.loading.set(false);
  }

  async onDelete(id: string) {
    const success = await this.apiS.onDelete(Endpoints.PasswordManager.Credentials.delete(id));
    if (success && this.lastLoadEvent) {
      this.loadData(this.lastLoadEvent);
    }
  }

  async onModalForm(id?: string) {
    const result = await this.dialogS.openDialog<boolean>(
      PasswordForm,
      { id },
      id ? "Editar Credencial" : "Nueva Credencial",
      this.dialogS.sizeMd
    );

    if (result && this.lastLoadEvent) {
      this.loadData(this.lastLoadEvent);
    }
  }
}
