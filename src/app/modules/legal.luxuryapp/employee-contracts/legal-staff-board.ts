import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from "@angular/core";
import { Router } from "@angular/router";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import {
  LegalEmployeeService,
  type LegalEmployeeDTO,
} from "./legal-employee.service";

@Component({
  selector: "app-legal-staff-board",
  templateUrl: "./legal-staff-board.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppTable,
    LxAvatar,
    LxTag,
    LxIcon,
    ButtonWeb,
    TableEmptyMessage],
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
    this.router.navigateByUrl(
      `/recruitment/employee-files/${employee.employeeId}`,
    );
  }

  onManageContract(employee: LegalEmployeeDTO): void {
    this.router.navigateByUrl(
      `/legal/contracts?employeeId=${employee.employeeId}`,
    );
  }

  onManageAddendums(employee: LegalEmployeeDTO): void {
    this.router.navigateByUrl(
      `/legal/contract-addendums?employeeId=${employee.employeeId}`,
    );
  }
}
