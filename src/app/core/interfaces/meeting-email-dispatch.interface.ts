export interface MeetingEmailDispatch {
  id: string;
  meetingId: string;
  sentAt: string;
  sentByUserId: string;
  sentByName: string;
  subject: string;
  to: string;
  cc: string;
  bcc: string;
  recipientsCount: number;
  success: boolean;
  errorMessage: string;
}
