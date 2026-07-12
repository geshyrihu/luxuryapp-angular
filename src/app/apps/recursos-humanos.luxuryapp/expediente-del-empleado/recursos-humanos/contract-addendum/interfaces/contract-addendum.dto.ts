export type EAddendumType =
  | 'ModificacionSalario'
  | 'CambioPuesto'
  | 'CambioDepartamento'
  | 'CambioUbicacion'
  | 'ExtensionContrato'
  | 'ModificacionJornada'
  | 'ClausulaAdicional'
  | 'OtrasCondiciones';

export type EAddendumStatus = 'Borrador' | 'Pendiente' | 'Firmado' | 'Cancelado';

export interface ContractAddendumListDTO {
  id: string;
  addendumNumber: string;
  addendumType: EAddendumType;
  title: string;
  addendumStatus: EAddendumStatus;
  effectiveDate: string;
  signedDate?: string;
  createdAt: string;
}

export interface ContractAddendumDetailDTO extends ContractAddendumListDTO {
  workContractId: string;
  employeeName: string;
  content: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
  addendumTemplateId?: string;
}

export interface ContractAddendumAddOrEditDTO {
  workContractId: string;
  addendumType: EAddendumType;
  title: string;
  content: string;
  effectiveDate: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
  addendumTemplateId?: string;
}

export interface ContractAddendumSignDTO {
  signedDate: string;
}
