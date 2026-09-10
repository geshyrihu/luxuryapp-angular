export interface CustomerDto {
  id: string;
  numeroCliente: string;
  nameCustomer: string;
  nombreCorto: string;
  rfc: string;
  phoneOne: string;
  phoneTwo: string;
  register: string; // DateTime string
  active: boolean;
  photoPath: string;
  latitud: number;
  longitud: number;
  folioPrefix: string;
}
