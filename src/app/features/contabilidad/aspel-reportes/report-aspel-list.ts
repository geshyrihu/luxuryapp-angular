import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { TreeNode } from "primeng/api";
import { CardModule } from "primeng/card";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { TreeTableModule } from "primeng/treetable";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-report-aspel-list",
  templateUrl: "./report-aspel-list.html",
  imports: [
    CommonModule,
    TableModule,
    ProgressSpinnerModule,
    TreeTableModule,
    CardModule,
  ],
})
export class ReportAspelList {
  apiResponseS = inject(ApiResponseService);
  customerIdService = inject(CustomerIdService);
  loading = signal(true);
  incomeStatementMantenimiento = signal<any>(null);
  incomeStatementProyectos = signal<any>(null);
  budgetExecutionMantenimiento = signal<TreeNode[]>([]);
  budgetExecutionProyectos = signal<TreeNode[]>([]);
  apBalances = signal<any>(null);
  currentCustomerId = computed(() => this.customerIdService.customerId());

  currentYear = new Date().getFullYear();
  visibleMonths: string[] = [];

  private allMonthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  constructor() {
    this.setVisibleMonths();
    effect(() => {
      const customerId = this.customerIdService.customerId();
      if (customerId) {
        // Changed from !== 0 to truthy check (non-empty string)
        this.loadAllReports(customerId);
      }
    });
  }

  setVisibleMonths() {
    const currentMonthIndex = new Date().getMonth(); // 0 = Enero, 1 = Febrero, etc.
    this.visibleMonths = this.allMonthNames.slice(0, currentMonthIndex + 1);
  }

  async loadAllReports(customerId: string) {
    this.loading.set(true);

    const incomeMntoUrl = `repor-aspel/income-statement?customerId=${customerId}&intYear=${this.currentYear}&reportType=mantenimiento`;
    const incomeProyUrl = `repor-aspel/income-statement?customerId=${customerId}&intYear=${this.currentYear}&reportType=proyectos`;
    const budgetMntoUrl = `repor-aspel/budget-execution?customerId=${customerId}&intYear=${this.currentYear}&reportType=mantenimiento`;
    const budgetProyUrl = `repor-aspel/budget-execution?customerId=${customerId}&intYear=${this.currentYear}&reportType=proyectos`;
    const apUrl = `repor-aspel/ap-balances?customerId=${customerId}&intYear=${this.currentYear}`;

    const [
      incomeMntoResult,
      incomeProyResult,
      budgetMntoResult,
      budgetProyResult,
      apResult,
    ] = await Promise.all([
      this.apiResponseS.onGetList(incomeMntoUrl),
      this.apiResponseS.onGetList(incomeProyUrl),
      this.apiResponseS.onGetList(budgetMntoUrl),
      this.apiResponseS.onGetList(budgetProyUrl),
      this.apiResponseS.onGetList(apUrl),
    ]);

    this.incomeStatementMantenimiento.set(incomeMntoResult);
    this.incomeStatementProyectos.set(incomeProyResult);
    this.budgetExecutionMantenimiento.set(
      this.transformToTreeNodes((budgetMntoResult as any[]) || []),
    );
    this.budgetExecutionProyectos.set(
      this.transformToTreeNodes((budgetProyResult as any[]) || []),
    );
    this.apBalances.set(apResult);

    this.loading.set(false);
  }

  transformToTreeNodes(items: any[]): TreeNode[] {
    return items.map((item) => {
      const node: TreeNode = {
        data: item,
        children: item.subAccounts
          ? this.transformToTreeNodes(item.subAccounts)
          : [],
        expanded: true, // Opcional: expandir todos los nodos por defecto
      };
      return node;
    });
  }
}









