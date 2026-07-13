import { AccessCredentialDto } from "./access-credential.dto";

export interface VisitDto {
  id: string;
  customerId: string;
  visitorId: string;
  propertyId: string;
  visitorName: string;
  propertyDisplay: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualCheckIn: string | null;
  actualCheckOut: string | null;
  status: string;
  purpose: string | null;
  credential: AccessCredentialDto | null;
}
