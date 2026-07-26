import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { CobranzaGroup } from "../../interfaces/cobranza-nativa.interface";

const pathOf = (path: string): string => `/${path}`;
const customerIdPlaceholder = "{customerId}";
const propertyIdPlaceholder = "{propertyId}";
const chargeIdPlaceholder = "{chargeId}";
const paymentIdPlaceholder = "{paymentId}";
const yearPlaceholder = "{year}" as unknown as number;
const monthPlaceholder = "{month}" as unknown as number;

const metricsPath = pathOf(
  Endpoints.CobranzaCore.Analytics.metrics(customerIdPlaceholder),
).replace("meses=", "meses={n}");

const processNotificationsPath = pathOf(
  Endpoints.CobranzaCore.Notifications.process(customerIdPlaceholder),
);

export const COBRANZA_GROUPS: CobranzaGroup[] = [
  {
    label: "Core Nativo - Base Maestra",
    icon: "mdi:domain",
    description:
      "Catalogos y reglas base para definir quien paga, que se cobra y bajo que politicas opera el modulo.",
    cards: [
      {
        title: "Propiedades",
        description:
          "Catalogo de unidades del condominio: departamento, torre, piso, numero de cuenta, superficie, indiviso y cajones.",
        route: "/cobranza-nativa/properties",
        icon: "mdi:home",
        bgColor: "#dbeafe",
        roles: ["Administrador"],
        actions: [
          { label: "Ver todas las propiedades del condominio" },
          { label: "Crear nueva propiedad" },
          {
            label:
              "Editar datos de una propiedad (superficie, indiviso, cuenta)",
          },
          { label: "Eliminar propiedad sin actividad financiera" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(Endpoints.SelectItems.properties(customerIdPlaceholder)),
            description: "Listar propiedades",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.Properties.create),
            description: "Crear propiedad",
          },
          {
            method: "PUT",
            path: pathOf(Endpoints.Properties.update("{id}")),
            description: "Actualizar propiedad",
          },
          {
            method: "DELETE",
            path: pathOf(Endpoints.Properties.delete("{id}")),
            description: "Eliminar propiedad",
          },
        ],
        notes:
          "El campo indivisoPercentage se usa para distribuir cargos cuando la plantilla trabaja por indiviso.",
      },
      {
        title: "Miembros de Propiedad",
        description:
          "Registro de propietarios, copropietarios, residentes e inquilinos. Aqui se define el responsable financiero activo.",
        route: "/cobranza-nativa/members",
        icon: "mdi:card-account-details",
        bgColor: "#ede9fe",
        roles: ["Administrador"],
        actions: [
          { label: "Ver miembros vinculados a una propiedad" },
          { label: "Asignar nuevo miembro con rol y vigencia" },
          { label: "Cambiar responsable financiero activo" },
          { label: "Dar de baja a un miembro" },
          { label: "Migrar datos del modelo legacy" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.PropertyMembers.byProperty(
                propertyIdPlaceholder,
                customerIdPlaceholder,
              ),
            ),
            description: "Miembros de una propiedad",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.PropertyMembers.create),
            description: "Vincular miembro",
          },
          {
            method: "PUT",
            path: pathOf(Endpoints.CobranzaCore.PropertyMembers.update("{id}")),
            description: "Actualizar miembro",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.PropertyMembers.endMembership("{id}"),
            ),
            description: "Dar de baja",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.PropertyMembers.migrateFromLegacy(
                customerIdPlaceholder,
              ),
            ),
            description: "Migracion legacy",
          },
        ],
        states: ["Activo", "Baja"],
        notes:
          "Solo puede existir un responsable financiero activo por propiedad.",
      },
      {
        title: "Tipos de Cargo",
        description:
          "Catalogo central de conceptos financieros que define nombre, codigo y cuenta contable para cargos manuales, recurrentes y automaticos.",
        route: "/cobranza-nativa/charge-types",
        icon: "mdi:shape-outline",
        bgColor: "#d1fae5",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Ver tipos base del sistema" },
          { label: "Crear tipos de cargo personalizados" },
          { label: "Asignar cuenta contable por tipo" },
          { label: "Desactivar tipos que ya no se usan" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.ChargeTypes.customer(
                customerIdPlaceholder,
              ),
            ),
            description: "Listar tipos de cargo",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.ChargeTypes.create),
            description: "Crear tipo de cargo",
          },
          {
            method: "PUT",
            path: pathOf(Endpoints.CobranzaCore.ChargeTypes.update("{id}")),
            description: "Actualizar tipo de cargo",
          },
          {
            method: "DELETE",
            path: pathOf(Endpoints.CobranzaCore.ChargeTypes.delete("{id}")),
            description: "Eliminar o desactivar tipo de cargo",
          },
        ],
        notes:
          "Los tipos del sistema estan protegidos porque participan en automatizaciones y calculos del modulo.",
      },
      {
        title: "Plantillas de Cargos",
        description:
          "Configuracion de cuotas recurrentes, mantenimiento y cargos extraordinarios con monto fijo o calculo por indiviso.",
        route: "/cobranza-nativa/charge-templates",
        icon: "mdi:file-edit",
        bgColor: "#dcfce7",
        roles: ["Administrador"],
        actions: [
          { label: "Crear plantilla de mantenimiento mensual" },
          { label: "Configurar cuota fija o por indiviso" },
          { label: "Activar o desactivar plantilla" },
          { label: "Revisar historial de cambios de monto" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Templates.customer(customerIdPlaceholder),
            ),
            description: "Listar plantillas",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Templates.create),
            description: "Crear plantilla",
          },
          {
            method: "PUT",
            path: pathOf(Endpoints.CobranzaCore.Templates.update("{id}")),
            description: "Actualizar plantilla",
          },
          {
            method: "DELETE",
            path: pathOf(Endpoints.CobranzaCore.Templates.delete("{id}")),
            description: "Eliminar plantilla",
          },
        ],
      },
      {
        title: "Cuotas Vigentes por Propiedad",
        description:
          "Matriz que muestra que cuota aplica a cada propiedad y en que periodos esta vigente.",
        route: "/cobranza-nativa/charge-template-coverage",
        icon: "mdi:table",
        bgColor: "#e0f2fe",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Ver cuotas activas por propiedad y mes" },
          { label: "Ver cuotas fijas y calculadas por indiviso" },
          { label: "Detectar propiedades sin cobertura" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Templates.coverage(customerIdPlaceholder),
            ),
            description: "Matriz de cuotas vigentes",
          },
        ],
      },
      {
        title: "Politicas de Mora",
        description:
          "Reglas de recargos por atraso: dias de gracia, tasa, topes y comportamiento de calculo.",
        route: "/cobranza-nativa/late-fee-policies",
        icon: "mdi:percent",
        bgColor: "#fed7aa",
        roles: ["Administrador"],
        actions: [
          { label: "Definir dias de gracia" },
          { label: "Configurar tasa fija o porcentual" },
          { label: "Establecer monto maximo de recargo" },
          { label: "Activar o desactivar politica" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.LateFeePolicies.customer(
                customerIdPlaceholder,
              ),
            ),
            description: "Listar politicas",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.LateFeePolicies.create),
            description: "Crear politica",
          },
          {
            method: "PUT",
            path: pathOf(Endpoints.CobranzaCore.LateFeePolicies.update("{id}")),
            description: "Actualizar politica",
          },
          {
            method: "DELETE",
            path: pathOf(Endpoints.CobranzaCore.LateFeePolicies.delete("{id}")),
            description: "Eliminar politica",
          },
        ],
      },
    ],
  },
  {
    label: "Core Nativo - Operacion y Cobro",
    icon: "mdi:cash-multiple",
    description:
      "Pantallas de trabajo diario para emitir cargos, registrar pagos y consultar el saldo vivo del condominio.",
    cards: [
      {
        title: "Dashboard de Metricas",
        description:
          "KPIs operativos del periodo: porcentaje de cobro, cartera vencida, ingresos y top deudores.",
        route: "/cobranza-nativa/dashboard",
        icon: "mdi:chart-bar",
        bgColor: "#ccfbf1",
        roles: ["Administrador", "Cobranza", "Contador"],
        actions: [
          { label: "Ver porcentaje de cobranza del mes" },
          { label: "Identificar top deudores" },
          { label: "Revisar tendencia de ingresos" },
        ],
        endpoints: [
          {
            method: "GET",
            path: metricsPath,
            description: "Metricas consolidadas del condominio",
          },
        ],
      },
      {
        title: "Cargos",
        description:
          "Gestion individual de cargos emitidos a propiedades. Aqui nacen cargos manuales y se administran cargos activos.",
        route: "/cobranza-nativa/charges",
        icon: "mdi:cash-plus",
        bgColor: "#bbf7d0",
        roles: ["Administrador", "Cobranza"],
        actions: [
          { label: "Ver cargos pendientes y vencidos" },
          { label: "Crear cargo manual extraordinario" },
          { label: "Cancelar un cargo" },
          { label: "Consultar saldo y vencimiento por propiedad" },
          { label: "Revisar detalle operativo del cargo" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Charges.customer(customerIdPlaceholder),
            ),
            description: "Listar cargos del condominio",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Charges.create),
            description: "Crear cargo manual",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Charges.cancel("{id}")),
            description: "Cancelar cargo",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.Charges.generateMonthly(
                customerIdPlaceholder,
                monthPlaceholder,
                yearPlaceholder,
              ),
            ),
            description: "Generar cargos del mes",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.Charges.calculateLateFees(
                customerIdPlaceholder,
              ),
            ),
            description: "Calcular recargos mora",
          },
        ],
        states: ["Pendiente", "Pagado", "PagoParcial", "Vencido", "Cancelado"],
      },
      {
        title: "Saldos Iniciales",
        description:
          "Captura o actualizacion de deuda historica para arrancar el modulo con una posicion inicial correcta.",
        route: "/cobranza-nativa/initial-balance",
        icon: "mdi:wallet",
        bgColor: "#fef9c3",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Ver estado de saldo inicial por propiedad" },
          { label: "Guardar saldos iniciales de forma masiva" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Charges.initialBalanceStatus(
                customerIdPlaceholder,
              ),
            ),
            description: "Estado de saldos iniciales",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Charges.bulkSetInitialBalance),
            description: "Guardar saldos iniciales",
          },
        ],
      },
      {
        title: "Registrar Pagos",
        description:
          "Captura de pagos con aplicacion automatica FIFO a cargos pendientes y manejo de cancelaciones.",
        route: "/cobranza-nativa/payments",
        icon: "mdi:credit-card",
        bgColor: "#a7f3d0",
        roles: ["Administrador", "Cobranza"],
        actions: [
          { label: "Registrar pago y aplicarlo automaticamente" },
          { label: "Aplicar nota de credito a cargos pendientes" },
          { label: "Cancelar un pago registrado" },
          { label: "Ver historial de pagos por propiedad" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Payments.customer(customerIdPlaceholder),
            ),
            description: "Listar pagos",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Payments.create),
            description: "Registrar pago",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Payments.cancel("{id}")),
            description: "Cancelar pago",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Payments.applyToCharges),
            description: "Aplicar pago a cargos",
          },
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Adjustments.pendingCreditNotes(
                propertyIdPlaceholder,
                customerIdPlaceholder,
              ),
            ),
            description: "Notas de credito disponibles",
          },
        ],
        states: ["Registrado", "Verificado", "Rechazado"],
      },
      {
        title: "Estado de Cuenta Nativo",
        description:
          "Kardex ledger-based por propiedad con saldo acumulado, aging, PDF y envio manual por email.",
        route: "/cobranza-nativa/estado-cuenta",
        icon: "mdi:file-document-outline",
        bgColor: "#cffafe",
        roles: ["Administrador", "Cobranza", "Contador"],
        actions: [
          { label: "Consultar estado de cuenta por propiedad" },
          { label: "Ver saldo al corte" },
          { label: "Generar PDF" },
          { label: "Enviar estado de cuenta por email" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Statements.get(propertyIdPlaceholder),
            ),
            description: "Estado de cuenta",
          },
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Statements.pdf(propertyIdPlaceholder),
            ),
            description: "PDF del estado de cuenta",
          },
        ],
      },
    ],
  },
  {
    label: "Core Nativo - Control Financiero",
    icon: "mdi:shield-check",
    description:
      "Capas de control, conciliacion y trazabilidad para validar integridad operativa y contable.",
    cards: [
      {
        title: "Ledger Financiero",
        description:
          "Registro inmutable de eventos financieros. Es la fuente de verdad para saldo, trazabilidad y auditoria.",
        route: "/cobranza-nativa/ledger",
        icon: "mdi:format-list-bulleted",
        bgColor: "#e0e7ff",
        roles: ["Contador", "SuperUsuario"],
        actions: [
          { label: "Consultar movimientos por propiedad" },
          { label: "Filtrar por tipo de evento" },
          { label: "Ver saldo actual segun ledger" },
          { label: "Validar integridad ledger vs operacion" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Ledger.propertyEntries(
                propertyIdPlaceholder,
                customerIdPlaceholder,
              ),
            ),
            description: "Entradas del ledger por propiedad",
          },
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Ledger.propertyBalance(
                propertyIdPlaceholder,
                customerIdPlaceholder,
              ),
            ),
            description: "Saldo segun ledger",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.Ledger.checkIntegrity(
                customerIdPlaceholder,
              ),
            ),
            description: "Verificar integridad completa",
          },
        ],
        states: [
          "EmisionCargo",
          "AplicacionPago",
          "ReversoPago",
          "CondonacionCargo",
          "CierrePeriodo",
        ],
        notes:
          "Las correcciones no editan historia; se modelan como reversos o ajustes.",
      },
      {
        title: "Conciliacion de Pagos",
        description:
          "Bolsa de pagos no aplicados y motor para reconciliarlos contra cargos pendientes.",
        route: "/cobranza-nativa/reconciliation",
        icon: "mdi:sync",
        bgColor: "#fff7ed",
        roles: ["Contador"],
        actions: [
          { label: "Ver pagos sin aplicar" },
          { label: "Revisar coincidencias antes de aplicar" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(Endpoints.CobranzaCore.Reconciliation.unallocated),
            description: "Pagos sin aplicar",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Reconciliation.autoApplyAll),
            description: "Ejecutar auto-conciliacion",
          },
        ],
      },
      {
        title: "Aprobaciones Financieras",
        description:
          "Bandeja maker-checker para operaciones sensibles que requieren un segundo revisor.",
        route: "/cobranza-nativa/approvals",
        icon: "mdi:checkbox-marked",
        bgColor: "#f3e8ff",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Ver solicitudes pendientes" },
          { label: "Revisar payload tecnico de la operacion" },
          { label: "Aprobar y ejecutar" },
          { label: "Rechazar con nota obligatoria" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.FinancialApprovals.pending(
                customerIdPlaceholder,
              ),
            ),
            description: "Solicitudes pendientes",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.FinancialApprovals.approve("{id}"),
            ),
            description: "Aprobar y ejecutar",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.FinancialApprovals.reject("{id}"),
            ),
            description: "Rechazar con nota",
          },
        ],
        states: ["Pendiente", "Aprobada", "Rechazada", "Cancelada"],
      },
      {
        title: "Cierres de Periodo",
        description:
          "Control mensual para bloquear movimientos en periodos cerrados y reabrirlos solo por flujo autorizado.",
        route: "/cobranza-nativa/period-closures",
        icon: "mdi:lock",
        bgColor: "#fce7f3",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Cerrar el mes actual" },
          { label: "Ver historial de cierres" },
          { label: "Reabrir periodo con control" },
          { label: "Validar si un periodo esta cerrado" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.PeriodClosures.byCustomer(
                customerIdPlaceholder,
              ),
            ),
            description: "Historial de cierres",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.PeriodClosures.close(
                customerIdPlaceholder,
              ),
            ),
            description: "Cerrar periodo",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.PeriodClosures.reopen(
                customerIdPlaceholder,
              ),
            ),
            description: "Reabrir periodo",
          },
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.PeriodClosures.isClosed(
                customerIdPlaceholder,
                yearPlaceholder,
                monthPlaceholder,
              ),
            )
              .replace("/NaN/", "/{year}/")
              .replace("/NaN/", "/{month}/"),
            description: "Verificar cierre",
          },
        ],
      },
      {
        title: "Auditoria Financiera",
        description:
          "Bitacora operacional para saber quien hizo que, cuando y sobre que propiedad o proceso.",
        route: "/cobranza-nativa/audit",
        icon: "mdi:eye-outline",
        bgColor: "#f5f3ff",
        roles: ["SuperUsuario", "Contador"],
        actions: [
          { label: "Consultar bitacora por fechas" },
          { label: "Filtrar por propiedad" },
          { label: "Ver operaciones exitosas o fallidas" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.FinancialAudit.byCustomer(
                customerIdPlaceholder,
              ),
            ),
            description: "Bitacora del condominio",
          },
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.FinancialAudit.byProperty(
                propertyIdPlaceholder,
                customerIdPlaceholder,
              ),
            ),
            description: "Bitacora de una propiedad",
          },
        ],
      },
    ],
  },
  {
    label: "Cobranza Extendida",
    icon: "mdi:briefcase-outline",
    description:
      "Procesos complementarios que salen de la cobranza base: multas, expedientes, reglamento y CFDI.",
    cards: [
      {
        title: "Casos de Cobranza",
        description:
          "Expedientes de gestion y cobranza legal para propiedades con morosidad grave o seguimiento especial.",
        route: "/cobranza-nativa/collection-cases",
        icon: "mdi:briefcase",
        bgColor: "#fee2e2",
        roles: ["Administrador", "Cobranza", "Legal"],
        actions: [
          { label: "Ver casos activos" },
          { label: "Registrar actividad o gestion" },
          { label: "Revisar historial de contactos" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.CollectionCases.byCustomer(
                customerIdPlaceholder,
              ),
            ),
            description: "Listar casos por condominio",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.CollectionCases.logActivity("{id}"),
            ),
            description: "Registrar actividad",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.CollectionCases.evaluateAndEscalate(
                customerIdPlaceholder,
              ),
            ),
            description: "Evaluar y escalar",
          },
        ],
        states: ["Activo", "Resuelto", "Pausado"],
        notes:
          "Los casos tambien pueden nacer por procesos automatizados de escalamiento.",
      },
      {
        title: "Articulos del Reglamento",
        description:
          "Catalogo de articulos y montos base para multas y expedientes normativos.",
        route: "/cobranza-nativa/regulation-articles",
        icon: "mdi:book",
        bgColor: "#ede9fe",
        roles: ["Administrador"],
        actions: [
          { label: "Agregar articulo y referencia oficial" },
          { label: "Definir monto predeterminado de multa" },
          { label: "Activar o desactivar articulos" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.RegulationArticles.byCustomer(
                customerIdPlaceholder,
              ),
            ),
            description: "Catalogo por condominio",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.RegulationArticles.create),
            description: "Crear articulo",
          },
          {
            method: "PUT",
            path: pathOf(
              Endpoints.CobranzaCore.RegulationArticles.update("{id}"),
            ),
            description: "Actualizar articulo",
          },
          {
            method: "DELETE",
            path: pathOf(
              Endpoints.CobranzaCore.RegulationArticles.delete("{id}"),
            ),
            description: "Eliminar articulo",
          },
        ],
      },
      {
        title: "Multas Reglamentarias",
        description:
          "Expedientes de infraccion con evidencia y capacidad de generar cargo financiero asociado.",
        route: "/cobranza-nativa/property-fines",
        icon: "mdi:ban",
        bgColor: "#fce7f3",
        roles: ["Administrador"],
        actions: [
          { label: "Emitir multa a una propiedad" },
          { label: "Adjuntar evidencia" },
          { label: "Generar cargo financiero por multa" },
          { label: "Anular multa si aplica" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.PropertyFines.byCustomer(
                customerIdPlaceholder,
              ),
            ),
            description: "Todas las multas del condominio",
          },
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.PropertyFines.byProperty(
                propertyIdPlaceholder,
              ),
            ),
            description: "Historial de una propiedad",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.PropertyFines.create),
            description: "Emitir multa",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.PropertyFines.issueCharge),
            description: "Generar cargo financiero",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.PropertyFines.void("{id}", "{reason}"),
            ),
            description: "Anular multa",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.PropertyFines.addEvidence("{id}"),
            ),
            description: "Subir evidencia",
          },
        ],
        states: ["Emitida", "Notificada", "CargoGenerado", "Pagada", "Anulada"],
      },
      {
        title: "Facturas CFDI",
        description:
          "Emision y cancelacion de CFDI asociados a cargos, con almacenamiento de XML y PDF.",
        route: "/cobranza-nativa/invoices",
        icon: "mdi:file-pdf-box",
        bgColor: "#fef9c3",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Ver facturas de un cargo" },
          { label: "Emitir CFDI" },
          { label: "Cancelar CFDI vigente" },
          { label: "Descargar XML y PDF" },
        ],
        endpoints: [
          {
            method: "GET",
            path: pathOf(
              Endpoints.CobranzaCore.Invoices.byCharge(chargeIdPlaceholder),
            ),
            description: "Facturas de un cargo",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Invoices.generate),
            description: "Emitir CFDI",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Invoices.cancel("{id}")),
            description: "Cancelar CFDI",
          },
        ],
        states: ["Vigente", "Cancelado"],
      },
    ],
  },
  {
    label: "Automatizacion",
    icon: "mdi:robot-outline",
    description:
      "Una sola puerta para jobs y procesos programados del modulo, en lugar de multiples cards que duplican la misma pantalla.",
    cards: [
      {
        title: "Servicios Automatizados",
        description:
          "Centro operativo para disparar y monitorear generacion de cargos, recargos, escalamiento y auto-conciliacion.",
        route: "/cobranza-nativa/automated-services",
        icon: "mdi:cog-play",
        bgColor: "#dcfce7",
        roles: ["Administrador"],
        actions: [
          { label: "Generar cargos mensuales" },
          { label: "Calcular recargos por mora" },
          { label: "Escalar cartera a cobranza legal" },
          { label: "Ejecutar auto-conciliacion de pagos" },
          { label: "Consultar que servicios son automaticos vs manuales" },
        ],
        endpoints: [
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.Automation.generateMonthlyCharges(
                customerIdPlaceholder,
                monthPlaceholder,
                yearPlaceholder,
              ),
            ),
            description: "Generacion de cargos",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.Automation.calculateLateFees(
                customerIdPlaceholder,
              ),
            ),
            description: "Calculo de mora",
          },
          {
            method: "POST",
            path: pathOf(
              Endpoints.CobranzaCore.Automation.evaluateCollectionCases(
                customerIdPlaceholder,
              ),
            ),
            description: "Escalada legal",
          },
          {
            method: "POST",
            path: pathOf(Endpoints.CobranzaCore.Automation.autoReconcile),
            description: "Auto-conciliacion",
          },
          {
            method: "POST",
            path: processNotificationsPath,
            description: "Procesar notificaciones",
          },
        ],
        notes:
          "La configuracion de canales email/push existe, pero el motor de notificaciones sigue siendo una capacidad transversal y no una pagina navegable independiente.",
      },
    ],
  },
  {
    label: "Onboarding del Modulo",
    icon: "mdi:sitemap",
    description:
      "Material de orientacion para UI, negocio y QA. Estas pantallas explican el bounded context y como se conecta el flujo del modulo.",
    cards: [
      {
        title: "Como Funciona el Sistema",
        description:
          "Vista narrativa para entender fases, entidades y reglas del modulo de extremo a extremo.",
        route: "/cobranza-nativa/system-overview",
        icon: "mdi:book-open-page-variant",
        bgColor: "#e0f2fe",
        roles: ["Administrador", "Cobranza", "Contador", "SuperUsuario"],
        actions: [
          { label: "Entender el flujo general del modulo" },
          { label: "Revisar conceptos clave y entidades" },
        ],
        endpoints: [],
      },
      {
        title: "Mapa Visual del Flujo",
        description:
          "Diagrama visual para ver entradas maestras, eventos operativos, controles y salidas del sistema.",
        route: "/cobranza-nativa/flow-map",
        icon: "mdi:transit-connection-variant",
        bgColor: "#cffafe",
        roles: ["Administrador", "Cobranza", "Contador", "SuperUsuario"],
        actions: [
          { label: "Entender rapidamente como se conecta el modulo" },
          { label: "Explicar el flujo a UI, QA o negocio" },
        ],
        endpoints: [],
      },
    ],
  },
];
