export interface ApplicationRole {
  id: string;
  name: string;
  normalizedName: string;
  sortOrder: number;
  isActive: boolean;
  roleType: RoleType;
  departament: Department;
}

export enum RoleType {
  System = 0,
  Executive = 1,
  Corporate = 2,
  Staff = 3,
  Client = 4,
  Contractor = 5,
}

export enum Department {
  Administracion = 0,
  Legal = 1,
  Contabilidad = 2,
  Mantenimiento = 3,
  Limpieza = 4,
  Operaciones = 5,
  Jardineria = 6,
  Sistemas = 7,
  Seguridad = 8,
  Constructora = 9,
  Supervision = 10,
  Direcciones = 11,
  RecusrosHumanos = 12,
  Reclutamiento = 13,
  Recepcion = 14,
  Mensajeria = 15,
  Ludoteca = 16,
  NA = 17,
}
