import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { addIcons } from "ionicons";
import {
  clipboardOutline,
  createOutline,
  refreshOutline,
} from "ionicons/icons";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { Endpoints } from "src/app/core/constants/endpoints";
import { CustomButtonItem } from "src/app/core/components/buttons/web";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonTracking } from "src/app/core/components/buttons/web/custom-button-tracking";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TicketLegalActualizarEstado } from "./ticket-legal-actualizar-estado";
import { TicketLegalEditar } from "./ticket-legal-editar";
import { TicketLegalForm } from "./ticket-legal-form";
import { TicketLegalSeguimiento } from "./ticket-legal-seguimiento";
import { TicketLegalSeguimientoSolicitudDetalle } from "./ticket-legal-seguimiento-solicitud-detalle";

@Component({
  selector: "app-ticket-legal-lista",
  templateUrl: "./ticket-legal-lista.html",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    TooltipModule,
    SelectModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    CustomButtonTracking,
    ActionMenu,
    DataViewMobile,
    CustomButtonItem,
  ],
})
export class TicketLegalLista implements OnInit {
  private dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  public aspRoleS = inject(AspRoleService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  isSuperUser = this.aspRoleS.hasRole(EApplicationRole.SuperUsuario);

  dataSignal = signal<any[]>([]);
  cb_customer = signal<ISelectItem[]>([]);
  selectedCustomerId = signal<string | undefined>(undefined);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  inputValue: string = "";
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({
      clipboardOutline,
      createOutline,
      refreshOutline,
    });
  }

  ngOnInit() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.customersActiveNameShort)
      .then((result: any) => this.cb_customer.set(result ?? []));
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList(Endpoints.Tasks.legalAll(this.selectedCustomerId()))
      .then((result: any) => {
        this.dataSignal.set(result ?? []);
        this.loading.set(false);
      });
  }

  onCustomerFilter(customerId: string | undefined) {
    this.selectedCustomerId.set(customerId);
    this.onLoadData();
  }

  onModalEdit(data: any) {
    this.dialogHandlerS
      .openDialog(TicketLegalEditar, data, "", this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(TicketLegalForm, data, "", this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalUpdateStatus(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketLegalActualizarEstado,
        data,
        "",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalSeguimiento(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketLegalSeguimiento,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalViewDetail(data: any) {
    this.dialogHandlerS.openDialog(
      TicketLegalSeguimientoSolicitudDetalle,
      data,
      "",
      this.dialogHandlerS.sizeLg,
    );
  }
}
