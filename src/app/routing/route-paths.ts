export const ROUTES = {
  // ============================================================
  // AUTENTIFICACIÓN
  // ============================================================
  AUTH: {
    LOGIN: ["/auth", "login"],
    RECOVERY_PASSWORD: ["/auth", "recovery-password"],
    RESET_PASSWORD: ["/auth", "reset-password"],
    UPDATE_USER_PROFILE: ["/auth", "update-user-profile"],
  },

  // ============================================================
  // PÁGINAS PÚBLICAS
  // ============================================================
  PUBLICO: {
    REPORTE_OPERACION: (customer: string, inicio: string, final: string) => [
      "/publico",
      "reporte-operacion",
      customer,
      inicio,
      final,
    ],
    OPERATION_REPORT_CLIENT: (
      customer: string,
      inicio: string,
      final: string,
    ) => ["/publico", "operation-report-client", customer, inicio, final],
    REPORTE_MINUTA: (customer: string, id: string) => [
      "/publico",
      "reporte-minuta",
      customer,
      id,
    ],
    REPORTE_TICKET_PENDIENTES: (customerId: string, departamentId: string) => [
      "/publico",
      "reporte-ticket-pendientes-proveedor",
      customerId,
      departamentId,
    ],
    CONTABILIDAD_CLIENTE: (customerId: string, anio: string, mes: string) => [
      "/publico",
      "contabilidad-cliente",
      customerId,
      anio,
      mes,
    ],
  },

  // ============================================================
  // DASHBOARD Y GENERALES
  // ============================================================
  DASHBOARD: ["/dashboard"],
  NOTIFICATIONS: ["/notifications"],
  HOME: ["/home"],
  OFFLINE: ["/offline"],
  UNAUTHORIZED: ["/unauthorized"],
  PAGE404: ["/page404"],

  // ============================================================
  // COMITÉ (MESA DIRECTIVA)
  // ============================================================
  COMITE: {
    HOME: ["/committee"],
    CONSEJO_DIRECTIVO: {
      REUNIONES_MENSUALES: [
        "/committee",
        "board-directors",
        "monthly-meetings",
      ],
      MINUTAS: ["/committee", "board-directors", "meeting-minutes"],
      MINUTA_DETALLE: (id: string) => [
        "/committee",
        "board-directors",
        "meeting-minutes-detail",
        id,
      ],
      POLIZA_SEGURO: [
        "/committee",
        "board-directors",
        "building-insurance-policy",
      ],
      INFORMES_FINANCIEROS: [
        "/committee",
        "board-directors",
        "financial-reports",
      ],
      DOCUMENTOS: ["/committee", "board-directors", "documents"],
      DOCUMENTO_INFORME_FINANCIERO: [
        "/committee",
        "board-directors",
        "documents",
        "financial-report",
      ],
      DOCUMENTO_PLANTILLAS: [
        "/committee",
        "board-directors",
        "documents",
        "templates",
      ],
      DOCUMENTO_MANUALES: [
        "/committee",
        "board-directors",
        "documents",
        "manuals-and-processes",
      ],
      DOCUMENTO_POLIZAS: [
        "/committee",
        "board-directors",
        "documents",
        "maintenance-policy",
      ],
      DOCUMENTO_ACTAS: [
        "/committee",
        "board-directors",
        "documents",
        "incorporation-deeds",
      ],
      DOCUMENTO_ASAMBLEAS: [
        "/committee",
        "board-directors",
        "documents",
        "assemblies",
      ],
      DOCUMENTO_REGLAMENTOS: [
        "/committee",
        "board-directors",
        "documents",
        "regulations",
      ],
      DOCUMENTO_CONTRATOS: [
        "/committee",
        "board-directors",
        "documents",
        "employee-contracts",
      ],
      DOCUMENTO_JUICIOS: [
        "/committee",
        "board-directors",
        "documents",
        "lawsuits",
      ],
      DOCUMENTO_PLANOS: [
        "/committee",
        "board-directors",
        "documents",
        "blueprints",
      ],
      DOCUMENTO_CONCESION_BARRANCA: [
        "/committee",
        "board-directors",
        "documents",
        "ravine-concession",
      ],
      DOCUMENTO_CONCESION_POZO: [
        "/committee",
        "board-directors",
        "documents",
        "well-concession",
      ],
    },
  },

  // ============================================================
  // DIRECCIÓN
  // ============================================================
  DIRECCION: {
    HOME: ["/direccion"],
    PERFIL: ["/direccion", "profile"],
  },

  // ============================================================
  // PERFIL
  // ============================================================
  PERFIL: {
    UPDATE_USER_PROFILE: ["/profile", "update-user-profile"],
  },

  // ============================================================
  // CONFIGURACIÓN / SISTEMA
  // ============================================================
  CONFIGURACION: {
    HOME: ["/admin"],
    USUARIO_APLICACION: ["/settings", "application-user"],
    CLIENTES: ["/settings", "customers"],
    MODULOS_CLIENTE: ["/settings", "customer-module"],
    MODULO_CLIENTE_EDITAR: (customerId: string, customerName: string) => [
      "/settings",
      "customer-module-edit",
      customerId,
      customerName,
    ],
    ROLES: ["/settings", "roles"],
    MODULO_APP_ROL: ["/settings", "module-app-role"],
    MODULO_APP: ["/settings", "module-app"],
    MODULO_APP_ROL_ACTUALIZAR: (roleId: string, roleName: string) => [
      "/settings",
      "module-app-role-update",
      roleId,
      roleName,
    ],
    REGLAS_APROBACION: ["/settings", "approval-rules"],
    DATOS_EMPRESA_CLIENTE: ["/settings", "customer-data-company"],
    DATOS_EMAIL: ["/settings", "email-data"],
    DEPURACION: ["/settings", "depuration"],
    BANCOS: ["/settings", "banks"],
    FORMA_PAGO: ["/settings", "payment-method"],
    METODO_PAGO: ["/settings", "payment-type"],
    USO_CFDI: ["/settings", "cfdi-use"],
    TRABAJOS: ["/settings", "jobs"],
    IMPLEMENTACION_APP: ["/settings", "app-implementation-report"],
    CATEGORIA_MEDIDOR: ["/settings", "meter-category"],
    CATEGORIA_PRODUCTO: ["/settings", "product-category"],
    CLASIFICACION_MAQUINARIA: ["/settings", "machinery-classification"],
    UNIDADES_MEDIDA: ["/settings", "units-of-measurement"],
    AUDITORIA_ENTRADAS: ["/settings", "audit-entries"],
    HISTORIAL_ACTIVIDAD: ["/settings", "user-activity-history"],
    TIPOS_INCIDENCIA: ["/settings", "incident-types"],
    TIPOS_SANCION: ["/settings", "sanction-types"],
    REPORTE_LOG_API: ["/settings", "log-api-report"],
    LOGS_BREVO: ["/settings", "brevo-logs"],
    TEST_SIGNALR: ["/settings", "testsignalr"],
    TEST_EMAIL: ["/settings", "test-email"],
    MINI_POSTMAN: ["/settings", "mini-postman"],
    CATEGORIA_GRUPO_TICKET: ["/settings", "ticket-group-category"],
    CATALOGO_CHECKLIST_ASAMBLEA: ["/settings", "assembly-checklist-catalog"],
    CONCILIACION_JUNTAS: ["/settings", "monthly-meetings-reconciliation"],
    CATALOGO_REVISIONES_INSPECCION: ["/settings", "inspection-reviews-catalog"],
    CATALOGO_ACTIVO: ["/settings", "catalog-asset"],
    ENTREGA_RECEPCION_CLIENTE: ["/settings", "client-delivery-reception"],
    CATALOGO_UI: ["/settings", "ui-catalog"],
    BASE_CONOCIMIENTO_AI: ["/settings", "ai-knowledge-base"],
    VAULT_SECRETOS: ["/settings", "vault-secrets"],
    DATABASE_BACKUP: ["/settings", "database-backup"],
    ELEVEN_LABS: ["/settings", "eleven-labs"],
    IA_TEST: ["/settings", "ai-test"],
  },

  // ============================================================
  // ANUNCIOS
  // ============================================================
  ANUNCIOS: {
    ADMIN: ["/announcements", "manage"],
    LISTA: ["/announcements", "list"],
    DETALLE: (id: string) => ["/announcements", "detail", id],
    ANALITICA: (id: string) => ["/announcements", "analytics", id],
  },

  // ============================================================
  // ALMACÉN
  // ============================================================
  ALMACEN: {
    LISTA: ["/warehouse", "list"],
    PRODUCTOS: (almacenId: string) => ["/warehouse", "products", almacenId],
    SALIDA_PRODUCTOS: ["/warehouse", "product-output"],
    ENTRADA_PRODUCTOS: ["/warehouse", "product-entry"],
    PRESTAMO_HERRAMIENTAS: ["/warehouse", "tool-loan"],
  },

  // ============================================================
  // CALENDARIOS
  // ============================================================
  CALENDARIOS: {
    FIESTAS_JUDIAS: ["/calendars", "jewish-holidays"],
    FIESTAS_CRISTIANAS: ["/calendars", "christian-holidays"],
    CUMPLEANOS: ["/calendars", "birthdays"],
    CALENDARIO_MANTENIMIENTO: ["/calendars", "maintenance-master"],
    FONDEOS: ["/calendars", "fundings"],
    CALENDARIO_EQUIPO: ["/calendars", "team-master-calendar"],
    GOOGLE_CALENDAR: ["/calendars", "google-calendar"],
  },

  // ============================================================
  // CONTABILIDAD
  // ============================================================
  CONTABILIDAD: {
    DASHBOARD: ["/contabilidad"],
    PRESUPUESTO: ["/contabilidad", "budget"],
    CATALOGO_CUENTAS: ["/contabilidad", "accounting-catalog"],
    MINUTAS_PENDIENTES: ["/contabilidad", "minutes-pendings"],
    LISTA_FONDEOS: ["/contabilidad", "funding-list"],
    DETALLE_FONDEO: (id: string) => ["/contabilidad", "funding-details", id],
    MINUTAS_PENDIENTES_LEGALES: ["/contabilidad", "legal-minutes-pendings"],
    EJECUCION_PRESUPUESTO: ["/contabilidad", "budget-execution"],
    ENVIO_REPORTE_FINANCIERO: ["/contabilidad", "financial-report-sending"],
    ESTADOS_FINANCIEROS: ["/contabilidad", "financial-statements"],
    RESUMEN_FINANCIERO: ["/contabilidad", "financial-summary"],
    PROPUESTA_PRESUPUESTO: ["/contabilidad", "budget-proposal"],
    COBRANZA: ["/contabilidad", "collections"],
    COBRANZA_INSPECCION: ["/contabilidad", "collections", "inspection"],
    COBRANZA_ANALISIS: ["/contabilidad", "collections", "analysis"],
    COBRANZA_REPORTE_FINANCIERO: [
      "/contabilidad",
      "collections",
      "reporte-financiero",
    ],
    COBRANZA_PRESUPUESTO: [
      "/contabilidad",
      "collections",
      "presupuesto-contabilidad",
    ],
    COBRANZA_EXCLUSIONES: ["/contabilidad", "collections", "exclusions"],
    CUENTAS: ["/contabilidad", "accounts"],
    REPORTES_FINANCIEROS: ["/contabilidad", "financial-statements-reports"],
    ASPEL_COBRANZA: ["/contabilidad", "aspel-cobranza"],
    ESPEJO_ASPEL: ["/contabilidad", "espejo-aspel-full"],
    AUDITORIA_CUENTAS_ASPEL: ["/contabilidad", "autitoria-cuentas-aspel"],
    REPORTES: ["/contabilidad", "reportes"],
    REPORTE_NUEVO: ["/contabilidad", "reportes", "nuevo"],
    REPORTE_EDITAR: (id: string) => ["/contabilidad", "reportes", "editar", id],
    REPORTE_VER: (id: string) => ["/contabilidad", "reportes", "ver", id],
    REPORTE_GUIA: ["/contabilidad", "reportes", "guia"],
  },

  // ============================================================
  // COBRANZA NATIVA
  // ============================================================
  COBRANZA_NATIVA: {
    DASHBOARD: ["/cobranza-nativa"],
    DASHBOARD_PRINCIPAL: ["/cobranza-nativa", "dashboard"],
    PLANTILLAS_CARGO: ["/cobranza-nativa", "charge-templates"],
    CARGOS: ["/cobranza-nativa", "charges"],
    PAGOS: ["/cobranza-nativa", "payments"],
    POLITICAS_MORA: ["/cobranza-nativa", "late-fee-policies"],
    ESTADO_CUENTA: ["/cobranza-nativa", "estado-cuenta"],
    PROPIEDADES: ["/cobranza-nativa", "properties"],
    MIEMBROS: ["/cobranza-nativa", "members"],
    APROBACIONES: ["/cobranza-nativa", "approvals"],
    LIBRO_MAYOR: ["/cobranza-nativa", "ledger"],
    CIERRES_PERIODO: ["/cobranza-nativa", "period-closures"],
    ARTICULOS_REGULACION: ["/cobranza-nativa", "regulation-articles"],
    MULTAS_PROPIEDAD: ["/cobranza-nativa", "property-fines"],
    CASOS_COBRANZA: ["/cobranza-nativa", "collection-cases"],
    FACTURAS: ["/cobranza-nativa", "invoices"],
    CONCILIACION: ["/cobranza-nativa", "reconciliation"],
    AUDITORIA: ["/cobranza-nativa", "audit"],
    SERVICIOS_AUTOMATIZADOS: ["/cobranza-nativa", "automated-services"],
    COBERTURA_PLANTILLA: ["/cobranza-nativa", "charge-template-coverage"],
    SALDO_INICIAL: ["/cobranza-nativa", "initial-balance"],
    VISTA_GENERAL: ["/cobranza-nativa", "system-overview"],
  },

  // ============================================================
  // FONDEOS
  // ============================================================
  FONDEOS: {
    LISTA: ["/funding", "list"],
    DETALLE: (id: string) => ["/funding", "details", id],
  },

  // ============================================================
  // SAT FONDEOS
  // ============================================================
  SAT_FONDEOS: {
    LISTA: ["/sat-funding"],
    DETALLE: (id: string) => ["/sat-funding", id],
  },

  // ============================================================
  // DIRECTORIO
  // ============================================================
  DIRECTORIO: {
    PROVEEDORES: ["/directory", "provider"],
    CONDOMINOS: ["/directory", "condos"],
    PROPIEDADES: ["/directory", "properties"],
    COMITE_VIGILANCIA: ["/directory", "vigilance-committee"],
    PERSONAL_INTERNO: ["/directory", "staff"],
    ORGANIGRAMA: ["/directory", "work-position-org-chart"],
    PERSONAL_EXTERNO: ["/directory", "external-staff"],
    EMPLEADO: (employeeId: string, applicationUserId: string) => [
      "/directory",
      "empleado",
      employeeId,
      applicationUserId,
    ],
    TELEFONOS_EMERGENCIA: ["/directory", "emergency-phones"],
    MIS_PROVEEDORES: ["/directory", "mis-proveedores"],
  },

  // ============================================================
  // BIBLIOTECA
  // ============================================================
  BIBLIOTECA: {
    ACTA_CONSTITUTIVA: ["/library", "incorporation-deed"],
    INFORME_FINANCIERO: ["/library", "financial-report"],
    PLANTILLAS: ["/library", "templates"],
    MANUALES_Y_PROCESOS: ["/library", "manuals-and-processes"],
    MANUALES_GUIA: ["/library", "manuals-and-processes", "guide"],
    MANUAL_DETALLE: (id: string) => [
      "/library",
      "manuals-and-processes",
      "detail",
      id,
    ],
    MANUAL_EDITOR: (id: string) => [
      "/library",
      "manuals-and-processes",
      "editor",
      id,
    ],
    MANUAL_FLUJO_EDITOR: (id: string) => [
      "/library",
      "manuals-and-processes",
      "flowchart-editor",
      id,
    ],
    POLIZAS_MANTENIMIENTO: ["/library", "maintenance-policies"],
    CONTRATOS_POLIZAS_LEGAL: ["/library", "contracts-policies-view-legal"],
    ASAMBLEAS: ["/library", "assemblies"],
    REGLAMENTOS: ["/library", "regulations"],
    CONCESION_BARRANCA: ["/library", "ravine-concession"],
    CONCESION_POZO: ["/library", "well-concession"],
    PINTURA: ["/library", "painting"],
    ILUMINACION: ["/library", "lighting"],
  },

  // ============================================================
  // ENTREGA-RECEPCIÓN
  // ============================================================
  ENTREGA_RECEPCION: {
    GENERAL: ["/delivery-reception", "general"],
    EQUIPOS: ["/delivery-reception", "equipment"],
    INSTALACIONES: ["/delivery-reception", "installations"],
    HERRAMIENTAS: ["/delivery-reception", "tools"],
    INSUMOS: ["/delivery-reception", "supplies"],
    MANTENIMIENTOS: ["/delivery-reception", "maintenance"],
    ORGANIGRAMA: ["/delivery-reception", "organigrama"],
    LLAVES: ["/delivery-reception", "keys"],
    HIDRANTES: ["/delivery-reception", "hydrants"],
    MANTENIMIENTOS_PENDIENTES: [
      "/delivery-reception",
      "mantenimientos-pendientes",
    ],
  },

  // ============================================================
  // INSPECCIONES
  // ============================================================
  INSPECCIONES: {
    CATALOGO: ["/inspections", "catalog"],
    DETALLE: (id: string) => ["/inspections", "details", id],
    LISTA_INFORMES: ["/inspections", "inspection-report-list"],
    MIS_INSPECCIONES_LISTA: ["/inspections", "my-inspection-list"],
    MIS_INSPECCIONES_EJECUTAR: ["/inspections", "my-inspection"],
    RESULTADO: (id: string) => ["/inspections", "result", id],
  },

  // ============================================================
  // JUNTAS COMITÉ
  // ============================================================
  JUNTAS_COMITE: {
    SESIONES: ["/committee-meetings", "sessions"],
    PRESENTACIONES: ["/committee-meetings", "presentations"],
    PRESENTACIONES_CONTADOR: ["/committee-meetings", "presentations-contador"],
    MINUTAS: ["/committee-meetings", "minutes"],
    RESUMEN_MINUTA: (meetingId: string) => [
      "/committee-meetings",
      "resumen-minuta",
      meetingId,
    ],
    GESTION_MINUTA: (id: string) => [
      "/committee-meetings",
      "gestion-minuta",
      id,
    ],
    MINUTAS_PENDIENTES: ["/committee-meetings", "minuta-pendientes"],
    SEGUIMIENTO_MINUTAS: (area: string) => [
      "/committee-meetings",
      "seguimiento-minutas",
      area,
    ],
  },

  // ============================================================
  // COMPRAS
  // ============================================================
  COMPRAS: {
    PRESUPUESTO: ["/purchases", "presupuesto"],
    PRODUCTOS_SERVICIOS: ["/purchases", "products-services"],
    SOLICITUDES: ["/purchases", "purchase-requests"],
    SOLICITUD: (id: string) => ["/purchases", "solicitud-compra", id],
    PDF_SOLICITUD: (id: string) => ["/purchases", "pdf-solicitud-compra", id],
    CUADRO_COMPARATIVO: (id: string) => [
      "/purchases",
      "cuadro-comparativo",
      id,
    ],
    PRESENTACION_SOLICITUDES: ["/purchases", "solicitud-compra-presentacion"],
    CATALOGO_GASTOS_FIJOS: ["/purchases", "fixed-expenses-catalog"],
    GASTO_FIJO_FORM: (id: string) => [
      "/purchases",
      "catalogo-gastos-fijos-form",
      id,
    ],
    ORDENES_COMPRA: ["/purchases", "purchase-orders"],
    ORDEN_COMPRA: (id: string) => ["/purchases", "orden-compra", id],
    PDF_ORDEN_COMPRA: (id: string) => ["/purchases", "orden-compra-pdf", id],
    PDF_SOLICITUD_PAGO: (id: string) => [
      "/purchases",
      "solicitud-pago-pdf",
      id,
    ],
    ORDENES_PAGADAS: ["/purchases", "paid"],
    PRESUPUESTO_MANTENIMIENTO: ["/purchases", "maintenance-budget"],
  },

  // ============================================================
  // LEGAL
  // ============================================================
  LEGAL: {
    MINUTAS_PENDIENTES: ["/legal", "legal-minutes-pendings"],
    LISTA_TICKETS: ["/legal", "list-ticket-legal"],
    PENDIENTES: ["/legal", "pendings"],
    REPORTES_INTERNOS: ["/legal", "reports-internal"],
    REPORTES_EXTERNOS: ["/legal", "reports-external"],
    DIRECTORIO_COMITES: ["/legal", "committee-directory"],
    ASUNTO_LEGAL: ["/legal", "legal-matter"],
    LISTA_TICKET_CLIENTE: ["/legal", "list-ticket-customer"],
    TICKET: (ticketId: string) => ["/legal", "ticket", ticketId],
    DOCUMENTOS: ["/legal", "documents"],
    DOCUMENTO_INFORME_FINANCIERO: ["/legal", "documents", "financial-report"],
    DOCUMENTO_PLANTILLAS: ["/legal", "documents", "templates"],
    DOCUMENTO_MANUALES: ["/legal", "documents", "manuals-and-processes"],
    DOCUMENTO_POLIZAS: ["/legal", "documents", "maintenance-policy"],
    DOCUMENTO_ACTAS: ["/legal", "documents", "incorporation-deeds"],
    DOCUMENTO_ASAMBLEAS: ["/legal", "documents", "assemblies"],
    DOCUMENTO_REGLAMENTOS: ["/legal", "documents", "regulations"],
    DOCUMENTO_CONTRATOS: ["/legal", "documents", "employee-contracts"],
    DOCUMENTO_JUICIOS: ["/legal", "documents", "lawsuits"],
    DOCUMENTO_PLANOS: ["/legal", "documents", "blueprints"],
    DOCUMENTO_CONCESION_BARRANCA: ["/legal", "documents", "ravine-concession"],
    DOCUMENTO_CONCESION_POZO: ["/legal", "documents", "well-concession"],
  },

  // ============================================================
  // BITÁCORAS (LOGBOOK)
  // ============================================================
  BITACORAS: {
    ORDENES_SERVICIO: ["/logbook", "maintenance-orders"],
    INSPECCIONES_AREAS: ["/logbook", "inspections-areas"],
    ALBERCA: ["/logbook", "pool"],
    ALBERCA_BITACORA: (piscinaId: string) => [
      "/logbook",
      "piscina-bitacora",
      piscinaId,
    ],
    MEDIDORES: ["/logbook", "meter-list"],
    MEDIDOR_LECTURA: (id: string) => ["/logbook", "lista-medidor-lectura", id],
    MEDIDOR_GRAFICO: (id: string) => ["/logbook", "grafico", id],
    CAMBIO_REFACCIONES_ELEVADOR: ["/logbook", "elevator-spare-parts-change"],
    FALLA_ELEVADORES: ["/logbook", "elevators-emergency-call"],
    MI_INSPECCION: (customerInspectionId: string) => [
      "/logbook",
      "my-inspection",
      customerInspectionId,
    ],
    RECEPCION_PIPAS_AGUA: ["/logbook", "water-truck-reception"],
    RECEPCION_PIPAS_REPORTE: ["/logbook", "water-truck-reception", "reporte"],
    RECEPCION_PIPAS_ANALISIS: ["/logbook", "water-truck-reception", "analisis"],
    EXTINTOR_BITACORA: (extinguisherId: string) => [
      "/logbook",
      "fire-extinguisher-log",
      extinguisherId,
    ],
    EXTINTOR_CHECKLIST: (id: string) => [
      "/logbook",
      "fire-extinguisher-checklist",
      id,
    ],
    SCANNER_EQUIPOS: ["/logbook", "fire-equipment-scanner"],
    INSPECCION_EQUIPO: (code: string) => [
      "/logbook",
      "equipment-inspection",
      code,
    ],
    HIDRANTE_BITACORA: (hydrantId: string) => [
      "/logbook",
      "hydrant-log",
      hydrantId,
    ],
    HIDRANTE_CHECKLIST: (id: string) => ["/logbook", "hydrant-checklist", id],
    ESTACION_MANUAL_BITACORA: (stationId: string) => [
      "/logbook",
      "manual-call-point-log",
      stationId,
    ],
    ESTACION_MANUAL_CHECKLIST: (id: string) => [
      "/logbook",
      "manual-call-point-checklist",
      id,
    ],
    DETECTOR_HUMO_BITACORA: (detectorId: string) => [
      "/logbook",
      "smoke-detector-log",
      detectorId,
    ],
    DETECTOR_HUMO_CHECKLIST: (id: string) => [
      "/logbook",
      "smoke-detector-checklist",
      id,
    ],
    PERIODOS_INSPECCION: ["/logbook", "fire-inspection-periods"],
    CICLOS_INSPECCION: ["/logbook", "fire-inspection-cycles"],
    CICLO_INSPECCION: (cycleId: string) => [
      "/logbook",
      "fire-inspection-cycle",
      cycleId,
    ],
    PERIODO_EXTINTOR: (periodId: string) => [
      "/logbook",
      "fire-inspection-period-extintor",
      periodId,
    ],
    PERIODO_HIDRANTE: (periodId: string) => [
      "/logbook",
      "fire-inspection-period-hidrante",
      periodId,
    ],
    PERIODO_ESTACION: (periodId: string) => [
      "/logbook",
      "fire-inspection-period-estacion",
      periodId,
    ],
    PERIODO_DETECTOR: (periodId: string) => [
      "/logbook",
      "fire-inspection-period-detector",
      periodId,
    ],
  },

  // ============================================================
  // INVENTARIOS
  // ============================================================
  INVENTARIOS: {
    SISTEMA_INVENTARIO: ["/inventory", "inventory-engine-system"],
    EQUIPOS_AREAS: ["/inventory", "areas-equipment"],
    GIMNASIO: ["/inventory", "gimnasio"],
    HERRAMIENTAS: ["/inventory", "tools"],
    PINTURA: ["/inventory", "pintura"],
    LLAVES: ["/inventory", "keys"],
    REPORTE_EQUIPOS: ["/inventory", "reporte-equipos"],
    RADIOS: ["/inventory", "radios"],
    CEDULA_MANTENIMIENTOS: ["/inventory", "cedula-anual-mantenimientos"],
    EXTINTORES: ["/inventory", "extinguishers"],
    EXTINTORES_GRUPO: ["/inventory", "extintores-group"],
    HIDRANTES: ["/inventory", "hydrants"],
    ESTACIONES_MANUALES: ["/inventory", "manual-call-points"],
    DETECTORES_HUMO: ["/inventory", "smoke-detectors"],
  },

  // ============================================================
  // MANTENIMIENTO
  // ============================================================
  MANTENIMIENTO: {
    CALENDARIO_ANUAL: ["/maintenance", "annual-calendar"],
  },

  // ============================================================
  // OPERACIONES
  // ============================================================
  OPERACIONES: {
    MI_EDIFICIO: ["/operations", "my-building"],
    INVENTARIO_PRODUCTOS: ["/operations", "inventario-productos"],
    EXTINTORES: ["/operations", "extintores"],
    EXTINTORES_GRUPO: ["/operations", "extintores-group"],
    ALERTAS_PANICO: ["/operations", "alertas-panico"],
    ALERTAS_PANICO_DETALLE: (id: string) => [
      "/operations",
      "alertas-panico",
      id,
    ],
  },

  // ============================================================
  // RECLUTAMIENTO
  // ============================================================
  RECLUTAMIENTO: {
    PLANTILLA_INTERNA: ["/recruitment"],
    SOLICITUDES: ["/recruitment", "requests"],
    SOLICITUDES_VACANTES: ["/recruitment", "requests", "vacancies"],
    SOLICITUDES_ALTAS: ["/recruitment", "requests", "hirings"],
    SOLICITUDES_BAJAS: ["/recruitment", "requests", "dismissals"],
    SOLICITUDES_AUMENTO_SUELDO: ["/recruitment", "requests", "salary-increase"],
    STATUS_SOLICITUD_VACANTE: ["/recruitment", "status-solicitud-vacante"],
    STATUS_SOLICITUD_BAJA: ["/recruitment", "status-solicitud-baja"],
    STATUS_MODIFICACION_SALARIO: [
      "/recruitment",
      "status-solicitud-modificacion-salario",
    ],
    SOLICITUDES_CLIENTE: ["/recruitment", "solicitudes_cliente"],
    SOLICITUDES_BAJA_LISTA: ["/recruitment", "dismissal-requests"],
  },

  // ============================================================
  // REPORTES
  // ============================================================
  REPORTES: {
    SUPERVISION: ["/report", "supervision-report"],
    HISTORIAL_ACCESO: ["/report", "access-history"],
    MANTENIMIENTO: ["/report", "maintenance-report"],
    RESUMEN_ORDENES_SERVICIO: ["/report", "resumen-ordenes-servicio"],
    MINUTAS_PENDIENTES: ["/report", "pending-minutes"],
    ESTADOS_FINANCIEROS: ["/report", "financial-statements"],
    MANTENIMIENTO_PANEL: ["/report", "maintenance-report", "panel"],
    MANTENIMIENTO_RESUMEN: [
      "/report",
      "maintenance-report",
      "maintenances-summary",
    ],
    MANTENIMIENTO_CONSUMOS: ["/report", "maintenance-report", "consumptions"],
    MANTENIMIENTO_ENTRADA_ALMACEN: [
      "/report",
      "maintenance-report",
      "warehouse-entry",
    ],
    MANTENIMIENTO_SALIDA_ALMACEN: [
      "/report",
      "maintenance-report",
      "warehouse-exit",
    ],
    MANTENIMIENTO_RECORRIDO: ["/report", "maintenance-report", "daily-tour"],
    MANTENIMIENTO_PRESTAMO_HERRAMIENTA: [
      "/report",
      "maintenance-report",
      "tool-loan-report",
    ],
    MANTENIMIENTO_SOLICITUD_COMPRA: [
      "/report",
      "maintenance-report",
      "purchase-request-report",
    ],
    MANTENIMIENTO_BITACORA_ALBERCA: [
      "/report",
      "maintenance-report",
      "pool-report",
    ],
    MANTENIMIENTO_TICKETS: ["/report", "maintenance-report", "tickets"],
    MANTENIMIENTO_ELEVADORES: ["/report", "maintenance-report", "elevators"],
    SOPORTE_ORDEN_SERVICIO: (id: string) => [
      "/report",
      "maintenance-report",
      "soporte-orden-servicio",
      id,
    ],
  },

  // ============================================================
  // DIAGRAMAS
  // ============================================================
  DIAGRAMAS: {
    LISTA: ["/diagram"],
    EDITOR: (id: string) => ["/diagram", "editor", id],
    GALERIA: ["/diagram", "gallery"],
    VER: (id: string) => ["/diagram", "view", id],
  },

  // ============================================================
  // SUPERVISIÓN
  // ============================================================
  SUPERVISION: {
    DASHBOARD: ["/supervision"],
    AGENDA: ["/supervision", "supervision-agenda"],
    RESUMEN_MINUTAS: ["/supervision", "minutes-summary"],
    REPORTE_TICKETS: ["/supervision", "tickets-report"],
    GRAFICO_RESULTADO: ["/supervision", "grafico-resultado-general"],
    RESULTADO_POSICION: ["/supervision", "resultado-general-posicion"],
    EVALUACION_AREAS: ["/supervision", "areas-evaluation"],
    RESULTADO_DASHBOARD: ["/supervision", "general-result-dashboard"],
    REPORTE_SUPERVISION: ["/supervision", "supervision-report"],
    PRESENTACIONES_JUNTAS: ["/supervision", "presentaciones-juntas-comite"],
  },

  // ============================================================
  // TICKETS / TAREAS
  // ============================================================
  TICKETS: {
    GRUPOS_TRABAJO: ["/tickets", "groups-list"],
    MIS_ASIGNACIONES: ["/tickets", "my-assignments"],
    MIS_SOLICITUDES: ["/tickets", "my-requests"],
    MENSAJES: (ticketGroupId: string) => [
      "/tickets",
      "messages",
      ticketGroupId,
    ],
    PENDIENTES: (ticketGroupId: string) => [
      "/tickets",
      "pending-board",
      ticketGroupId,
    ],
    MENSAJE: (ticketMessageId: string, ticketGroupId: string) => [
      "/tickets",
      "message",
      ticketMessageId,
      ticketGroupId,
    ],
    REPORTES: ["/tickets", "reports"],
    RESUMEN: ["/tickets", "summary"],
    PLAN_TRABAJO: ["/tickets", "work-plan"],
    PLAN_TRABAJO_VISTA: ["/tickets", "work-plan-preview"],
    REPORTE_SEMANAL: ["/tickets", "weekly-report"],
    REPORTE_SEMANAL_VISTA: ["/tickets", "weekly-report-preview"],
    LEGAL: ["/tickets", "legal"],
    LEGAL_GRUPO: (ticketGroupId: string) => [
      "/tickets",
      "legal",
      ticketGroupId,
    ],
  },

  // ============================================================
  // UTILIDADES
  // ============================================================
  UTILIDADES: {
    CALCULADORA_IVA: ["/utilities", "calculate-vat"],
  },

  // ============================================================
  // EVALUACIÓN DE EMPLEADOS
  // ============================================================
  EVALUACION_EMPLEADOS: {
    PLANTILLAS_LISTA: ["/employee-evaluation", "templates", "list"],
    PLANTILLA_CREAR: ["/employee-evaluation", "templates", "create"],
    PLANTILLA_EDITAR: (id: string) => [
      "/employee-evaluation",
      "templates",
      "edit",
      id,
    ],
    CONDUCTA_CREAR: ["/employee-evaluation", "conduct", "create"],
    CONDUCTA_EDITAR: (id: string) => [
      "/employee-evaluation",
      "conduct",
      "edit",
      id,
    ],
    CONDUCTA_LISTA: ["/employee-evaluation", "conduct", "list"],
    HISTORIAL_EMPLEADO: (employeeId: string) => [
      "/employee-evaluation",
      "employee",
      employeeId,
      "history",
    ],
    RESULTADO: (id: string) => ["/employee-evaluation", "result", id],
  },

  // ============================================================
  // RECURSOS HUMANOS
  // ============================================================
  RECURSOS_HUMANOS: {
    DASHBOARD: ["/recursos-humanos"],
    MIS_PERMISOS: ["/recursos-humanos", "my-requests"],
    SOLICITAR_PERMISO: ["/recursos-humanos", "solicitar-permiso"],
    PERMISO_DETALLE: (id: string) => [
      "/recursos-humanos",
      "permiso",
      id,
      "detalle",
    ],
    APROBACIONES: ["/recursos-humanos", "approval"],
    SOLICITAR_VACACIONES: ["/recursos-humanos", "solicitar-vacaciones"],
    MIS_VACACIONES: ["/recursos-humanos", "my-vacations"],
    VACACIONES_DETALLE: (id: string) => [
      "/recursos-humanos",
      "vacaciones",
      id,
      "detalle",
    ],
    SALDO_VACACIONES: ["/recursos-humanos", "saldo-vacaciones"],
    CALENDARIO_VACACIONES: ["/recursos-humanos", "vacation-calendar"],
    VACACIONES_PASADAS: ["/recursos-humanos", "register-past-vacations"],
    HISTORIAL_SOLICITUDES: ["/recursos-humanos", "requests-history"],
    ADMIN_BALANCES_VACACIONES: [
      "/recursos-humanos",
      "admin-balances-vacaciones",
    ],
    AUDITORIA_VACACIONES: ["/recursos-humanos", "auditoria-vacaciones"],
    CHECADOR: ["/recursos-humanos", "chekador-empleados"],
    CONTRATOS: ["/recursos-humanos", "contracts"],
    PLANTILLAS_CONTRATOS: ["/recursos-humanos", "contract-templates"],
    ADENDAS: ["/recursos-humanos", "contract-addendums"],
    PLANTILLAS_ADENDAS: ["/recursos-humanos", "addendum-templates"],
    INCIDENCIAS: ["/recursos-humanos", "incidents"],
    DASHBOARD_INCIDENCIAS: ["/recursos-humanos", "incident-dashboard"],
    REPORTES_INCIDENCIAS: ["/recursos-humanos", "incident-reports"],
    EXPEDIENTES: ["/recursos-humanos", "employee-files"],
    EXPEDIENTE: (employeeId: string) => [
      "/recursos-humanos",
      "employee-files",
      employeeId,
    ],
    SANCIONES: ["/recursos-humanos", "sanctions"],
    DATOS_BANCARIOS: ["/recursos-humanos", "bank-data"],
    NOMINA: {
      DASHBOARD: ["/recursos-humanos", "nomina"],
      CONFIGURACION: ["/recursos-humanos", "nomina", "configuracion"],
      PERIODOS: ["/recursos-humanos", "nomina", "periodos"],
      NOMINAS: ["/recursos-humanos", "nomina", "nominas"],
      NOMINA_DETALLE: (id: string) => [
        "/recursos-humanos",
        "nomina",
        "nominas",
        id,
        "detalle",
      ],
      INCIDENCIAS: ["/recursos-humanos", "nomina", "incidencias"],
      TIEMPO_EXTRA: ["/recursos-humanos", "nomina", "tiempo-extra"],
      PRESTAMOS: ["/recursos-humanos", "nomina", "prestamos"],
      EVIDENCIAS: ["/recursos-humanos", "nomina", "evidencias"],
      HOJA_INCIDENCIAS: ["/recursos-humanos", "nomina", "hoja-incidencias"],
    },
  },

  // ============================================================
  // TAREAS RECURRENTES
  // ============================================================
  TAREAS_RECURRENTES: {
    LISTA: ["/recurring-tasks"],
    ITEMS: (id: string) => ["/recurring-tasks", id, "items"],
    CONFIGURACION_CLIENTE: ["/recurring-tasks", "customer-config"],
    MIS_TAREAS: ["/recurring-tasks", "my-tasks"],
  },

  // ============================================================
  // GESTOR DE CONTRASEÑAS
  // ============================================================
  GESTOR_CONTRASENAS: {
    LISTA: ["/password-manager"],
  },

  // ============================================================
  // RUTAS STANDALONE
  // ============================================================
  STANDALONE: {
    REPORTE_ESTADOS_FINANCIEROS: ["/report-financial-statements"],
    CATALOGO_REPLICA: ["/catalog-replica"],
    BALANCE_MENSUAL: ["/balance-mensual"],
    ENTREGA_RECEPCION_CHECK: ["/entrega-recepcion-check"],
  },

  // ============================================================
  // RUTAS DE ARQUITECTURA 8 MÓDULOS
  // ============================================================
  SISTEMA: {
    HOME: ["/system"],
  },
  CONTABILIDAD_LEGACY: {
    PRESUPUESTO: ["/accounting", "budget"],
    CATALOGO_CUENTAS: ["/accounting", "accounting-catalog"],
    MINUTAS_PENDIENTES: ["/accounting", "minutes-pendings"],
    LISTA_FONDEOS: ["/accounting", "funding-list"],
    DETALLE_FONDEO: (id: string) => ["/accounting", "funding-details", id],
    MINUTAS_PENDIENTES_LEGALES: ["/accounting", "legal-minutes-pendings"],
    EJECUCION_PRESUPUESTO: ["/accounting", "budget-execution"],
    ENVIO_REPORTE_FINANCIERO: ["/accounting", "financial-report-sending"],
    ESTADOS_FINANCIEROS: ["/accounting", "financial-statements"],
    RESUMEN_FINANCIERO: ["/accounting", "financial-summary"],
    PROPUESTA_PRESUPUESTO: ["/accounting", "budget-proposal"],
    CLIENTES_ASPEL: ["/accounting", "aspel-customer-empresa"],
    SINCRONIZACION_ASPEL: ["/accounting", "aspel-sync"],
  },
  RH: {
    HOME: ["/hr"],
  },
  COMPRAS_NUEVO: {
    HOME: ["/purchasing"],
  },
  IMPLEMENTACION_INICIAL: {
    ENCUESTA_MAQUINARIA: ["/initial-implementation", "machinery-survey"],
    EVALUACION_PERSONAL: ["/initial-implementation", "staff-evaluation"],
    PROYECTOS_PENDIENTES: [
      "/initial-implementation",
      "pending-vendor-projects",
    ],
    POLIZAS_ACTIVAS: ["/initial-implementation", "active-policies"],
  },
} as const;
