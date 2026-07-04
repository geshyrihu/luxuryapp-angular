import { CommonModule } from "@angular/common";
import { Component, ElementRef, AfterViewInit } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-accounting-page",
  imports: [CommonModule, RouterModule],
  templateUrl: "./accounting-page.html",
  styleUrls: ["./accounting-page.scss"],
})
export class AccountingPage implements AfterViewInit {
  services = [
    { icon: "💰", title: "Cobro de Cuotas", desc: "Administración del cobro de cuotas de mantenimiento ordinarias y extraordinarias con múltiples métodos de pago." },
    { icon: "📊", title: "Estados Financieros", desc: "Elaboración mensual de estados financieros claros, detallados y auditables para la asamblea de condóminos." },
    { icon: "✏️", title: "Presupuesto Anual", desc: "Elaboración y seguimiento del presupuesto anual del condominio con proyecciones y control de gastos." },
    { icon: "✅", title: "Auditoría y Cumplimiento", desc: "Conciliaciones bancarias, declaraciones fiscales y preparación de documentación para auditorías externas." },
  ];

  process = [
    { title: "Diagnóstico Financiero", desc: "Revisión de ingresos, egresos y saldos actuales." },
    { title: "Plan Financiero", desc: "Diseño de presupuesto y metas financieras." },
    { title: "Gestión y Control", desc: "Ejecución de cobros, pagos y conciliaciones." },
    { title: "Reportes Trimestrales", desc: "Presentación de resultados a la asamblea." },
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
