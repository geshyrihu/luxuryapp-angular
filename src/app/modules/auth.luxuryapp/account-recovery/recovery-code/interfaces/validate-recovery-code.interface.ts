/// Request para validar el código de verificación (paso 2 del flujo, RN-CRED-010).
export interface IValidateRecoveryCodeRequest {
  /** Correo electrónico o teléfono registrado del usuario. */
  identifier: string;
  /** Código de 6 dígitos recibido por Email/WhatsApp. */
  code: string;
}

/** Respuesta exitosa: token de reset consumible una sola vez en reset-password. */
export interface IValidateRecoveryCodeResponse {
  email: string;
  token: string;
}
