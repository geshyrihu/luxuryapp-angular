import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { TagModule } from "primeng/tag";
import { CardModule } from "primeng/card";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";

export type ProposedRole =
  | "SuperUsuario"
  | "Administrador"
  | "Cobranza"
  | "Contador"
  | "Legal";

export interface ModuleAction {
  label: string;
}

export interface ModuleEndpoint {
  method: string;
  path: string;
  description: string;
}

export interface CobranzaCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  bgColor: string;
  roles: ProposedRole[];
  actions: ModuleAction[];
  endpoints: ModuleEndpoint[];
  states?: string[];
  notes?: string;
  pending?: boolean;
}

export interface CobranzaGroup {
  label: string;
  icon: string;
  description: string;
  cards: CobranzaCard[];
}

const GROUPS: CobranzaGroup[] = [
  {
    label: "Operacion Diaria",
    icon: "pi pi-calendar",
    description:
      "Funciones que el administrador usa en el dia a dia para registrar cargos y pagos.",
    cards: [
      {
        title: "Dashboard de Metricas",
        description:
          "KPIs en tiempo real: porcentaje de cobro, totales cobrados/pendientes/vencidos, tendencia mensual y top deudores.",
        route: "/cobranza-nativa/dashboard",
        icon: "pi pi-chart-bar",
        bgColor: "#ccfbf1",
        roles: ["Administrador", "Cobranza", "Contador"],
        actions: [
          { label: "Ver porcentaje de cobranza del mes" },
          { label: "Identificar top 5 deudores" },
          { label: "Ver tendencia mensual de ingresos" },
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
        title: "Plantillas de Cargos",
        description:
          "Configuracion de cargos recurrentes: mantenimiento ordinario, cuotas extraordinarias. Define monto fijo o calculo por indiviso.",
        route: "/cobranza-nativa/charge-templates",
        icon: "pi pi-file-edit",
        bgColor: "#dcfce7",
        roles: ["Administrador"],
        actions: [
          { label: "Crear plantilla de mantenimiento mensual" },
          {
            label:
              "Configurar cuota por indiviso (proporcional al porcentaje de cada propiedad)",
          },
          { label: "Activar / desactivar plantilla" },
          { label: "Ver historial de cambios de monto" },
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
          "Matriz de cobertura: visualiza qué cuota aplica a cada propiedad mes a mes. Muestra monto fijo o calculado por indiviso para cada periodo vigente.",
        route: "/cobranza-nativa/charge-template-coverage",
        icon: "pi pi-table",
        bgColor: "#ede9fe",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Ver cuotas fijas por propiedad y mes" },
          { label: "Ver cuotas calculadas por indiviso" },
          { label: "Identificar propiedades sin cuota asignada" },
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
        title: "Cargos",
        description:
          "Gestion individual de cargos aplicados a cada propiedad. Los cargos se generan desde plantillas o se crean manualmente.",
        route: "/cobranza-nativa/charges",
        icon: "pi pi-dollar",
        bgColor: "#bbf7d0",
        roles: ["Administrador", "Cobranza"],
        actions: [
          { label: "Ver cargos pendientes y vencidos por propiedad" },
          { label: "Crear cargo manual (extraordinario)" },
          { label: "Cancelar un cargo" },
          { label: "Importar saldos iniciales masivamente (CSV)" },
          { label: "Generar cargos del mes desde plantillas" },
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
          {
            method: "POST",
            path: "/charges/bulk-import/saldo-inicial",
            description: "Importacion masiva",
          },
        ],
        states: ["Pendiente", "Pagado", "PagoParcial", "Vencido", "Cancelado"],
      },
      {
        title: "Saldos Iniciales",
        description:
          "Registro de la deuda historica de cada propiedad al momento de migrar al sistema. Permite capturar o actualizar el monto de arranque directamente en la tabla.",
        route: "/cobranza-nativa/initial-balance",
        icon: "pi pi-wallet",
        bgColor: "#fef9c3",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Ver estado de saldo inicial por propiedad" },
          { label: "Capturar o actualizar saldo inicial de forma masiva" },
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
          "Registro de pagos de condominios con asignacion automatica FIFO a cargos pendientes. Soporta notas de credito y cancelaciones.",
        route: "/cobranza-nativa/payments",
        icon: "pi pi-credit-card",
        bgColor: "#a7f3d0",
        roles: ["Administrador", "Cobranza"],
        actions: [
          {
            label: "Registrar pago y asignarlo a cargos automaticamente (FIFO)",
          },
          { label: "Aplicar nota de credito a un cargo pendiente" },
          { label: "Cancelar un pago registrado" },
          { label: "Generar recibo de pago" },
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
            description: "Aplicar pago a cargos (FIFO)",
          },
          {
            method: "GET",
            path: "/adjustments/credit-notes/property/{id}/customer/{id}",
            description: "Notas de credito disponibles",
          },
        ],
        states: ["Registrado", "Verificado", "Rechazado"],
      },
    ],
  },
  {
    label: "Gobierno Financiero",
    icon: "pi pi-shield",
    description:
      "Controles de integridad, aprobacion de operaciones sensibles y cierre contable de periodos.",
    cards: [
      {
        title: "Ledger Financiero",
        description:
          "Registro inmutable (append-only) de todos los eventos financieros. Es la fuente de verdad contable del sistema. No se pueden editar ni eliminar entradas.",
        route: "/cobranza-nativa/ledger",
        icon: "pi pi-list",
        bgColor: "#e0e7ff",
        roles: ["Contador", "SuperUsuario"],
        actions: [
          {
            label: "Consultar movimientos de una propiedad por rango de fechas",
          },
          {
            label:
              "Filtrar por tipo de evento (Cargo, Pago, Recargo, Nota Credito)",
          },
          { label: "Ver saldo actual de una propiedad segun el ledger" },
          { label: "Verificar integridad ledger vs campos operacionales" },
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
            description: "Saldo actual segun ledger",
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
          "Principio de diseño: ninguna entrada puede ser modificada o eliminada. Los errores se corrigen con entradas de reverso.",
      },
      {
        title: "Aprobaciones Financieras",
        description:
          "Bandeja de solicitudes que requieren autorizacion de un segundo revisor (maker-checker). Previene que quien solicita una operacion sensible la apruebe el mismo.",
        route: "/cobranza-nativa/approvals",
        icon: "pi pi-check-square",
        bgColor: "#f3e8ff",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Ver solicitudes pendientes de aprobacion" },
          { label: "Revisar detalle de la operacion y su payload tecnico" },
          { label: "Aprobar y ejecutar la operacion automaticamente" },
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
        notes:
          "Operaciones que requieren aprobacion: Condonacion, Devolucion de Pago, Reapertura de Periodo, Anulacion de Cargo Pagado, Ajuste al Alza.",
      },
      {
        title: "Cierres de Periodo",
        description:
          "Control de apertura y cierre de periodos contables mensuales. Un periodo cerrado bloquea la creacion de nuevos movimientos en ese mes.",
        route: "/cobranza-nativa/period-closures",
        icon: "pi pi-lock",
        bgColor: "#fce7f3",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Cerrar el mes actual con notas de cierre" },
          { label: "Ver historial de periodos cerrados y quien los cerro" },
          { label: "Reabrir un periodo (requiere aprobacion)" },
          { label: "Verificar si un periodo esta cerrado antes de operar" },
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
            description: "Verificar si esta cerrado",
          },
        ],
      },
      {
        title: "Auditoria Financiera",
        description:
          "Bitacora de todas las acciones de negocio relevantes en lenguaje operacional. Complementa el ledger con contexto de quien hizo que y por que.",
        route: "/cobranza-nativa/audit",
        icon: "pi pi-eye",
        bgColor: "#f5f3ff",
        roles: ["SuperUsuario", "Contador"],
        actions: [
          { label: "Consultar bitacora por condominio y rango de fechas" },
          { label: "Filtrar por propiedad especifica" },
          { label: "Ver detalle de cada operacion (exitosa o fallida)" },
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
    label: "Identidad y Responsables",
    icon: "pi pi-users",
    description:
      "Modelo unificado de quien vive o es responsable en cada propiedad del condominio.",
    cards: [
      {
        title: "Propiedades",
        description:
          "Catalogo de unidades del condominio: departamento, torre, piso, numero de cuenta, superficie, indiviso y cajones. Base del sistema de cobranza.",
        route: "/cobranza-nativa/properties",
        icon: "pi pi-home",
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
          "El campo indivisoPercentage es el que usa la plantilla de cargos con calculo por Indiviso para distribuir el monto total proporcionalmente.",
      },
      {
        title: "Miembros de Propiedad",
        description:
          "Registro de propietarios, copropietarios, inquilinos, residentes y administradores por propiedad. Define quien es el responsable financiero activo.",
        route: "/cobranza-nativa/members",
        icon: "pi pi-id-card",
        bgColor: "#ede9fe",
        roles: ["Administrador"],
        actions: [
          { label: "Ver todos los miembros vinculados a una propiedad" },
          { label: "Vincular nuevo miembro con rol y fecha de inicio" },
          {
            label:
              "Cambiar responsable financiero (solo uno activo por propiedad)",
          },
          { label: "Dar de baja a un miembro (fecha de termino)" },
          { label: "Migrar datos del modelo legacy (Owner / Occupant)" },
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
          "Invariante del sistema: solo puede haber un IsFinancialResponsible = true activo por propiedad. El sistema lo revoca automaticamente al asignar uno nuevo.",
      },
    ],
  },
  {
    label: "Cobranza Legal",
    icon: "pi pi-exclamation-triangle",
    description:
      "Seguimiento formal de propiedades con morosidad grave que requieren gestion activa.",
    cards: [
      {
        title: "Casos de Cobranza",
        description:
          "Expedientes de cobranza legal para propiedades con deuda grave (30/60/90+ dias). Permite asignar un gestor, registrar actividades y fechas de promesa de pago.",
        route: "/cobranza-nativa/collection-cases",
        icon: "pi pi-briefcase",
        bgColor: "#fee2e2",
        roles: ["Administrador", "Cobranza", "Legal"],
        actions: [
          { label: "Ver todos los casos activos con su antiguedad de deuda" },
          { label: "Registrar nota de actividad o gestion en el expediente" },
          {
            label:
              "Ejecutar evaluacion automatica de morosidad (genera nuevos casos)",
          },
          { label: "Ver historial de contactos y promesas de pago" },
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
          "Los casos se crean automaticamente cuando el job de escalada detecta deuda mayor a 90 dias. Tambien se pueden crear manualmente.",
      },
      {
        title: "Artículos del Reglamento",
        description:
          "Catalogo de articulos del reglamento interno del condominio. Define los tipos de infraccion con su numero, texto oficial y monto de multa predeterminado.",
        route: "/cobranza-nativa/regulation-articles",
        icon: "pi pi-book",
        bgColor: "#ede9fe",
        roles: ["Administrador"],
        actions: [
          { label: "Agregar articulo con su numero oficial (Art. 24, Cap. 3 Inc. b, etc.)" },
          { label: "Definir monto de multa predeterminado por articulo" },
          { label: "Activar o desactivar articulos sin eliminarlos" },
          { label: "El texto del articulo queda vinculado al expediente de cada multa" },
        ],
        endpoints: [
          { method: "GET", path: "/regulation-articles/customer/{id}", description: "Catalogo por condominio" },
          { method: "POST", path: "/regulation-articles", description: "Crear articulo" },
          { method: "PUT", path: "/regulation-articles/{id}", description: "Actualizar articulo" },
          { method: "DELETE", path: "/regulation-articles/{id}", description: "Eliminar (solo si sin multas)" },
        ],
        notes:
          "No es obligatorio. Si la multa no tiene articulo asociado se puede emitir de todas formas con solo la descripcion.",
      },
      {
        title: "Multas Reglamentarias",
        description:
          "Expedientes de infracciones al reglamento interno. Cada multa puede tener evidencia adjunta (PDF, fotos) y genera un cargo financiero al confirmarse.",
        route: "/cobranza-nativa/property-fines",
        icon: "pi pi-ban",
        bgColor: "#fce7f3",
        roles: ["Administrador"],
        actions: [
          { label: "Emitir multa indicando propiedad, infraccion, fecha y monto" },
          { label: "Vincular al articulo reglamentario incumplido" },
          { label: "Adjuntar evidencia: PDF, fotos o video de la infraccion" },
          { label: "Generar cargo financiero (tipo Multa) al saldo de la propiedad" },
          { label: "Anular multa (solo si no esta pagada)" },
          { label: "Ver historial completo de multas por propiedad o por condominio" },
        ],
        endpoints: [
          { method: "GET", path: "/property-fines/customer/{id}", description: "Todas las multas del condominio" },
          { method: "GET", path: "/property-fines/property/{id}", description: "Historial de una propiedad" },
          { method: "POST", path: "/property-fines", description: "Emitir multa" },
          { method: "POST", path: "/property-fines/issue-charge", description: "Generar cargo financiero" },
          { method: "POST", path: "/property-fines/{id}/void", description: "Anular multa" },
          { method: "POST", path: "/property-fines/{id}/evidences", description: "Subir evidencia" },
          { method: "DELETE", path: "/property-fines/evidences/{id}", description: "Eliminar evidencia" },
        ],
        states: ["Emitida", "Notificada", "CargoGenerado", "Pagada", "Anulada"],
        notes:
          "El pago de la multa no se registra aqui: se maneja como cualquier otro cargo a traves del modulo de Pagos. El estado pasa a Pagada automaticamente cuando el cargo vinculado queda en estado Pagado.",
      },
    ],
  },
  {
    label: "Facturacion CFDI",
    icon: "pi pi-receipt",
    description:
      "Emision y cancelacion de comprobantes fiscales digitales (CFDI 4.0) vinculados a los cargos.",
    cards: [
      {
        title: "Facturas CFDI",
        description:
          "Gestion de facturas CFDI 4.0 asociadas a cargos del condominio. Preparado para integracion con SW Sapien. Almacena XML y PDF generados.",
        route: "/cobranza-nativa/invoices",
        icon: "pi pi-file-pdf",
        bgColor: "#fef9c3",
        roles: ["Administrador", "Contador"],
        actions: [
          { label: "Ver facturas asociadas a un cargo especifico" },
          { label: "Emitir CFDI para un cargo" },
          { label: "Cancelar CFDI vigente con motivo" },
          { label: "Descargar XML y PDF del comprobante" },
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
        notes:
          "Actualmente en modo simulacion. La integracion real con el SAT via SW Sapien se activara en la siguiente fase.",
      },
    ],
  },
  {
    label: "Conciliacion Bancaria",
    icon: "pi pi-sync",
    description:
      "Cruce automatico de pagos registrados sin aplicar contra cargos pendientes.",
    cards: [
      {
        title: "Conciliacion de Pagos",
        description:
          "Bolsa de pagos no identificados: pagos registrados en el sistema que aun no han sido aplicados a ningun cargo. La auto-conciliacion los cruza automaticamente.",
        route: "/cobranza-nativa/reconciliation",
        icon: "pi pi-arrows-h",
        bgColor: "#fff7ed",
        roles: ["Contador"],
        actions: [
          { label: "Ver lista de pagos sin aplicar" },
          { label: "Ejecutar auto-conciliacion (cruza pagos con cargos FIFO)" },
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
        notes:
          "Util despues de importaciones masivas de estado de cuenta bancario o cuando llegan pagos por transferencia sin referencia clara.",
      },
    ],
  },
  {
    label: "Configuracion",
    icon: "pi pi-cog",
    description:
      "Parametros del modulo: politicas de mora, modo de facturacion y estado de cuenta.",
    cards: [
      {
        title: "Propiedades",
        description:
          "Catalogo de unidades del condominio: torre, departamento, piso, numero de cuenta, area, indiviso, cajones y bodega. Registra o edita cada propiedad desde aqui.",
        route: "/property",
        icon: "pi pi-building",
        bgColor: "#e0e7ff",
        roles: ["Administrador", "SuperUsuario"],
        actions: [
          { label: "Ver listado completo de propiedades" },
          {
            label:
              "Crear o editar propiedad (numero de cuenta, indiviso, area)",
          },
          { label: "Marcar propiedad como morosa" },
          { label: "Importar propiedades desde Excel" },
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
      },
      {
        title: "Politicas de Mora",
        description:
          "Configuracion de recargos automaticos por pago tardio: dias de gracia, tasa fija o porcentaje, topes maximos y calculo de interes compuesto.",
        route: "/cobranza-nativa/late-fee-policies",
        icon: "pi pi-percentage",
        bgColor: "#fed7aa",
        roles: ["Administrador"],
        actions: [
          { label: "Definir dias de gracia antes de aplicar recargo" },
          { label: "Configurar tasa fija o porcentual" },
          { label: "Establecer monto maximo de recargo" },
          { label: "Activar / desactivar politica" },
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
      {
        title: "Configuracion de Facturacion",
        description:
          "Define si el condominio genera cargos de forma nativa (en esta app) o sincronizado con ASPEL COI. Tambien configura dias de vencimiento y dias de gracia globales.",
        route: "",
        icon: "pi pi-sliders-h",
        bgColor: "#e0f2fe",
        roles: ["Administrador", "SuperUsuario"],
        actions: [
          { label: "Seleccionar modo: Nativo o Sincronizado con ASPEL COI" },
          { label: "Configurar dias de vencimiento por defecto" },
          { label: "Definir dias de gracia globales" },
          { label: "Establecer porcentaje de mora global" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/billing-config/customer/{id}",
            description: "Obtener configuracion actual",
          },
          {
            method: "POST",
            path: "/billing-config",
            description: "Guardar configuracion",
          },
        ],
        notes:
          "Se abre como modal. Pendiente: definir desde que seccion del sistema se abre definitivamente.",
      },
      {
        title: "Estado de Cuenta Nativo",
        description:
          "Kardex de movimientos por propiedad: todos los cargos, pagos y recargos con saldo acumulado. Exportable a PDF.",
        route: "/cobranza-nativa/estado-cuenta",
        icon: "pi pi-file",
        bgColor: "#cffafe",
        roles: ["Administrador", "Cobranza", "Contador"],
        actions: [
          { label: "Consultar estado de cuenta de una propiedad" },
          { label: "Ver saldo actual (pendiente de pago)" },
          { label: "Exportar a PDF" },
          { label: "Enviar por email al residente" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/native-statements/{propertyId}",
            description: "Estado de cuenta",
          },
        ],
      },
    ],
  },
  {
    label: "Servicios Automatizados del API",
    icon: "pi pi-server",
    description:
      "Procesos que corren automaticamente via jobs nocturnos (Hangfire/CRON). Tambien disparables manualmente.",
    cards: [
      {
        title: "Generacion de Cargos Mensuales",
        description:
          "Job que crea automaticamente los cargos del mes para todas las propiedades activas basandose en las plantillas configuradas. Se ejecuta el primer dia de cada mes.",
        route: "/cobranza-nativa/automated-services",
        icon: "pi pi-play-circle",
        bgColor: "#dcfce7",
        roles: ["Administrador"],
        actions: [
          { label: "Disparo automatico el 1ro de cada mes (06:00 AM)" },
          { label: "Disparo manual con seleccion de mes y año" },
        ],
        endpoints: [
          {
            method: "POST",
            path: "/charges/generate-monthly?customerId={id}&month={m}&year={y}",
            description: "Ejecutar generacion",
          },
        ],
      },
      {
        title: "Calculo de Recargos por Mora",
        description:
          "Detecta cargos vencidos y aplica la politica de mora configurada. Genera nuevos cargos de tipo Recargo. Se ejecuta diariamente.",
        route: "/cobranza-nativa/automated-services",
        icon: "pi pi-clock",
        bgColor: "#fed7aa",
        roles: ["Administrador"],
        actions: [
          { label: "Disparo automatico diario (03:00 AM)" },
          { label: "Disparo manual inmediato" },
        ],
        endpoints: [
          {
            method: "POST",
            path: "/charges/calculate-late-fees?customerId={id}",
            description: "Ejecutar calculo de mora",
          },
        ],
      },
      {
        title: "Escalada a Cobranza Legal",
        description:
          "Analiza antiguedad de deuda y escala propiedades a casos de gestoria cuando superan 90 dias. Se ejecuta cada lunes.",
        route: "/cobranza-nativa/automated-services",
        icon: "pi pi-flag",
        bgColor: "#fee2e2",
        roles: ["Administrador"],
        actions: [
          { label: "Disparo automatico semanal (lunes, 07:00 AM)" },
          { label: "Disparo manual desde la pagina de Casos de Cobranza" },
        ],
        endpoints: [
          {
            method: "POST",
            path: "/collection-cases/evaluate-and-escalate/{id}",
            description: "Evaluar y escalar",
          },
        ],
      },
      {
        title: "Auto-Conciliacion de Pagos",
        description:
          "Cruza pagos sin aplicar con cargos pendientes de la misma propiedad. Se ejecuta cada 4 horas para reducir la bolsa de pagos no identificados.",
        route: "/cobranza-nativa/automated-services",
        icon: "pi pi-refresh",
        bgColor: "#dbeafe",
        roles: ["Administrador"],
        actions: [
          { label: "Disparo automatico cada 4 horas" },
          { label: "Disparo manual desde Conciliacion de Pagos" },
        ],
        endpoints: [
          {
            method: "POST",
            path: "/reconciliation/auto-apply-all",
            description: "Ejecutar auto-conciliacion",
          },
        ],
      },
      {
        title: "Motor de Notificaciones (Drip)",
        description:
          "Campana de recordatorios por email: detecta cargos pendientes/vencidos y envia avisos a los ocupantes segun la proximidad al vencimiento. Evita duplicados via NotificationLog.",
        route: "",
        icon: "pi pi-bell",
        bgColor: "#f0fdf4",
        roles: ["Administrador"],
        pending: true,
        actions: [
          { label: "Disparo automatico diario a las 09:00 AM (CRON: 0 9 * * *)" },
          { label: "Envia PreVencimiento cuando faltan 5 o 1 dias para el vencimiento" },
          { label: "Envia DiaVencimiento el mismo dia del vencimiento" },
          { label: "Envia Mora a los -1, -7, -15 dias y cada multiplo de 30 dias vencidos" },
          { label: "Registra cada envio en NotificationLog para garantizar idempotencia" },
          { label: "Si el email ya fue enviado hoy para ese cargo y evento, lo omite" },
        ],
        endpoints: [
          {
            method: "POST",
            path: "/notifications/process?customerId={id}",
            description: "Endpoint pendiente de implementar — solo se ejecuta via Hangfire por ahora",
          },
        ],
        states: ["PreVencimiento", "DiaVencimiento", "Mora"],
        notes:
          "PENDIENTE: no tiene endpoint de disparo manual ni boton en la pantalla de Servicios Automatizados. El job corre automaticamente via Hangfire. Para habilitar el disparo manual se necesita crear el controlador y agregar el boton en automated-services.",
      },
    ],
  },
];

type TagSeverity = "success" | "info" | "warn" | "danger" | "secondary" | "contrast";

interface HeroMetric {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: string;
}

@Component({
  selector: "app-cobranza-nativa-dashboard",
  imports: [CustomButton, TagModule, CardModule],
  templateUrl: "./cobranza-nativa-dashboard.html",
  styleUrls: ["./cobranza-nativa-dashboard.scss"],
})
export default class CobranzaNativaDashboard {
  private router = inject(Router);

  groups = GROUPS;
  expandedCard = signal<string | null>(null);

  readonly heroMetrics: HeroMetric[] = [
    {
      label: "Modulos funcionales",
      value: String(GROUPS.reduce((a, g) => a + g.cards.length, 0)),
      detail: "Paginas y funciones activas",
      icon: "pi pi-th-large",
      tone: "primary",
    },
    {
      label: "Grupos de trabajo",
      value: String(GROUPS.length),
      detail: "Areas funcionales del modulo",
      icon: "pi pi-sitemap",
      tone: "info",
    },
    {
      label: "Endpoints documentados",
      value: String(
        GROUPS.reduce(
          (a, g) => a + g.cards.reduce((b, c) => b + c.endpoints.length, 0),
          0,
        ),
      ),
      detail: "Rutas del API por funcionalidad",
      icon: "pi pi-server",
      tone: "success",
    },
  ];

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }

  toggleExpand(cardTitle: string) {
    this.expandedCard.update((v) => (v === cardTitle ? null : cardTitle));
  }

  isExpanded(cardTitle: string): boolean {
    return this.expandedCard() === cardTitle;
  }

  roleTagSeverity(role: ProposedRole): TagSeverity {
    const map: Record<ProposedRole, TagSeverity> = {
      SuperUsuario: "warn",
      Administrador: "info",
      Cobranza: "success",
      Contador: "secondary",
      Legal: "danger",
    };
    return map[role];
  }
}
