export interface ICfdiUseDTO {
  id: string;
  codigo: string;
  descripcion: string;
  employeeId: string | null;
}

export interface ICfdiUseAddOrEditDTO {
  codigo: string;
  descripcion: string;
  employeeId: string | null;
}
