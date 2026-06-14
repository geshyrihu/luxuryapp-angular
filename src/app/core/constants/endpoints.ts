import { EndpointsTenant } from './endpoints.tenant';
import { EndpointsInfrastructure } from './endpoints.infrastructure';
import { EndpointsSystem } from './endpoints.system';

/**
 * Archivo centralizado de endpoints del API - LuxuryApp.
 * Consolida las constantes de Tenant, Infrastructure y System.
 * Mantiene una estructura plana para asegurar la compatibilidad con los servicios existentes.
 */
export const Endpoints = {
  ...EndpointsSystem,
  ...EndpointsTenant,
  ...EndpointsInfrastructure
} as const;
