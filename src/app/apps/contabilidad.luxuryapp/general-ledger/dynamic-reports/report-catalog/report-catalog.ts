import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { LxTag } from "@ui/adaptive/tag/tag";
import type { TabItem } from "@ui/base/tabs.base";
import {
  WebButtonLabelAdd,
  WebButtonLabelDelete,
  WebButtonLabelEdit,
} from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { Table, TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";
import { IReportDefinitionList } from "../interfaces/report-definition.interface";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";

@Component({
  selector: "app-report-catalog",
  imports: [
    LxTooltipDirective,
    WebButtonIcon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    CommonModule,
    RouterModule,
    TableModule,
    LxTabs,
    WebButtonLabelAdd,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    DataViewMobile,
    LxTag,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./report-catalog.html",
})
export class ReportCatalog implements OnInit {
  private api = inject(ApiResponseService);
  private router = inject(Router);
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

  catalogTabs = signal<TabItem[]>([
    { id: "0", label: "Mis reportes" },
    { id: "1", label: "Plantillas" },
  ]);
  activeTab = signal<string>("0");

  onTabChange(tab: TabItem) {
    this.activeTab.set(tab.id);
  }

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

  async eliminar(id: string) {
    await this.api.onDelete(Endpoints.DynamicReports.delete(id));
    this.cargar();
  }
}
