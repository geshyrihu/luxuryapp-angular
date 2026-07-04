import { CommonModule } from "@angular/common";
import { Component, ElementRef, AfterViewInit } from "@angular/core";
import { RouterModule } from "@angular/router";

interface IAreaCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  gradient: string;
  accent: string;
}

@Component({
  selector: "app-landing-page",
  imports: [CommonModule, RouterModule],
  templateUrl: "./landing-page.html",
  styleUrls: ["./landing-page.scss"],
})
export class LandingPage implements AfterViewInit {
  public areas: IAreaCard[] = [
    {
      title: "Legal",
      description: "Gestión de contratos, asesoría jurídica, cumplimiento normativo y protección legal de los condóminos.",
      icon: "⚖",
      route: "/web/legal",
      gradient: "linear-gradient(135deg, #1b365d 0%, #2a4d7c 100%)",
      accent: "#2a4d7c",
    },
    {
      title: "Operaciones",
      description: "Supervisión diaria del residencial, coordinación de servicios, control de acceso y gestión de incidencias.",
      icon: "⚙",
      route: "/web/operations",
      gradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
      accent: "#0f766e",
    },
    {
      title: "Mantenimiento",
      description: "Planificación y ejecución de mantenimiento preventivo y correctivo de instalaciones y equipos comunes.",
      icon: "🔧",
      route: "/web/maintenance",
      gradient: "linear-gradient(135deg, #c2410c 0%, #ea580c 100%)",
      accent: "#c2410c",
    },
    {
      title: "Contabilidad",
      description: "Administración financiera, cobro de cuotas de mantenimiento, estados financieros y auditorías.",
      icon: "📊",
      route: "/web/accounting",
      gradient: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
      accent: "#15803d",
    },
    {
      title: "Recursos Humanos",
      description: "Gestión del personal, nómina, capacitación, contratación y clima laboral del equipo administrativo.",
      icon: "👥",
      route: "/web/hr",
      gradient: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
      accent: "#4338ca",
    },
  ];

  stats = [
    { value: "15+", label: "Años de experiencia" },
    { value: "120+", label: "Residenciales administrados" },
    { value: "98%", label: "Satisfacción de clientes" },
    { value: "50+", label: "Profesionales en equipo" },
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
