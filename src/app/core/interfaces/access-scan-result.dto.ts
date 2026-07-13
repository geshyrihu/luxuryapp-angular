export interface AccessScanResultDto {
  isValid: boolean;
  resultType: string;
  message: string;
  visitId: string | null;
  visitorName: string | null;
  propertyDisplay: string | null;
  occurredAt: string | null;
}
