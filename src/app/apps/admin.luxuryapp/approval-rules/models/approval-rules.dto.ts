export enum ApprovalScope {
    None = 0,
    SameCustomer = 1,
    Global = 2,
}

export interface ApprovalRuleDto {
    approverRole: string;
    targetRole: string;
    approvalScope: ApprovalScope;
}

export interface SelectItem {
    value: string;
    label: string;
    sortOrder: number;
}

export interface ApprovalMatrixDto {
    approverRoles: SelectItem[];
    targetRoles: SelectItem[];
    rules: ApprovalRuleDto[];
}

export interface UpdateApprovalRulesDto {
    rules: ApprovalRuleDto[];
}








