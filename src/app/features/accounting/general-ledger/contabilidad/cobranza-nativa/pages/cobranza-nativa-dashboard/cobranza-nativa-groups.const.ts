import { CobranzaGroup } from "../../models/cobranza-nativa.model";

export const COBRANZA_GROUPS: CobranzaGroup[] = [
  {
    label: "Base Maestra",
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
            path: "/Property/list/{customerId}",
            description: "Listar propiedades",
          },
          { method: "POST", path: "/Property", description: "Crear propiedad" },
          {
            method: "PUT",
            path: "/Property/{id}",
            description: "Actualizar propiedad",
          },
          {
            method: "DELETE",
            path: "/Property/{id}",
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
            path: "/property-members/property/{id}/customer/{id}",
            description: "Miembros de una propiedad",
          },
          {
            method: "POST",
            path: "/property-members",
            description: "Vincular miembro",
          },
          {
            method: "PUT",
            path: "/property-members/{id}",
            description: "Actualizar miembro",
          },
          {
            method: "POST",
            path: "/property-members/{id}/end-membership",
            description: "Dar de baja",
          },
          {
            method: "POST",
            path: "/property-members/migrate-from-legacy/customer/{id}",
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
            path: "/charge-types/customer/{id}",
            description: "Listar tipos de cargo",
          },
          {
            method: "POST",
            path: "/charge-types",
            description: "Crear tipo de cargo",
          },
          {
            method: "PUT",
            path: "/charge-types/{id}",
            description: "Actualizar tipo de cargo",
          },
          {
            method: "DELETE",
            path: "/charge-types/{id}",
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
            path: "/charge-templates/customer/{id}",
            description: "Listar plantillas",
          },
          {
            method: "POST",
            path: "/charge-templates",
            description: "Crear plantilla",
          },
          {
            method: "PUT",
            path: "/charge-templates/{id}",
            description: "Actualizar plantilla",
          },
          {
            method: "DELETE",
            path: "/charge-templates/{id}",
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
            path: "/templates/coverage/customer/{id}",
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
            path: "/late-fee-policies/customer/{id}",
            description: "Listar politicas",
          },
          {
            method: "POST",
            path: "/late-fee-policies",
            description: "Crear politica",
          },
          {
            method: "PUT",
            path: "/late-fee-policies/{id}",
            description: "Actualizar politica",
          },
          {
            method: "DELETE",
            path: "/late-fee-policies/{id}",
            description: "Eliminar politica",
          },
        ],
      },
    ],
  },
  {
    label: "Operacion y Cobro",
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
            path: "/analytics/customer/{id}",
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
          { label: "Generar cargos mensuales desde plantillas" },
          { label: "Calcular recargos por mora manualmente" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/charges/customer/{id}",
            description: "Listar cargos del condominio",
          },
          {
            method: "POST",
            path: "/charges",
            description: "Crear cargo manual",
          },
          {
            method: "POST",
            path: "/charges/{id}/cancel",
            description: "Cancelar cargo",
          },
          {
            method: "POST",
            path: "/charges/generate-monthly",
            description: "Generar cargos del mes",
          },
          {
            method: "POST",
            path: "/charges/calculate-late-fees",
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
            path: "/charges/initial-balance-status/customer/{id}",
            description: "Estado de saldos iniciales",
          },
          {
            method: "POST",
            path: "/charges/initial-balance/bulk",
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
            path: "/payments/customer/{id}",
            description: "Listar pagos",
          },
          { method: "POST", path: "/payments", description: "Registrar pago" },
          {
            method: "POST",
            path: "/payments/{id}/cancel",
            description: "Cancelar pago",
          },
          {
            method: "POST",
            path: "/payments/apply-to-charges",
            description: "Aplicar pago a cargos",
          },
          {
            method: "GET",
            path: "/adjustments/credit-notes/property/{id}/customer/{id}",
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
            path: "/native-statements/{propertyId}",
            description: "Estado de cuenta",
          },
          {
            method: "GET",
            path: "/native-statements/{propertyId}/pdf",
            description: "PDF del estado de cuenta",
          },
        ],
      },
    ],
  },
  {
    label: "Control Financiero",
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
            path: "/ledger/property/{id}/customer/{id}/entries",
            description: "Entradas del ledger por propiedad",
          },
          {
            method: "GET",
            path: "/ledger/property/{id}/customer/{id}/balance",
            description: "Saldo segun ledger",
          },
          {
            method: "POST",
            path: "/ledger/integrity/customer/{id}",
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
          { label: "Ejecutar auto-conciliacion" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/reconciliation/unallocated",
            description: "Pagos sin aplicar",
          },
          {
            method: "POST",
            path: "/reconciliation/auto-apply-all",
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
            path: "/financial-approvals/pending/customer/{id}",
            description: "Solicitudes pendientes",
          },
          {
            method: "POST",
            path: "/financial-approvals/{id}/approve",
            description: "Aprobar y ejecutar",
          },
          {
            method: "POST",
            path: "/financial-approvals/{id}/reject",
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
            path: "/period-closures/customer/{id}",
            description: "Historial de cierres",
          },
          {
            method: "POST",
            path: "/period-closures/customer/{id}/close",
            description: "Cerrar periodo",
          },
          {
            method: "POST",
            path: "/period-closures/customer/{id}/reopen",
            description: "Reabrir periodo",
          },
          {
            method: "GET",
            path: "/period-closures/customer/{id}/{year}/{month}/is-closed",
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
            path: "/audit/customer/{id}",
            description: "Bitacora del condominio",
          },
          {
            method: "GET",
            path: "/audit/property/{id}/customer/{id}",
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
          { label: "Evaluar y escalar morosidad" },
          { label: "Revisar historial de contactos" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/collection-cases/customer/{id}",
            description: "Listar casos por condominio",
          },
          {
            method: "POST",
            path: "/collection-cases/{id}/activity",
            description: "Registrar actividad",
          },
          {
            method: "POST",
            path: "/collection-cases/evaluate-and-escalate/{id}",
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
            path: "/regulation-articles/customer/{id}",
            description: "Catalogo por condominio",
          },
          {
            method: "POST",
            path: "/regulation-articles",
            description: "Crear articulo",
          },
          {
            method: "PUT",
            path: "/regulation-articles/{id}",
            description: "Actualizar articulo",
          },
          {
            method: "DELETE",
            path: "/regulation-articles/{id}",
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
            path: "/property-fines/customer/{id}",
            description: "Todas las multas del condominio",
          },
          {
            method: "GET",
            path: "/property-fines/property/{id}",
            description: "Historial de una propiedad",
          },
          {
            method: "POST",
            path: "/property-fines",
            description: "Emitir multa",
          },
          {
            method: "POST",
            path: "/property-fines/issue-charge",
            description: "Generar cargo financiero",
          },
          {
            method: "POST",
            path: "/property-fines/{id}/void",
            description: "Anular multa",
          },
          {
            method: "POST",
            path: "/property-fines/{id}/evidences",
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
            path: "/invoices/charge/{id}",
            description: "Facturas de un cargo",
          },
          { method: "POST", path: "/invoices", description: "Emitir CFDI" },
          {
            method: "POST",
            path: "/invoices/{id}/cancel",
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
            path: "/charges/generate-monthly?customerId={id}&month={m}&year={y}",
            description: "Generacion de cargos",
          },
          {
            method: "POST",
            path: "/charges/calculate-late-fees?customerId={id}",
            description: "Calculo de mora",
          },
          {
            method: "POST",
            path: "/collection-cases/evaluate-and-escalate/{id}",
            description: "Escalada legal",
          },
          {
            method: "POST",
            path: "/reconciliation/auto-apply-all",
            description: "Auto-conciliacion",
          },
        ],
        notes:
          "La configuracion de canales email/push existe, pero el motor de notificaciones sigue siendo una capacidad transversal y no una pagina navegable independiente.",
      },
    ],
  },
  {
    label: "Entendimiento del Modulo",
    icon: "mdi:sitemap",
    description:
      "Material de orientacion para UI, negocio y QA. Estas pantallas explican como se conecta todo el flujo.",
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
