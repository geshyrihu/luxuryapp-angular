export interface AccessPointDto {
  id: string;
  name: string;
  accessPointType: string;
  location: string | null;
  isActive: boolean;
  deviceIdentifier: string | null;
}
