import { CustomerLocationType } from './customer-location-type.enum';

export interface CustomerLocationDto {
  id: string;
  customerId: string;
  name: string;
  locationType: CustomerLocationType;
  phoneOne: string;
  phoneTwo: string;
  contactName: string;
  notes: string;
  sortOrder: number;
  isActive: boolean;
}