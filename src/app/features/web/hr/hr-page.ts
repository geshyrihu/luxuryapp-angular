import { CommonModule } from "@angular/common";
import { Component, ElementRef, AfterViewInit } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-hr-page",
  imports: [CommonModule, RouterModule],
  templateUrl: "./hr-page.html",
  styleUrls: ["./hr-page.scss"],
})
export class HrPage implements AfterViewInit {
  services = [
    { icon: "🔍", title: "Reclutamiento y Selección", desc: "Procesos de selección rigurosos para incorporar al personal más calificado y confiable." },
    { icon: "📚", title: "Capacitación Continua", desc: "Programas de formación y actualización para mejorar las habilidades del equipo administrativo y operativo." },
    { icon: "📋", title: "Administración de Nómina", desc: "Gestión completa de nómina, prestaciones, IMSS, INFONAVIT y demás obligaciones laborales." },
    { icon: "💪", title: "Clima Laboral", desc: "Evaluación y mejora del ambiente laboral, comunicación interna y programas de reconocimiento." },
  ];

  process = [
    { title: "Diagnóstico de Personal", desc: "Evaluación de necesidades y perfiles requeridos." },
    { title: "Selección", desc: "Procesos de reclutamiento y contratación." },
    { title: "Inducción y Capacitación", desc: "Integración y entrenamiento del personal." },
    { title: "Evaluación y Crecimiento", desc: "Seguimiento de desempeño y planes de carrera." },
  ];

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );
    this.elementRef.nativeElement.querySelectorAll(".animate-on-scroll").forEach((el: HTMLElement) => observer.observe(el));
  }
}
