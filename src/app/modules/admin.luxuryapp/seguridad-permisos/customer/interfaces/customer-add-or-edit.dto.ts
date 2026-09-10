export interface CustomerAddOrEditDto {
  nameCustomer: string;
  numeroCliente: string;
  nombreCorto: string;
  rfc: string;
  phoneOne: string;
  phoneTwo: string;
  register: string;
  active: boolean;
  photoPath: any; // IFormFile / File / string
  folioPrefix: string;
}
