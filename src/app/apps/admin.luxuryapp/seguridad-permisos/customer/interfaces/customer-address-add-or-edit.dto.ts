export interface CustomerAddressAddOrEditDto {
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
