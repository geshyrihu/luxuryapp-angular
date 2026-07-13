export interface InvitationDto {
  id: string;
  visitId: string;
  channel: string;
  message: string | null;
  deliveryReference: string | null;
  sentAt: string;
  status: string;
}
