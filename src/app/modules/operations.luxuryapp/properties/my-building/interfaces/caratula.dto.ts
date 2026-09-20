export interface ClienteCaratulaDTO {
  nameCustomer: string;
  rfc: string;
  phoneOne: string;
  phoneTwo: string;
  adreess: string;
  photoPath: string;
  latitud: number;
  longitud: number;
  googleMpasUbication: string;
}

export interface EmployeeOrganigramaDTO {
  email: string;
  phoneNumber: string;
  nameEmployee: string;
  photoEmployee: string;
  applicationRoleId: string;
  applicationRoleName: string;
  applicationRoleSortOrder: number;
  departament: number;
}

export interface PersonalGroupDTO {
  departament: number;
  departmentDisplayName: string;
  empleados: EmployeeOrganigramaDTO[];
}

export interface CaratulaDTO {
  cliente: ClienteCaratulaDTO;
  empleadosAdministracion: PersonalGroupDTO[];
  departamentos: number;
  torres: number;
}
