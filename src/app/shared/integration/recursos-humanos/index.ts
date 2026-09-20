// ═══════════════════app shared integration contract═════════════════
// Contrato de integración: re-exporta los artefactos de dominio de
// `recursos-humanos.luxuryapp` que otros módulos (p.ej. reclutamiento,
// supplier) necesitan consumir, SIN cruzar la frontera de apps/.
// ═══════════════════════════════════════════════════════════════════
export * from "@recruitment.luxuryapp/employees/employee-internal.service";
export * from "@recruitment.luxuryapp/employee-file/employees/employee-registry/card-employee";
export * from "@recruitment.luxuryapp/employee-file/employees/employee-registry/interfaces/employee.interface";

