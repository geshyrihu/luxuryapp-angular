export interface RecruitmentSourceCatalogDTO {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface RecruitmentSourceCatalogAddOrEdit {
  name: string;
  isActive: boolean;
}