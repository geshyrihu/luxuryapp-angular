export interface CreateVisitRequestDto {
  propertyId: string;
  visitorId?: string | null;
  visitorFullName?: string | null;
  visitorPhone?: string | null;
  visitorEmail?: string | null;
  company?: string | null;
  vehiclePlate?: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  purpose?: string | null;
  notes?: string | null;
  credentialValidityType: string;
  maxUsages?: number | null;
  credentialValidFrom?: string | null;
  credentialValidUntil?: string | null;
  recurrenceRule?: string | null;
  generateInvitation: boolean;
  invitationChannel?: string | null;
}
