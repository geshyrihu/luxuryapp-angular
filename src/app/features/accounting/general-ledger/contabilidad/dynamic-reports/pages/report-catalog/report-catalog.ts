import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, viewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { Table, TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import {
  WebButtonLabel,
  WebButtonLabelAdd,
  WebButtonLabelDelete,
  WebButtonLabelEdit,
} from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IReportDefinitionList } from "../../models/report-definition.interface";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-report-catalog",
  imports: [
    TooltipModule,
    WebButtonIcon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    CommonModule,
    RouterModule,
    TableModule,
    TabsModule,
    TagModule,
    ConfirmDialogModule,
    WebButtonLabelAdd,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabel,
    DataViewMobile,
  ],
  providers: [ConfirmationService],
  templateUrl: "./report-catalog.html",
})
export class ReportCatalog implements OnInit {
  private api = inject(ApiResponseService);
  private router = inject(Router);
  private confirmS = inject(ConfirmationService);
  private customerIdS = inject(CustomerIdService);

  dt = viewChild<Table>("table");

  propios = signal<IReportDefinitionList[]>([]);
  plantillas = signal<IReportDefinitionList[]>([]);
  loading = signal(false);

  rows = tablePrimeNgRows();
  rowsPerPage = rowsPerPageOptions();
  globalFilterFields = [
    "name",
    "description",
    "visualizationType",
    "dataSource",
  ];

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading.set(true);
    const customerId = this.customerIdS.customerId();
    const [propios, plantillas] = await Promise.all([
      this.api.onGetItem<IReportDefinitionList[]>(
        Endpoints.DynamicReports.getByCustomer(customerId!),
      ),
      this.api.onGetItem<IReportDefinitionList[]>(
        Endpoints.DynamicReports.getTemplates,
      ),
    ]);
    if (propios) this.propios.set(propios);
    if (plantillas) this.plantillas.set(plantillas);
    this.loading.set(false);
  }

  crear() {
    this.router.navigate(ROUTES.CONTABILIDAD.REPORTE_NUEVO);
  }

  editar(id: string) {
    this.router.navigate(ROUTES.CONTABILIDAD.REPORTE_EDITAR(id));
  }

  ver(id: string) {
    this.router.navigate(ROUTES.CONTABILIDAD.REPORTE_VER(id));
  }

  confirmarEliminar(id: string, nombre: string) {
    this.confirmS.confirm({
      message: `Eliminar el reporte "${nombre}"?`,
      header: "Confirmar eliminacion",
      icon: "mdi:delete",
      accept: () => this.eliminar(id),
    });
  }

  private async eliminar(id: string) {
    await this.api.onDelete(Endpoints.DynamicReports.delete(id));
    this.cargar();
  }
}
