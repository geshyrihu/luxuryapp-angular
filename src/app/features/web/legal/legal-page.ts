import { CommonModule } from "@angular/common";
import { Component, ElementRef, AfterViewInit, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-legal-page",
  imports: [CommonModule, RouterModule],
  templateUrl: "./legal-page.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./legal-page.scss"],
})
export class LegalPage implements AfterViewInit {
  services = [
    {
      icon: "📝",
      title: "Contratos de Servicios",
      desc: "Elaboración y revisión de contratos con proveedores, prestadores de servicios y convenios comunitarios.",
    },
    {
      icon: "✅",
      title: "Cumplimiento Normativo",
      desc: "Aseguramos que el condominio cumpla con todas las disposiciones legales, reglamentos y normativas aplicables.",
    },
    {
      icon: "🛡",
      title: "Protección Legal",
      desc: "Defensa de los intereses del condominio ante terceros, representación legal y gestión de controversias.",
    },
    {
      icon: "📄",
      title: "Documentación Corporativa",
      desc: "Gestión de actas, reglamentos internos, poderes y documentación legal del condominio.",
    },
  ];

  process = [
    { title: "Diagnóstico Legal", desc: "Evaluamos la situación jurídica actual del residencial." },
    { title: "Plan de Acción", desc: "Diseñamos estrategias legales personalizadas." },
    { title: "Ejecución", desc: "Implementamos las soluciones con acompañamiento permanente." },
    { title: "Monitoreo Continuo", desc: "Damos seguimiento y actualizamos según cambios normativos." },
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
