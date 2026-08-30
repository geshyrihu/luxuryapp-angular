import { ChangeDetectionStrategy, Component, effect, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { LegalEmployeeService, type LegalEmployeeDTO } from "./legal-employee.service";

@Component({
  selector: "app-legal-staff-board",
  templateUrl: "./legal-staff-board.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule,
    LxAvatar,
    LxTag,
    AppIcon,
    LxTooltipDirective,
    WebButtonIconItem,
    PrimeNgCustomTableEmptyMessage,
  ],
})
export class LegalStaffBoard {
  private legalEmployeeS = inject(LegalEmployeeService);
  private router = inject(Router);

  readonly employees = this.legalEmployeeS.employeesByDepartment;
  readonly loading = this.legalEmployeeS.loading;

  constructor() {
    effect(() => {
      this.legalEmployeeS.loadActiveEmployees();
    });
  }

  onViewFile(employee: LegalEmployeeDTO): void {
    this.router.navigateByUrl(`/recursos-humanos/employee-files/${employee.employeeId}`);
  }

  onManageContract(employee: LegalEmployeeDTO): void {
    this.router.navigateByUrl(
      `/recursos-humanos/contracts?employeeId=${employee.employeeId}`,
    );
  }

  onManageAddendums(employee: LegalEmployeeDTO): void {
    this.router.navigateByUrl(
      `/recursos-humanos/contract-addendums?employeeId=${employee.employeeId}`,
    );
  }
}
