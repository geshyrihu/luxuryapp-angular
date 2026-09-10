import {
  Component,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { RouterModule } from "@angular/router";

interface IProcedure {
  id: string;
  title: string;
  objective: string;
  icon: string;
  emoji: string;
  gradient: string;
  steps: number;
}

@Component({
  selector: "app-maintenance-page",
  imports: [RouterModule],
  templateUrl: "./maintenance-page.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./maintenance-page.scss"],
})
export class MaintenancePage implements AfterViewInit {
  public procedures: IProcedure[] = [
    {
      id: "inspection-rounds",
      title: "Rutinas y Recorridos de Revisión de Equipos y Áreas",
      objective:
        "Establecer rutinas diarias, semanales y mensuales de recorridos de inspección en equipos críticos y áreas comunes con listas de verificación estandarizadas.",
      icon: "material-symbols-light:fact-check",
      emoji: "📝",
      gradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
      steps: 9,
    },
    {
      id: "cleaning-classification",
      title: "Limpieza de Áreas y Clasificación de Objetos",
      objective:
        "Mantener las áreas comunes, bodegas y talleres limpios, organizados y libres de objetos innecesarios.",
      icon: "material-symbols-light:cleaning-services",
      emoji: "🧹",
      gradient: "linear-gradient(135deg, #c2410c 0%, #ea580c 100%)",
      steps: 9,
    },
    {
      id: "preventive-maintenance",
      title: "Mantenimiento Preventivo de Instalaciones",
      objective:
        "Ejecutar inspecciones y mantenimiento programado en instalaciones eléctricas, hidrosanitarias y equipos comunes.",
      icon: "material-symbols-light:verified",
      emoji: "🛡",
      gradient: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
      steps: 6,
    },
    {
      id: "emergency-response",
      title: "Atención a Emergencias y Averías",
      objective:
        "Responder de forma rápida y eficiente ante fallas críticas, minimizando el impacto en los condóminos.",
      icon: "material-symbols-light:error",
      emoji: "⚡",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
      steps: 5,
    },
    {
      id: "machinery-survey",
      title: "Levantamiento de Maquinaria y Equipos",
      objective:
        "Inventariar, clasificar y diagnosticar el estado de toda la maquinaria y equipos del residencial.",
      icon: "material-symbols-light:settings",
      emoji: "⚙",
      gradient: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
      steps: 8,
    },
    {
      id: "budget-preparation",
      title: "Preparación de Presupuestos de Mantenimiento",
      objective:
        "Consolidar diagnósticos, cotizaciones y calendarios en un presupuesto estructurado.",
      icon: "material-symbols-light:description",
      emoji: "📋",
      gradient: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
      steps: 6,
    },
    {
      id: "staff-evaluation",
      title: "Evaluación de Personal de Mantenimiento",
      objective:
        "Evaluar al equipo de mantenimiento con criterios claros y justos.",
      icon: "material-symbols-light:person-check",
      emoji: "👤",
      gradient: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
      steps: 4,
    },
    {
      id: "supplies-inventory",
      title: "Control de Inventario de Insumos",
      objective:
        "Registrar, organizar y controlar los insumos de mantenimiento en almacén.",
      icon: "material-symbols-light:package",
      emoji: "📦",
      gradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
      steps: 8,
    },
    {
      id: "tools-inventory",
      title: "Control de Inventario de Herramientas",
      objective:
        "Inventariar, diagnosticar, organizar y controlar las herramientas del equipo.",
      icon: "material-symbols-light:home-repair-service",
      emoji: "🧰",
      gradient: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
      steps: 8,
    },
    {
      id: "common-areas-inventory",
      title: "Inventario de Áreas Comunes",
      objective:
        "Registrar y diagnosticar todos los bienes muebles e instalaciones en áreas comunes.",
      icon: "material-symbols-light:domain",
      emoji: "🏢",
      gradient: "linear-gradient(135deg, #0369a1 0%, #06b6d4 100%)",
      steps: 8,
    },
    {
      id: "supplier-review",
      title: "Revisión de Contratos y Proveedores",
      objective:
        "Controlar contratos, trabajos pendientes, pólizas vigentes y reclamos con proveedores.",
      icon: "material-symbols-light:edit-note",
      emoji: "📋",
      gradient: "linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
      steps: 9,
    },
    {
      id: "green-areas",
      title: "Mantenimiento de Áreas Verdes",
      objective:
        "Conservar jardines, áreas de esparcimiento y fachadas en óptimas condiciones.",
      icon: "material-symbols-light:eco",
      emoji: "🌿",
      gradient: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
      steps: 7,
    },
  ];

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );
    this.elementRef.nativeElement
      .querySelectorAll(".animate-on-scroll")
      .forEach((el: HTMLElement) => observer.observe(el));
  }
}
