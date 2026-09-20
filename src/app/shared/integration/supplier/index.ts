// ═══════════════════app shared integration contract═════════════════
// Contrato de integración: re-exporta los artefactos de dominio de
// `supplier.luxuryapp` que otros módulos (p.ej. recursos-humanos)
// necesitan consumir, SIN cruzar la frontera de apps/.
// ═══════════════════════════════════════════════════════════════════
export * from "@operations.luxuryapp/providers/employee-provider-form";

