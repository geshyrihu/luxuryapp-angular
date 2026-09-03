export interface IEmployeeBeneficiary {
  id: string;
  employeeId: string;
  employeeName: string;
  numberEmployee: number | null;
  fullName: string;
  phoneNumber: string;
  relation: number | null;
  relationName: string;
}

export interface IEmployeeBeneficiaryForm {
  id: string;
  employeeId: string;
  fullName: string;
  phoneNumber: string;
  relation: number | null;
}