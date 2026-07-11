export interface PanicAlertRealTimeDto {
  id: string;
  customerId: string;
  triggeredByName: string;
  latitude: number | null;
  longitude: number | null;
  message: string | null;
  createdAt: string;
}
