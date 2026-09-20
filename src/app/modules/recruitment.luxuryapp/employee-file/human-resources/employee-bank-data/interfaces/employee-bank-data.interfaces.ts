export interface EmployeeBankDataDTO {
  id: string;
  employeeId: string;
  employeeName: string;
  numberEmployee: string;
  bankId: string;
  bankName: string;
  bankAccount: string;
  bankKey: string;
}

export interface EmployeeBankDataAddOrEditDTO {
  id?: string;
  employeeId: string;
  bankId: string;
  bankAccount: string;
  bankKey: string;
}