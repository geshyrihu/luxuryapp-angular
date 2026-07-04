import { CommonModule } from "@angular/common";
import { Component, ElementRef, AfterViewInit } from "@angular/core";
import { RouterModule } from "@angular/router";

interface IStep {
  id: string;
  num: string;
  icon: string;
  title: string;
  summary: string;
  details: string[];
  duration: string;
}

interface IPhase {
  id: string;
  number: string;
  title: string;
  steps: IStep[];
}

@Component({
  selector: "app-preventive-maintenance",
  imports: [CommonModule, RouterModule],
  templateUrl: "./preventive-maintenance.html",
  styleUrls: ["./preventive-maintenance.scss"],
})
export class PreventiveMaintenance implements AfterViewInit {
  expandedSteps = new Set<string>();

  phases: IPhase[] = [
    {
      id: "phase-1",
      number: "Fase 1",
      title: "Planificación y Programación",
      steps: [
        {
          id: "p1-s1",
          num: "01",
          icon: "📋",
          title: "Inventariar instalaciones y equipos",
          summary: "Listar todas las instalaciones bajo responsabilidad del área de mantenimiento.",
          details: [
            "Tableros eléctricos generales y secundarios",
            "Bombas de agua potable y aguas negras",
            "Cisternas, tinacos y sistema hidroneumático",
            "Calentadores centrales y boiler",
            "Elevadores y montacargas",
            "Circuito cerrado de CCTV y control de accesos",
            "Extintores y sistema contra incendios",
          ],
          duration: "1 día",
        },
        {
          id: "p1-s2",
          num: "02",
          icon: "📅",
          title: "Definir frecuencias de mantenimiento",
          summary: "Asignar periodicidad a cada equipo según especificaciones del fabricante y normativa aplicable.",
          details: [
            "Diario: tableros, presión de bombas, nivel de cisternas",
            "Semanal: iluminación exterior, puertas automáticas",
            "Mensual: calentadores, extractores, equipos de bombeo",
            "Trimestral: elevadores, sistema contra incendios",
            "Semestral: cisternas (limpieza), pintura de áreas comunes",
            "Anual: dictamen estructural, certificaciones",
          ],
          duration: "2 horas",
        },
        {
          id: "p1-s3",
          num: "03",
          icon: "🗓️",
          title: "Elaborar calendario anual",
          summary: "Crear cronograma maestro con todas las actividades preventivas del año.",
          details: [
            "Distribuir actividades por mes y área responsable",
            "Asignar fechas tentativas y personal ejecutor",
            "Considerar temporadas de alta ocupación",
            "Reservar fechas para mantenimiento mayor",
            "Incluir holgura para imprevistos",
            "Socializar calendario con administración",
          ],
          duration: "4 horas",
        },
      ],
    },
    {
      id: "phase-2",
      number: "Fase 2",
      title: "Ejecución y Documentación",
      steps: [
        {
          id: "p2-s1",
          num: "04",
          icon: "🔧",
          title: "Ejecutar mantenimiento programado",
          summary: "Realizar cada actividad según el calendario con checklists estandarizadas.",
          details: [
            "Limpieza de tableros y conexiones eléctricas",
            "Lubricación de motores y partes móviles",
            "Ajuste de parámetros y calibraciones",
            "Medición de voltaje, amperaje y resistencia",
            "Cambio de filtros y refacciones programadas",
            "Revisión de fugas en instalaciones hidrosanitarias",
          ],
          duration: "30 min por equipo",
        },
        {
          id: "p2-s2",
          num: "05",
          icon: "📝",
          title: "Documentar cada intervención",
          summary: "Registrar en bitácora todas las actividades realizadas con evidencia fotográfica.",
          details: [
            "Fecha y hora de la intervención",
            "Equipo intervenido y código de identificación",
            "Actividades realizadas y refacciones utilizadas",
            "Lecturas y mediciones obtenidas",
            "Observaciones y recomendaciones",
            "Firma del ejecutor y supervisor",
          ],
          duration: "10 min por registro",
        },
        {
          id: "p2-s3",
          num: "06",
          icon: "📊",
          title: "Revisar y ajustar programa",
          summary: "Evaluar cumplimiento y ajustar frecuencias según resultados y condiciones del equipo.",
          details: [
            "Cierre mensual: % de cumplimiento vs programado",
            "Identificar desviaciones recurrentes",
            "Ajustar frecuencias si hay sobre-mantenimiento",
            "Reprogramar actividades omitidas",
            "Actualizar calendario para el siguiente mes",
            "Reportar a administración resultados del periodo",
          ],
          duration: "2 horas / mes",
        },
      ],
    },
  ];

  kpis = [
    { value: "-80%", label: "Averías inesperadas", icon: "📉" },
    { value: "+40%", label: "Vida útil de equipos", icon: "⏳" },
    { value: "100%", label: "Trazabilidad documentada", icon: "✅" },
  ];

  deliverables = [
    { icon: "📋", title: "Inventario de equipos", desc: "Catálogo completo con códigos, ubicación y especificaciones técnicas de cada equipo." },
    { icon: "🗓️", title: "Calendario maestro anual", desc: "Cronograma con todas las actividades preventivas del año, por mes y área." },
    { icon: "📝", title: "Checklists estandarizadas", desc: "Formato de lista de verificación para cada tipo de equipo intervenido." },
    { icon: "📊", title: "Reporte mensual de cumplimiento", desc: "Indicadores de cumplimiento, desviaciones y recomendaciones del periodo." },
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

    const stickyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          const btn = this.elementRef.nativeElement.querySelector(
            `[data-phase="${id}"]`,
          );
          if (!btn) return;
          if (entry.isIntersecting) {
            this.elementRef.nativeElement
              .querySelectorAll(".phase-nav-btn")
              .forEach((b: HTMLElement) => b.classList.remove("active"));
            btn.classList.add("active");
          }
        });
      },
      { threshold: 0.3 },
    );

    this.elementRef.nativeElement
      .querySelectorAll(".phase")
      .forEach((el: HTMLElement) => stickyObserver.observe(el));
  }

  toggleStep(id: string): void {
    if (this.expandedSteps.has(id)) {
      this.expandedSteps.delete(id);
    } else {
      this.expandedSteps.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedSteps.has(id);
  }

  scrollTo(id: string): void {
    const el = this.elementRef.nativeElement.querySelector(`#${id}`);
    if (el) {
      const offset = 90;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
}
