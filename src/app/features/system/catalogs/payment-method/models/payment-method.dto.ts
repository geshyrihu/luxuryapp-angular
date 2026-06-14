export interface IPaymentMethodDTO {
  id: string;
  codigo: string;
  descripcion: string;
  applicationUserId: string;
}

export interface IPaymentMethodAddOrEditDTO {
  codigo: string;
  descripcion: string;
  applicationUserId: string;
}
