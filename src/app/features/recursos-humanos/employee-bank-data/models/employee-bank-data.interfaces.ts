export interface EmployeeBankDataDTO {
  id: string;
  employeeId: string;
  employeeName: string;
  numberEmployee: string;
  bankId: string;
  bankName: string;
  bankAccount: string;
  bankKey: string;
  nameContact: string;
  phoneNumber: string;
  relacion: number | null;
  relacionName: string;
}

export interface EmployeeBankDataAddOrEditDTO {
  id?: string;
  employeeId: string;
  bankId: string;
  bankAccount: string;
  bankKey: string;
  nameContact: string;
  phoneNumber: string;
  relacion: number | null;
}
