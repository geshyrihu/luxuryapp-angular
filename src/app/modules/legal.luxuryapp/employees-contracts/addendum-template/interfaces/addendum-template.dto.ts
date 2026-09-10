export type EAddendumType = 'ModificacionSalarial' | 'CambioPuesto' | 'Extension' | 'ModificacionHorario' | 'Otro';

export interface AddendumTemplateListDTO {
  id: string;
  name: string;
  description?: string;
  addendumType: EAddendumType;
  version: string;
  isActive: boolean;
  createdAt: string;
}

export interface AddendumTemplateAddOrEditDTO {
  name: string;
  description?: string;
  addendumType: EAddendumType;
  templateContent: string;
  version: string;
  isActive: boolean;
}
