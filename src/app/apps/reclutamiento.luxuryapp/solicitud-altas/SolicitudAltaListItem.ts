export interface SolicitudAltaListItem {
  id: string;
  employeeId: string;
  candidateId?: string;
  candidateProcessId?: string;
  positionRequestId?: string;
  folio: string;
  folioVacante: string;
  requestDate: string;
  nameCustomer: string;
  nameEmployee: string;
  personActual?: string;
  applicationRole?: string;
  profession?: string;
  status: string;
  isEmployeeLinked: boolean;
  executionDate: string;
}
