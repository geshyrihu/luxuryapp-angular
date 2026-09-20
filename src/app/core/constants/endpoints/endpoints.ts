import { EndpointsAdmin } from "./admin.endpoints";
import { EndpointsAuth } from "./auth.endpoints";
import { EndpointsCobranza } from "./cobranza.endpoints";
import { EndpointsCompras } from "./compras.endpoints";
import { EndpointsCommittee } from "./committee.endpoints";
import { EndpointsContabilidad } from "./contabilidad.endpoints";
import { EndpointsDireccion } from "./direccion.endpoints";
import { EndpointsLegal } from "./legal.endpoints";
import { EndpointsMantenimiento } from "./mantenimiento.endpoints";
import { EndpointsOperations } from "./operations.endpoints";
import { EndpointsReclutamiento } from "./reclutamiento.endpoints";
import { EndpointsRecursosHumanos } from "./recursos-humanos.endpoints";
import { EndpointsResident } from "./resident.endpoints";
import { EndpointsSecurity } from "./security.endpoints";
import { EndpointsSelectItem } from "./select-item.endpoints";
import { EndpointsShared } from "./shared.endpoints";
import { EndpointsSupplier } from "./supplier.endpoints";
import { EndpointsSystem } from "./system.endpoints";
import { EndpointsWeb } from "./web.endpoints";

/**
 * @deprecated Desde 2026-09-20. Use imports directos desde cada módulo (ej: `import { EndpointsAdmin } from '@core/constants/endpoints/admin.endpoints'`).
 * Plan de eliminación: 3 meses (2026-12-20).
 * Este archivo re-exporta todo para compatibilidad legacy.
 * Código NUEVO debe importar desde los archivos específicos de cada módulo.
 */
export const Endpoints = {
  ...EndpointsAuth,
  ...EndpointsSecurity,
  ...EndpointsAdmin,
  ...EndpointsCompras,
  ...EndpointsSystem,
  ...EndpointsCommittee,
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
  ...EndpointsSelectItem,
  ...EndpointsShared,
  BudgetingProposal: EndpointsContabilidad.BudgetingProposal,
  BudgetingProposalSupport: EndpointsContabilidad.BudgetingProposalSupport,
  AccountingCoi: EndpointsContabilidad.AccountingCoi,
  CobranzaCore: EndpointsCobranza.CobranzaCore,
  CobranzaNative: EndpointsCobranza.CobranzaNative,
  CobranzaOnline: EndpointsCobranza.CobranzaOnline,
  CobranzaLive: EndpointsCobranza.CobranzaLive,
  CobranzaLocal: EndpointsCobranza.CobranzaLocal,
  CobranzaSync: EndpointsCobranza.CobranzaSync,
} as const;
