export interface RequestEmployeeRegisterGetByIdDTO {
  id: any;
  folio: number;
  positionRequestId: any;
  requestDate: string;
  executionDate: string;
  typeContractRegister: number;
  status: number;
  applicationUserId: string;
  confirmationFinish: boolean;
  employeeId: any;
  employee: {
    user: {
      fullName: string;
    };
  };
}









