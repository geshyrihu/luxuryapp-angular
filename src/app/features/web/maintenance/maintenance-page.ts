import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

interface IProcedure {
  id: string;
  title: string;
  objective: string;
  icon: string;
  gradient: string;
  steps: number;
}

@Component({
  selector: "app-maintenance-page",
  imports: [CommonModule, RouterModule],
  templateUrl: "./maintenance-page.html",
  styleUrls: ["./maintenance-page.scss"],
})
export class MaintenancePage {
  public procedures: IProcedure[] = [
    {
      id: "cleaning-classification",
      title: "Limpieza de Áreas y Clasificación de Objetos",
      objective:
        "Mantener las áreas comunes, bodegas y talleres limpios, organizados y libres de objetos innecesarios, clasificando cada elemento según su estado y destino final.",
      icon: "mdi:broom",
      gradient: "linear-gradient(135deg, #c2410c 0%, #ea580c 100%)",
      steps: 9,
    },
    {
      id: "preventive-maintenance",
      title: "Mantenimiento Preventivo de Instalaciones",
      objective:
        "Ejecutar inspecciones y mantenimiento programado en instalaciones eléctricas, hidrosanitarias y equipos comunes para alargar su vida útil.",
      icon: "mdi:shield-check",
      gradient: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
      steps: 6,
    },
    {
      id: "emergency-response",
      title: "Atención a Emergencias y Averías",
      objective:
        "Responder de forma rápida y eficiente ante fallas críticas, minimizando el impacto en los condóminos y protegiendo la infraestructura.",
      icon: "mdi:alert-circle",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
      steps: 5,
    },
    {
      id: "machinery-survey",
      title: "Levantamiento de Maquinaria y Equipos",
      objective:
        "Inventariar, clasificar y diagnosticar el estado de toda la maquinaria y equipos del residencial para planificar su mantenimiento y reparación.",
      icon: "mdi:cog",
      gradient: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
      steps: 8,
    },
    {
      id: "budget-preparation",
      title: "Preparación de Presupuestos de Mantenimiento",
      objective:
        "Consolidar diagnósticos, cotizaciones y calendarios en un presupuesto estructurado listo para presentar a dirección o asamblea.",
      icon: "mdi:file-document",
      gradient: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
      steps: 6,
    },
    {
      id: "staff-evaluation",
      title: "Evaluación de Personal de Mantenimiento",
      objective:
        "Evaluar al equipo de mantenimiento con criterios claros y justos: antigüedad, conocimiento, puntualidad y actitud.",
      icon: "mdi:account-check",
      gradient: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
      steps: 4,
    },
    {
      id: "supplies-inventory",
      title: "Control de Inventario de Insumos",
      objective:
        "Registrar, organizar y controlar los insumos de mantenimiento en almacén, con depuración periódica y niveles mínimos de stock.",
      icon: "mdi:package-variant",
      gradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
      steps: 8,
    },
    {
      id: "tools-inventory",
      title: "Control de Inventario de Herramientas",
      objective:
        "Inventariar, diagnosticar, organizar y controlar las herramientas del equipo de mantenimiento para trabajar de forma eficiente y segura.",
      icon: "mdi:toolbox",
      gradient: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
      steps: 8,
    },
    {
      id: "common-areas-inventory",
      title: "Inventario de Áreas Comunes",
      objective:
        "Registrar y diagnosticar todos los bienes muebles e instalaciones en áreas comunes para su correcta administración y mantenimiento.",
      icon: "mdi:domain",
      gradient: "linear-gradient(135deg, #0369a1 0%, #06b6d4 100%)",
      steps: 8,
    },
    {
      id: "supplier-review",
      title: "Revisión de Contratos y Proveedores",
      objective:
        "Controlar contratos, trabajos pendientes, pólizas vigentes, reclamos y demandas con proveedores de servicios y mantenimiento.",
      icon: "mdi:file-sign",
      gradient: "linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
      steps: 9,
    },
    {
      id: "green-areas",
      title: "Mantenimiento de Áreas Verdes",
      objective:
        "Conservar jardines, áreas de esparcimiento y fachadas en óptimas condiciones estéticas y funcionales durante todo el año.",
      icon: "mdi:leaf",
      gradient: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
      steps: 7,
    },
  ];
}
