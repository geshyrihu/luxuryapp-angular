export interface ChargeTypeCatalogResponseDTO {
  id: string;
  customerId: string;
  name: string;
  code: string;
  accountNumber: string;
  description?: string | null;
  isSystem: boolean;
}

export interface CreateChargeTypeCatalogDTO {
  customerId: string;
  name: string;
  code: string;
  description?: string | null;
}

export interface UpdateChargeTypeCatalogDTO {
  id: string;
  customerId: string;
  name: string;
  code: string;
  description?: string | null;
}
