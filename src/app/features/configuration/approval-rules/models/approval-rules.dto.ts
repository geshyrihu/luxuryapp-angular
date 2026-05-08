export enum ApprovalScope {
    None = 0,
    SameCustomer = 1,
    Global = 2,
}

export interface IApprovalRuleDTO {
    approverRole: string;
    targetRole: string;
    approvalScope: ApprovalScope;
}

export interface ISelectItem {
    value: string;
    label: string;
    sortOrder: number;
}

export interface IApprovalMatrixDTO {
    approverRoles: ISelectItem[];
    targetRoles: ISelectItem[];
    rules: IApprovalRuleDTO[];
}

export interface IUpdateApprovalRulesDTO {
    rules: IApprovalRuleDTO[];
}








