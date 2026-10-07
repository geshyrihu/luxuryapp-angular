import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import type { TabItem } from "@ui/core/tabs.base";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ROUTES } from "src/app/routing/route-paths";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { IReportDefinitionList } from "../interfaces/report-definition.interface";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";

@Component({
  selector: "app-report-catalog",
  imports: [
    LxTooltipDirective,
    ApiDatePipe,
    RouterModule,
    AppTable,
    LxTabs,
    ButtonWeb,
    LuxDataViewMobile,
    LxTag,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./report-catalog.html",
})
export class ReportCatalog implements OnInit {
  private api = inject(ApiResponseService);
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private confirmS = inject(ConfirmService);

  dt = viewChild<AppTable>("table");

  propios = signal<IReportDefinitionList[]>([]);
  plantillas = signal<IReportDefinitionList[]>([]);
  loading = signal(false);

  rows = tableRows();
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
    const report = this.propios().find((r) => r.id === id);
    const confirmed = await this.confirmS.confirm(
      `Eliminar el reporte "${report?.name ?? ""}"?`,
    );
    if (!confirmed) return;
    await this.api.onDelete(Endpoints.DynamicReports.delete(id));
    this.cargar();
  }
}
