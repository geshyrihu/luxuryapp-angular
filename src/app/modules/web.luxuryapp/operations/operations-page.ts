import {
  Component,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-operations-page",
  imports: [RouterModule],
  templateUrl: "./operations-page.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./operations-page.scss"],
})
export class OperationsPage implements AfterViewInit {
  services = [
    {
      icon: "🏗",
      title: "Supervisión Diaria",
      desc: "Monitoreo constante de instalaciones, personal y servicios del residencial para asegurar su correcto funcionamiento.",
    },
    {
      icon: "👥",
      title: "Control de Personal",
      desc: "Gestión de turnos, tareas y desempeño del personal operativo, vigilancia y limpieza.",
    },
    {
      icon: "🔔",
      title: "Gestión de Incidencias",
      desc: "Atención y resolución de reportes de los condóminos, desde fallas técnicas hasta quejas de convivencia.",
    },
    {
      icon: "🚪",
      title: "Control de Acceso",
      desc: "Administración de sistemas de acceso, visitas, correspondencia y seguridad perimetral.",
    },
  ];

  process = [
    {
      title: "Diagnóstico Operativo",
      desc: "Evaluamos procesos actuales y detectamos áreas de mejora.",
    },
    {
      title: "Planificación",
      desc: "Diseñamos protocolos operativos eficientes.",
    },
    {
      title: "Implementación",
      desc: "Ejecutamos las mejoras con acompañamiento continuo.",
    },
    {
      title: "Optimización Continua",
      desc: "Ajustamos procesos basados en resultados y feedback.",
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
