import { ApprovalRuleDto } from "./approval-rules.dto";
import { SelectItemDto } from "../../../../../core/interfaces/select-item.dto";

export interface ApprovalMatrixDto {
  approverRoles: SelectItemDto[];
  targetRoles: SelectItemDto[];
  rules: ApprovalRuleDto[];
}
