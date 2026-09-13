import { EMemberRole } from './enums';

export interface PropertyMemberResponseDTO {
  id: string;
  customerId: string;
  propertyId: string;
  userId: string;
  userName: string;
  email: string;
  memberRole: EMemberRole;
  isFinancialResponsible: boolean;
  receiveNotifications: boolean;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  notes: string | null;
  accountNumber: string | null;
  propertyName: string | null;
}

export interface CreatePropertyMemberDTO {
  customerId: string;
  propertyId: string;
  userId: string;
  memberRole: EMemberRole;
  isFinancialResponsible: boolean;
  receiveNotifications: boolean;
  startDate: string;
  endDate: string | null;
  notes: string | null;
}

export interface CreatePropertyMemberWithAccountDTO {
  customerId: string;
  propertyId: string;
  typePerson: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  memberRole: EMemberRole;
  isFinancialResponsible: boolean;
  receiveNotifications: boolean;
  startDate: string;
  endDate: string | null;
  notes: string | null;
}

export interface UpdatePropertyMemberDTO {
  id: string;
  memberRole: EMemberRole;
  isFinancialResponsible: boolean;
  receiveNotifications: boolean;
  notes: string | null;
}

export interface MigrationResultDTO {
  ownersProcessed: number;
  occupantsProcessed: number;
  membersCreated: number;
  membersSkipped: number;
  warnings: string[];
}
