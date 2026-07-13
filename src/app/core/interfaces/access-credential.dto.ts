export interface AccessCredentialDto {
  id: string;
  visitId: string;
  credentialType: string;
  validityType: string;
  publicCode: string;
  securePayload: string;
  qrImageBase64: string;
  validFrom: string;
  validUntil: string | null;
  maxUsages: number;
  currentUsages: number;
  allowEntry: boolean;
  allowExit: boolean;
  recurrenceRule: string | null;
  status: string;
}
