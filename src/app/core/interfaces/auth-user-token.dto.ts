export interface UserTokenDto {
  token: string;
  refreshToken: string; // Añade esta propiedad
  expiration: string;
  roles: string[];
  infoUserAuthDTO: InfoAccountAuthDto;
  customerAccess: SelectItemCustomerAccessDto[];
  permission?: any[]; // Considera renombrar a permissions para consistencia
}

export interface InfoAccountAuthDto {
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

export interface SelectItemCustomerAccessDto {
  label: string;
  value: string;
  image: string;
}









