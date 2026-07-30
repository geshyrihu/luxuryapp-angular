export interface EmailDataFormDto {
  id?: string;
  applicationUserId: string;
  applicationUser?: string;
  email?: string;
  title?: string;
  port: string | number;
  smtp: string;
  password: string;
}

export interface TestEmailResponse {
  message: string;
}
