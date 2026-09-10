/// Request para iniciar la recuperación de cuenta por código (paso 1 del flujo, RN-CRED-010).
export interface IInitiateRecoveryByCodeRequest {
  /** Correo electrónico o teléfono registrado del usuario. */
  identifier: string;
}
