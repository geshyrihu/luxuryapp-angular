export interface AccessEventDto {
  id: string;
  occurredAt: string;
  eventType: string;
  wasSuccessful: boolean;
  visitorName: string | null;
  propertyDisplay: string | null;
  accessPointName: string | null;
  processedByName: string | null;
  failureReason: string | null;
  deviceInfo: string | null;
}
