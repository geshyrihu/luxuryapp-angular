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
