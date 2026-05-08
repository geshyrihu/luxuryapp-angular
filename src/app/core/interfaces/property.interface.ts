import { IPropertyOccupant } from "./property-occupant.interface";
export interface IProperty {
  id: any;
  department: string;
  tower: string;
  floor: string;
  unitNumber: string;
  areaM2: number;
  indivisoPercentage: number;
  parkingSlots: number;
  storageUnit: string;
  customerId: string;
  accountNumber: string;
  fullName: string;
  isDelinquent: boolean;
  delinquentSince: string | null;
  occupants: IPropertyOccupant[];
}









