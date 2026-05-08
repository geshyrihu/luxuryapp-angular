export interface IBankDTO {
  id: string;
  code: string;
  shortName: string;
  largeName: string;
}

export interface IBankAddOrEditDTO {
  code: string;
  shortName: string;
  largeName: string;
}
