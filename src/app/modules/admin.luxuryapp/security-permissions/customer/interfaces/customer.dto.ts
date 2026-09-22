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
  state: number;
  photoPath: string;
  latitud: number;
  longitud: number;
  folioPrefix: string;
  riskPremiumPercentage: number;
}
