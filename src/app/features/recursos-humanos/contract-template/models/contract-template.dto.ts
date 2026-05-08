export type EContractType = 'Indeterminado' | 'Determinado' | 'Temporal' | 'ObraDeterminada' | 'Practicas' | 'Outsourcing' | 'Honorarios';

export interface ContractTemplateListDTO {
  id: string;
  name: string;
  description?: string;
  contractType: EContractType;
  version: string;
  isActive: boolean;
  createdAt: string;
}

export interface ContractTemplateDetailDTO extends ContractTemplateListDTO {
  templateContent: string;
  availablePlaceholders?: string;
}

export interface ContractTemplateAddOrEditDTO {
  name: string;
  description?: string;
  contractType: EContractType;
  templateContent: string;
  version: string;
  isActive: boolean;
}
