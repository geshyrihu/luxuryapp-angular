import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectButton } from "@ui/inputs/web/custom-input-select-button-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ApprovalMatrixDto } from "./interfaces/approval-matrix.dto";
import { UpdateApprovalRulesDto } from "./interfaces/approval-rules-update.dto";
import { ApprovalRuleDto } from "./interfaces/approval-rules.dto";
import { ApprovalScope } from "./interfaces/approval-rules.enum";
@Component({
  selector: "app-approval-rules",
  templateUrl: "./approval-rules.html",
  styleUrls: ["./approval-rules.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    LxCard,
    TableModule,
    CustomInputSelectButton,
    LxSkeleton,
    AppIcon,
    WebButtonLabelSave,
  ],
})
export class ApprovalRules implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);

  loading = signal(true);
  saving = signal(false);

  rulesMatrix = signal<Map<string, Map<string, ApprovalScope>>>(new Map());

  approverRoles = signal<string[]>([]);
  targetRoles = signal<string[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  readonly scopeOptions = [
    {
      label: "N/A",
      value: ApprovalScope.None,
      icon: "mdi:block-helper",
      class: "opt-none",
    },
    {
      label: "Cliente",
      value: ApprovalScope.SameCustomer,
      icon: "mdi:account-group",
      class: "opt-cliente",
    },
    {
      label: "Global",
      value: ApprovalScope.Global,
      icon: "mdi:earth",
      class: "opt-global",
    },
  ];

  ngOnInit(): void {
    this.loadMatrix();
  }

  loadMatrix(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<ApprovalMatrixDto>(Endpoints.ApprovalRules.matrix)
      .then((data) => {
        if (!data || !data.approverRoles || !data.targetRoles || !data.rules) {
          this.loading.set(false);
          return;
        }

        // Ordenar roles por 'sortOrder' y luego extraer los nombres (label)
        const approverRoleNames = data.approverRoles
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((r) => r.label);
        const targetRoleNames = data.targetRoles
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((r) => r.label);

        this.approverRoles.set(approverRoleNames);
        this.targetRoles.set(targetRoleNames);

        console.log("Roles Aprobadores para la tabla:", this.approverRoles());
        console.log("Roles Solicitantes para la tabla:", this.targetRoles());

        const matrix = new Map<string, Map<string, ApprovalScope>>();
        for (const approver of approverRoleNames) {
          matrix.set(approver, new Map<string, ApprovalScope>());
        }

        for (const rule of data.rules) {
          if (matrix.has(rule.approverRole)) {
            matrix
              .get(rule.approverRole)!
              .set(rule.targetRole, rule.approvalScope);
          }
        }

        this.rulesMatrix.set(matrix);
        console.log("Matriz de reglas construida:", this.rulesMatrix());

        this.loading.set(false);
      })
      .catch(() => this.loading.set(false));
  }

  getScope(approver: string, target: string): ApprovalScope {
    const approverMap = this.rulesMatrix().get(approver);
    return approverMap?.get(target) || ApprovalScope.None;
  }

  onRuleChange(approver: string, target: string, scope: ApprovalScope): void {
    this.rulesMatrix.update((matrix) => {
      const approverMap = matrix.get(approver);
      if (approverMap) {
        if (scope === ApprovalScope.None) {
          approverMap.delete(target);
        } else {
          approverMap.set(target, scope);
        }
      }
      return matrix;
    });
  }

  onSave(): void {
    this.saving.set(true);
    const rulesToSave: ApprovalRuleDto[] = [];
    const matrix = this.rulesMatrix();

    for (const [approver, targets] of matrix.entries()) {
      for (const [target, scope] of targets.entries()) {
        rulesToSave.push({
          approverRole: approver,
          targetRole: target,
          approvalScope: scope,
        });
      }
    }

    const dto: UpdateApprovalRulesDto = { rules: rulesToSave };

    this.apiResponseS
      .onPut(Endpoints.ApprovalRules.matrix, dto)
      .finally(() => this.saving.set(false));
  }
}
