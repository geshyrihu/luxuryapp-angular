export interface IEmployeeBankData {
  id: string;
  employeeId: string;
  employeeName: string;
  numberEmployee: number | null;
  bankId: string;
  bankName: string;
  bankAccount: string;
  bankKey: string;
  nameContact: string;
  phoneNumber: string;
  relacion: number | null;
  relacionName: string;
}

export interface IEmployeeBankDataForm {
  id: string;
  employeeId: string;
  bankId: string | null;
  bankAccount: string;
  bankKey: string;
  nameContact: string;
  phoneNumber: string;
  relacion: number | null;
}
