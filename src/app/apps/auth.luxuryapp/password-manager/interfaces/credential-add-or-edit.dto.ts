export interface CredentialAddOrEditDto {
  platformName: string;
  username: string;
  password: string;
  subscriptionExpirationDate: string | null;
}
