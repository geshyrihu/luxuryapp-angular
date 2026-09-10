export interface PanicAlertDto {
  id: string;
  customerId: string;
  triggeredByUserId: string;
  triggeredByName: string;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  message: string | null;
  status: string;
  createdAt: string;
  attendedByName: string | null;
  attendedAt: string | null;
  resolvedByName: string | null;
  resolvedAt: string | null;
  resolutionNotes: string | null;
  notifiedUserCount: number;
}
