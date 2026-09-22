export interface ContractsExpiringDTO {
  daysThreshold: number;
  items: ContractsExpiringTypeItemDTO[];
}

export interface ContractsExpiringTypeItemDTO {
  typeId: number;
  typeName: string;
  total: number;
}
