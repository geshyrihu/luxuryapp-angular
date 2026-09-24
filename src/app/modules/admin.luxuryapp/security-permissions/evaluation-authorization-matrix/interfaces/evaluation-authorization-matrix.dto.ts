export interface EvaluationAuthorizationTargetRoleDto {
  roleId: string;
  roleName: string;
  roleType: string;
}

export interface EvaluationAuthorizationMatrixDto {
  id: string;
  administratorRoleId: string;
  administratorRoleName: string;
  administratorRoleType: string;
  allowedScope: number;
  canCreate: boolean;
  canEdit: boolean;
  canDeactivate: boolean;
  canDelete: boolean;
  isActive: boolean;
  targetRoles: EvaluationAuthorizationTargetRoleDto[];
}

export interface EvaluationAuthorizationMatrixWriteDto {
  administratorRoleId: string;
  allowedScope: number;
  canCreate: boolean;
  canEdit: boolean;
  canDeactivate: boolean;
  canDelete: boolean;
  targetRoleIds: string[];
}
