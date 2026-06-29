import { EDocumentType } from "./document-type.enum";
// Mapeo de EDocumentType a nombres de carpeta y tótulos para las rutas

export const documentTypeRoutesConfig = [
  // {
  //   type: EDocumentType.BuildingDocuments,
  //   routeParam: "documentos-edificio", // Usar guiones para URLs
  //   title: "Documentos del Edificio",
  //   breadcrumb: "Documentos del Edificio",
  // },
  {
    type: EDocumentType.FinancialReport,
    routeParam: "financial-report", // Ruta anterior: 'informe-financiero'
    title: "Informe Financiero",
    breadcrumb: "Informe Financiero",
  },
  {
    type: EDocumentType.Template,
    routeParam: "templates", // Ruta anterior: 'formatos'
    title: "Formato",
    breadcrumb: "Formato",
  },
  {
    type: EDocumentType.ManualsAndProcesses,
    routeParam: "manuals-and-processes", // Ruta anterior: 'manuales-y-procesos'
    title: "Manuales y Procesos",
    breadcrumb: "Manuales y Procesos",
  },
  {
    type: EDocumentType.MaintenancePolicy,
    routeParam: "maintenance-policy", // Ruta anterior: 'poliza-mantenimiento'
    title: "Póliza de Mantenimiento",
    breadcrumb: "Póliza de Mantenimiento",
  },
  {
    type: EDocumentType.ActaConstitutiva,
    routeParam: "incorporation-deeds", // Ruta anterior: 'actas-constitutivas'
    title: "Acta Constitutiva",
    breadcrumb: "Acta Constitutiva",
  },
  {
    type: EDocumentType.Asambleas,
    routeParam: "assemblies", // Ruta anterior: 'asambleas'
    title: "Asambleas",
    breadcrumb: "Asambleas",
  },
  {
    type: EDocumentType.Reglamentos,
    routeParam: "regulations", // Ruta anterior: 'reglamentos'
    title: "Reglamentos",
    breadcrumb: "Reglamentos",
  },
  {
    type: EDocumentType.ContratosEmpleados,
    routeParam: "employee-contracts", // Ruta anterior: 'contratos-empleados'
    title: "Contratos Empleados",
    breadcrumb: "Contratos Empleados",
  },
  {
    type: EDocumentType.Juicios,
    routeParam: "lawsuits", // Ruta anterior: 'juicios'
    title: "Juicios",
    breadcrumb: "Juicios",
  },
  {
    type: EDocumentType.Planos,
    routeParam: "blueprints", // Ruta anterior: 'planos'
    title: "Planos",
    breadcrumb: "Planos",
  },
  {
    type: EDocumentType.ConcesionBarranca,
    routeParam: "ravine-concession", // Ruta anterior: 'concesion-barranca'
    title: "Concesión Barranca",
    breadcrumb: "Concesión Barranca",
  },
  {
    type: EDocumentType.ConcesionPozo,
    routeParam: "well-concession", // Ruta anterior: 'concesion-pozo'
    title: "Concesión Pozo",
    breadcrumb: "Concesión Pozo",
  },
];









