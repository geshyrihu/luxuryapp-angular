export interface UserTokenDTO {
  token: string;
  refreshToken: string; // Añade esta propiedad
  expiration: string;
  roles: string[];
  infoUserAuthDTO: InfoAccountAuthDTO;
  customerAccess: SelectItemCustomerAccessDTO[];
  permission?: any[]; // Considera renombrar a permissions para consistencia
}

export interface InfoAccountAuthDTO {
  customerId: string;
  applicationUserId: string;
  customer: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoPath: string;
  fullName: string;
  position: string;
  customerPhotoPath: string;
}

export interface SelectItemCustomerAccessDTO {
  label: string;
  value: string;
  image: string;
}









