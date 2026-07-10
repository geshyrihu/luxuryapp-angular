export interface ApplicationUserDto {
  id: string;
  customer: string;
  active: boolean;
  numeroCliente: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  photoPath: string;
  userName: string;
  phoneNumber: string;
  typePerson: string;
  role: string;
}

export interface ApplicationUserCreateDto {
  email: string;
  customerId: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  typePerson: string;
}

export interface AddApplicationRoleToUserDto {
  roleId: string;
  roleName: string;
  isSelected: boolean;
  roleType: string;
  sortOrder: number;
}

export interface ChangePasswordDto {
  currentPassword?: string;
  newPassword?: string;
}
