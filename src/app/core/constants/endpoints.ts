import { EndpointsConfig } from './endpoints.config';
import { EndpointsTenant } from './endpoints.tenant';

/**
 * Archivo centralizado de endpoints del API.
 * Ahora exporta la uni�n de Config y Tenant para compatibilidad hacia atr�s.
 */
export const Endpoints = {
  ...EndpointsConfig,
  ...EndpointsTenant
} as const;
