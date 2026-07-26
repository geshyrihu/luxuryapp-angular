import { EndpointsAdmin } from "./admin.endpoints";
import { EndpointsAuth } from "./auth.endpoints";
import { EndpointsCobranza } from "./cobranza.endpoints";
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
import { EndpointsShared } from "./shared.endpoints";
import { EndpointsSupplier } from "./supplier.endpoints";
import { EndpointsSystem } from "./system.endpoints";
import { EndpointsWeb } from "./web.endpoints";

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
