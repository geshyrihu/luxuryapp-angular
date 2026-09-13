// ═══════════════════app shared integration contract═════════════════
// Contrato de integración: re-exporta los artefactos de dominio de
// `recursos-humanos.luxuryapp` que otros módulos (p.ej. reclutamiento,
// supplier) necesitan consumir, SIN cruzar la frontera de apps/.
// ═══════════════════════════════════════════════════════════════════
export * from "src/app/modules/recruitment.luxuryapp/employee/employee-internal.service";
export * from "src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/employees/card-employee";
export * from "src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/employees/interfaces/employee.interface";
