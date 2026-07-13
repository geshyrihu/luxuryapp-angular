export interface VisitorDto {
  id: string;
  customerId: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  photoPath: string | null;
  company: string | null;
  vehiclePlate: string | null;
  documentId: string | null;
  isBlacklisted: boolean;
  blacklistReason: string | null;
}
