export interface CredentialDetailDTO {
  id: string;
  username: string;
  password: string;
  platformName: string;
  platformUrl: string;
  subscriptionExpirationDate: string | null;
}

export interface CredentialAddOrEditDTO {
  platformName: string;
  username: string;
  password: string;
  subscriptionExpirationDate: string | null;
}
