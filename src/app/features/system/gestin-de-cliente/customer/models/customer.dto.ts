export interface ICustomerDTO {
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

export interface ICustomerAddOrEditDTO {
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

export interface ICustomerAddressAddOrEditDTO {
  id: string;
  customerId: string;
  district: string;
  street: string;
  city: string;
  number: string;
  unitNumber: string;
  postalCode: string;
  country: string;
  townHall: string;
  latitud: number;
  longitud: number;
  additionalDetails: string;
}

export interface ICustomerImageDTO {
  id: string;
  customerId: string;
  pathImag: string;
}
