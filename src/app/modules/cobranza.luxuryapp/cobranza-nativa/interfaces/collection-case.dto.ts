export interface CollectionActivityDTO {
  id: string;
  activityDate: string;
  notes: string;
  promisedDate: string | null;
  actionBy: string;
}

export interface CollectionCaseResponseDTO {
  id: string;
  customerId: string;
  propertyId: string;
  propertyName: string;
  totalOwed: number;
  agingBucket: string;
  assignedTo: string;
  status: string;
  lastContactAt: string | null;
  activities: CollectionActivityDTO[];
}

export interface CreateCollectionCaseDTO {
  customerId: string;
  propertyId: string;
  totalOwed: number;
  agingBucket: number;
  assignedTo: string | null;
  status: number;
}

export interface LogCollectionActivityDTO {
  caseId: string;
  notes: string;
  promisedDate: string | null;
}
