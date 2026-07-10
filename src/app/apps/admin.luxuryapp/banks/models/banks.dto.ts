export interface BankDto {
  id: string;
  code: string;
  shortName: string;
  largeName: string;
}

export interface BankAddOrEditDto {
  code: string;
  shortName: string;
  largeName: string;
}
