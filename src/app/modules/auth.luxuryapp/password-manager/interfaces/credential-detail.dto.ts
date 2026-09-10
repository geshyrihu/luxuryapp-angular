export interface CredentialDetailDto {
  id: string;
  username: string;
  password: string;
  platformName: string;
  platformUrl: string;
  subscriptionExpirationDate: string | null;
}
