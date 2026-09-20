export interface DocumentCatalogDto {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
  isActive: boolean;
}

export interface DocumentCatalogAddOrEdit {
  name: string;
  description: string;
  isMandatory: boolean;
  isActive: boolean;
}
