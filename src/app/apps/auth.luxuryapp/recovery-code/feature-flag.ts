/// Feature flag del flujo de recuperación por código.
/// Permite volver al flujo solo-link si el flujo por código falla en producción
/// (plan §10, rollback Fase 4).
export const RECOVERY_BY_CODE_ENABLED = true;
