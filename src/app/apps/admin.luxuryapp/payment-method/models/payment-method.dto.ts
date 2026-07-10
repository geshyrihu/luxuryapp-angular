export interface PaymentMethodDto {
  id: string;
  codigo: string;
  descripcion: string;
  applicationUserId: string;
}

export interface PaymentMethodAddOrEditDto {
  codigo: string;
  descripcion: string;
  applicationUserId: string;
}
