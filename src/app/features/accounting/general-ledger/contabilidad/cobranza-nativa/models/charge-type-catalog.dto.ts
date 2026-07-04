export interface ChargeTypeCatalogResponseDTO {
  id: string;
  customerId: string;
  name: string;
  code: string;
  accountNumber: string;
  description?: string | null;
  isSystem: boolean;
  isActive: boolean;
}

export interface CreateChargeTypeCatalogDTO {
  customerId: string;
  name: string;
  code: string;
  accountNumber: string;
  description?: string | null;
  isActive: boolean;
}

export interface UpdateChargeTypeCatalogDTO {
  id: string;
  customerId: string;
  name: string;
  code: string;
  accountNumber: string;
  description?: string | null;
  isActive: boolean;
}
