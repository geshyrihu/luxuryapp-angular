import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, viewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { Table, TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import {
  CustomButton,
  CustomButtonAdd,
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/buttons/web";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IReportDefinitionList } from "../../models/report-definition.interface";

@Component({
  selector: "app-report-catalog",
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    TabsModule,
    TagModule,
    ConfirmDialogModule,
    CustomButtonAdd,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButton,
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
    this.router.navigate(["/contabilidad/reportes/nuevo"]);
  }

  editar(id: string) {
    this.router.navigate(["/contabilidad/reportes/editar", id]);
  }

  ver(id: string) {
    this.router.navigate(["/contabilidad/reportes/ver", id]);
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
