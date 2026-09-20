export interface EmployeeBeneficiaryDTO {
  id: string;
  employeeId: string;
  fullName: string;
  phoneNumber: string;
  relation: number | null;
  relationName: string;
}

export interface EmployeeBeneficiaryAddOrEditDTO {
  id?: string;
  employeeId: string;
  fullName: string;
  phoneNumber: string;
  relation: number | null;
}