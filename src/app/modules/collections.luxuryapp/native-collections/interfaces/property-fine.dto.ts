import { EFineStatus } from "./enums";

export interface RegulationArticleResponseDTO {
  id: string;
  customerId: string;
  articleNumber: string;
  title: string;
  content: string;
  defaultFineAmount: number | null;
  isActive: boolean;
}

export interface CreateRegulationArticleDTO {
  customerId: string;
  articleNumber: string;
  title: string;
  content: string;
  defaultFineAmount: number | null;
  isActive: boolean;
}

export interface UpdateRegulationArticleDTO extends CreateRegulationArticleDTO {
  id: string;
}

export interface FineEvidenceResponseDTO {
  id: string;
  fileName: string;
  contentType: string;
  storagePath: string;
  fileSizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface PropertyFineResponseDTO {
  id: string;
  customerId: string;
  propertyId: string;
  propertyFullName: string;
  regulationArticleId: string | null;
  regulationArticleTitle: string | null;
  regulationArticleNumber: string | null;
  description: string;
  infractionDate: string;
  amount: number;
  status: EFineStatus;
  issuedBy: string;
  issuedAt: string;
  adminNotes: string | null;
  chargeId: string | null;
  evidences: FineEvidenceResponseDTO[];
}

export interface CreatePropertyFineDTO {
  customerId: string;
  propertyId: string;
  regulationArticleId: string | null;
  description: string;
  infractionDate: string;
  amount: number;
  adminNotes: string | null;
}

export interface UpdatePropertyFineDTO {
  id: string;
  regulationArticleId: string | null;
  description: string;
  infractionDate: string;
  amount: number;
  adminNotes: string | null;
}

export interface IssueFineChargeDTO {
  fineId: string;
  dueDate: string;
}
