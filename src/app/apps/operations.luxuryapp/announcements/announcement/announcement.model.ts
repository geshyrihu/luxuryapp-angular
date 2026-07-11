// Corresponde a announcementDTO en el backend
export interface IAnnouncement {
  id: string;
  folio: string;
  title: string;
  content: string;
  createdAt: Date;
  publishedAt?: Date;
  expirationDate?: Date;
  status: string;
  createdById: string;
  createdByName: string;
  customerId: string;
  customerName: string;
  announcementType: string;
  externalLink: string;
  imagePath: string;
  sendByEmail: boolean;
  attachments: IAttachment[];
  recipients: IRole[];
  targetedCustomers: Customer[];

  // Propiedades para el modo de edición (vienen de GetByIdAsync)
  selectableRoles: any[];
  selectableCustomers: any[];
}

// Corresponde a RoleDTO en el backend
export interface IRole {
  value: string;
  label: string;
}

// Corresponde a CustomerDTO en el backend
export interface Customer {
  value: string;
  label: string;
}

// Corresponde a announcementAddOrEditDTO en el backend
export interface IAnnouncementAddOrEdit {
  title: string;
  content: string;
  publishedAt?: Date;
  expirationDate?: Date;
  announcementType: any; // EannouncementType
  status: number;
  externalLink: string;
  image?: File;
  targetedCustomerIds: number[];
  recipientRoleIds: string[];
  sendByEmail: boolean;
  attachmentsToDeleteIds: string[];
  attachments?: File[]; // Nuevos archivos a adjuntar
}

// Corresponde a announcementAttachmentDTO en el backend
export interface IAttachment {
  id: string;
  announcementId: string;
  fileName: string;
  filePath: string; // Full URL to download the file
}

// Corresponde a announcementListDTO en el backend
export interface IAnnouncementList {
  id: string;
  title: string;
  content: string;
  publishedAt?: Date;
  expirationDate?: Date;
  status: string;
  createdByName: string;
  imagePath: string;
  attachmentCount: number;
}

// Corresponde a announcementAdminListDTO en el backend
export interface IAnnouncementAdminList {
  id: string;
  folio: string;
  title: string;
  announcementType: string;
  status: string;
  customerName: string;
  publishedAt?: Date;
  expirationDate?: Date;
}

// Corresponde a announcementAnalyticsDTO en el backend
export interface IAnnouncementAnalyticsDTO {
  userName: string;
  userEmail: string;
  viewDate: Date;
}









