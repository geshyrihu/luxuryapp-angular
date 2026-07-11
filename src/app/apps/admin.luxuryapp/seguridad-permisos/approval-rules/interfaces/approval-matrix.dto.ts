import { ApprovalRuleDto } from "./approval-rules.dto";
import { SelectItem } from "./select-item.interface";

export interface ApprovalMatrixDto {
  approverRoles: SelectItem[];
  targetRoles: SelectItem[];
  rules: ApprovalRuleDto[];
}
