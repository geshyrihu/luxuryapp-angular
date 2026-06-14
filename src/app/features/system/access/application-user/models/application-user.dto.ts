export interface IApplicationUserDTO {
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

export interface IApplicationUserCreateDTO {
  email: string;
  customerId: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  typePerson: string;
}

export interface IAddApplicationRoleToUserDTO {
  roleId: string;
  roleName: string;
  isSelected: boolean;
  roleType: string;
  sortOrder: number;
}

export interface IChangePasswordDTO {
  currentPassword?: string;
  newPassword?: string;
}
