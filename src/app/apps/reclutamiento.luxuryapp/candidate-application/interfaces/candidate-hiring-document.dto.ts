export interface CandidateHiringDocumentDto {
  id: string;
  employeeId: string;
  documentCatalogId: string;
  documentTypeName: string;
  isMandatory: boolean;
  fileName: string;
  fileUrl: string;
  isSubmitted: boolean;
  submittedAt?: string | null;
  isValidated: boolean;
  validatedAt?: string | null;
  validatedByUserId?: string | null;
  validatedByUserName?: string | null;
  validationNotes?: string | null;
}
