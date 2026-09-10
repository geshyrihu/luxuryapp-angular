import { ApprovalScope } from "./approval-rules.enum";

export interface ApprovalRuleDto {
  approverRole: string;
  targetRole: string;
  approvalScope: ApprovalScope;
}
