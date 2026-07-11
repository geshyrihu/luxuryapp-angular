import { EndpointsAuth } from './endpoints.auth';
import { EndpointsSecurity } from './endpoints.security';
import { EndpointsAdmin } from './endpoints.admin';
import { EndpointsSystem } from './endpoints.system';
import { EndpointsContabilidad } from './endpoints.contabilidad';
import { EndpointsCobranza } from './endpoints.cobranza';
import { EndpointsRecursosHumanos } from './endpoints.recursos-humanos';
import { EndpointsLegal } from './endpoints.legal';
import { EndpointsMantenimiento } from './endpoints.mantenimiento';
import { EndpointsOperations } from './endpoints.operations';
import { EndpointsDireccion } from './endpoints.direccion';
import { EndpointsSupplier } from './endpoints.supplier';
import { EndpointsReclutamiento } from './endpoints.reclutamiento';
import { EndpointsResident } from './endpoints.resident';
import { EndpointsWeb } from './endpoints.web';
import { EndpointsShared } from './endpoints.shared';

/**
 * Archivo centralizado de endpoints del API - LuxuryApp.
 * Consolida todas las constantes de módulos en un solo objeto plano.
 * Los módulos se importan individualmente para mejor organización,
 * y se hace spread en orden, con EndpointsShared al final
 * para que los valores compartidos tengan prioridad.
 */
export const Endpoints = {
  ...EndpointsAuth,
  ...EndpointsSecurity,
  ...EndpointsAdmin,
  ...EndpointsSystem,
  ...EndpointsContabilidad,
  ...EndpointsCobranza,
  ...EndpointsRecursosHumanos,
  ...EndpointsLegal,
  ...EndpointsMantenimiento,
  ...EndpointsOperations,
  ...EndpointsDireccion,
  ...EndpointsSupplier,
  ...EndpointsReclutamiento,
  ...EndpointsResident,
  ...EndpointsWeb,
  ...EndpointsShared,
} as const;
