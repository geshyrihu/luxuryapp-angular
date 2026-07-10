export interface CfdiUseDto {
  id: string;
  codigo: string;
  descripcion: string;
  employeeId: string | null;
}

export interface CfdiUseAddOrEditDto {
  codigo: string;
  descripcion: string;
  employeeId: string | null;
}
