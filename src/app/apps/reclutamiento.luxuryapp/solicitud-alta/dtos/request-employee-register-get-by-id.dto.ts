export interface RequestEmployeeRegisterGetByIdDTO {
  id: string;
  folio: number;
  positionRequestId: string;
  requestDate: string;
  executionDate: string;
  typeContractRegister: number;
  status: number;
  applicationUserId: string;
  confirmationFinish: boolean;
  employeeId: string;
  employee: {
    user: {
      fullName: string;
    };
  };
}









