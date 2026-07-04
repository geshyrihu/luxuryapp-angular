import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

export type NominaRole =
  | "SuperUsuario"
  | "Administrador"
  | "RecursosHumanos"
  | "Direccion"
  | "Gerente";

export interface NominaAction {
  label: string;
}

export interface NominaEndpoint {
  method: string;
  path: string;
  description: string;
}

export interface NominaCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  bgColor: string;
  roles: NominaRole[];
  actions: NominaAction[];
  endpoints: NominaEndpoint[];
  states?: string[];
  notes?: string;
}

export interface NominaGroup {
  label: string;
  icon: string;
  description: string;
  cards: NominaCard[];
}

const GROUPS: NominaGroup[] = [
  {
    label: "Configuracion y Periodos",
    icon: "mdi:cog",
    description:
      "Parametros de nomina por cliente y gestion de quincenas con dias habiles y festivos.",
    cards: [
      {
        title: "Configuracion de Nomina",
        description:
          "Parametros globales por cliente: frecuencia de pago, dias de pago, tolerancia de retardos, porcentajes IMSS empleado y factor de prima vacacional.",
        route: "/recursos-humanos/nomina/configuracion",
        icon: "mdi:tune",
        bgColor: "#e0f2fe",
        roles: ["SuperUsuario", "Administrador", "RecursosHumanos"],
        actions: [
          { label: "Ver configuracion actual del cliente" },
          { label: "Editar frecuencia y dias de pago (1a y 2a quincena)" },
          { label: "Ajustar tolerancia de retardos y retardos por falta" },
          { label: "Actualizar porcentajes IMSS empleado (2026)" },
          { label: "Configurar factor de prima vacacional (minimo 0.25 LFT)" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/hr/nomina/configuracion/{customerId}",
            description: "Obtener configuracion",
          },
          {
            method: "PUT",
            path: "/hr/nomina/configuracion/{customerId}",
            description: "Crear o actualizar configuracion (upsert)",
          },
        ],
      },
      {
        title: "Periodos de Nomina",
        description:
          "Gestion de quincenas: define fechas de inicio y fin, dias habiles, fecha de pago. Administra los dias festivos oficiales y descansos adicionales del periodo.",
        route: "/recursos-humanos/nomina/periodos",
        icon: "mdi:calendar",
        bgColor: "#f0fdf4",
        roles: [
          "SuperUsuario",
          "Administrador",
          "RecursosHumanos",
          "Direccion",
        ],
        actions: [
          { label: "Listar periodos del cliente por anio" },
          { label: "Crear nueva quincena con fechas y dias habiles" },
          { label: "Editar periodo (solo si no tiene nominas generadas)" },
          { label: "Cerrar periodo al finalizar el ciclo" },
          { label: "Agregar dias no habiles (festivos LFT o propios)" },
          { label: "Eliminar dias no habiles del periodo" },
          { label: "Eliminar periodo (solo si sin nominas)" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/hr/nomina/periodos",
            description: "Listar periodos por cliente y anio",
          },
          {
            method: "GET",
            path: "/hr/nomina/periodos/{id}",
            description: "Detalle de un periodo",
          },
          {
            method: "POST",
            path: "/hr/nomina/periodos",
            description: "Crear periodo",
          },
          {
            method: "PUT",
            path: "/hr/nomina/periodos/{id}",
            description: "Actualizar periodo",
          },
          {
            method: "DELETE",
            path: "/hr/nomina/periodos/{id}",
            description: "Eliminar periodo",
          },
          {
            method: "GET",
            path: "/hr/nomina/periodos/{id}/dias-no-habiles",
            description: "Listar dias no habiles",
          },
          {
            method: "POST",
            path: "/hr/nomina/periodos/{id}/dias-no-habiles",
            description: "Agregar dia no habil",
          },
          {
            method: "DELETE",
            path: "/hr/nomina/periodos/dias-no-habiles/{id}",
            description: "Eliminar dia no habil",
          },
        ],
        states: ["Abierto", "Cerrado"],
      },
    ],
  },
  {
    label: "Nomina Principal",
    icon: "mdi:file-check",
    description:
      "Generacion, edicion y aprobacion de la nomina quincenal completa con percepciones, deducciones y neto a pagar.",
    cards: [
      {
        title: "Nominas",
        description:
          "Listado de nominas generadas por periodo y cliente. Flujo completo de estados: Borrador, En Revision, Aprobada, Pagada, Cerrada. Exportacion a Excel y resumen ejecutivo.",
        route: "/recursos-humanos/nomina/nominas",
        icon: "mdi:file-check",
        bgColor: "#fef9c3",
        roles: [
          "SuperUsuario",
          "Direccion",
          "Administrador",
          "RecursosHumanos",
        ],
        actions: [
          { label: "Listar nominas por cliente y periodo" },
          {
            label: "Generar nomina automatica para todos los empleados activos",
          },
          { label: "Enviar nomina a revision" },
          { label: "Aprobar nomina (requiere rol Direccion o SuperUsuario)" },
          { label: "Marcar nomina como pagada (deposito realizado)" },
          { label: "Cerrar nomina (inmutable, aplica pagos de prestamos)" },
          { label: "Exportar nomina a Excel (mismo formato del original)" },
          { label: "Ver resumen ejecutivo del periodo" },
          { label: "Eliminar nomina (solo en estado Borrador)" },
        ],
        endpoints: [
          { method: "GET", path: "/hr/nomina", description: "Listar nominas" },
          {
            method: "GET",
            path: "/hr/nomina/{id}",
            description: "Detalle de nomina",
          },
          {
            method: "POST",
            path: "/hr/nomina/generar",
            description: "Generar nomina automatica",
          },
          {
            method: "PUT",
            path: "/hr/nomina/{id}/enviar-revision",
            description: "Enviar a revision",
          },
          {
            method: "PUT",
            path: "/hr/nomina/{id}/aprobar",
            description: "Aprobar nomina",
          },
          {
            method: "PUT",
            path: "/hr/nomina/{id}/marcar-pagada",
            description: "Marcar como pagada",
          },
          {
            method: "PUT",
            path: "/hr/nomina/{id}/cerrar",
            description: "Cerrar nomina",
          },
          {
            method: "GET",
            path: "/hr/nomina/{id}/exportar-excel",
            description: "Exportar a Excel",
          },
          {
            method: "GET",
            path: "/hr/nomina/{id}/resumen-ejecutivo",
            description: "Resumen ejecutivo",
          },
          {
            method: "DELETE",
            path: "/hr/nomina/{id}",
            description: "Eliminar (solo Borrador)",
          },
        ],
        states: ["Borrador", "EnRevision", "Aprobada", "Pagada", "Cerrada"],
      },
      {
        title: "Detalle de Nomina (por empleado)",
        description:
          "Vista y edicion de la linea de nomina de cada empleado: dias trabajados, sueldo proporcional, tiempo extra, prima dominical, prima vacacional, IMSS, ISR, prestamos y neto a pagar.",
        route: "/recursos-humanos/nomina/nominas",
        icon: "mdi:format-list-checks",
        bgColor: "#fce7f3",
        roles: [
          "SuperUsuario",
          "Direccion",
          "Administrador",
          "RecursosHumanos",
        ],
        actions: [
          { label: "Ver tabla de empleados con percepciones y deducciones" },
          { label: "Editar linea de un empleado (Borrador o EnRevision)" },
          { label: "Generar recibo de nomina PDF individual" },
          { label: "Ver cuenta bancaria (snapshot del momento de generacion)" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/hr/nomina/{nominaId}/detalles",
            description: "Listar empleados de la nomina",
          },
          {
            method: "GET",
            path: "/hr/nomina/{nominaId}/detalles/{id}",
            description: "Detalle de un empleado",
          },
          {
            method: "PUT",
            path: "/hr/nomina/{nominaId}/detalles/{id}",
            description: "Editar percepciones y deducciones",
          },
          {
            method: "GET",
            path: "/hr/nomina/{nominaId}/detalles/{id}/recibo",
            description: "Recibo PDF individual",
          },
        ],
        notes:
          "Se accede desde la pagina de Nominas al hacer clic en Ver detalle de una nomina.",
      },
    ],
  },
  {
    label: "Incidencias",
    icon: "mdi:alert",
    description:
      "Faltas, retardos, incapacidades y permisos que afectan el calculo de dias trabajados y montos de la nomina.",
    cards: [
      {
        title: "Incidencias de Nomina",
        description:
          "Registro de faltas injustificadas, retardos menores y mayores, incapacidades IMSS con folio, vacaciones pagadas, permisos con/sin goce y dias economicos. Sincronizacion automatica con modulos de vacaciones y permisos aprobados.",
        route: "/recursos-humanos/nomina/incidencias",
        icon: "mdi:alert",
        bgColor: "#fff7ed",
        roles: [
          "SuperUsuario",
          "Administrador",
          "RecursosHumanos",
          "Direccion",
        ],
        actions: [
          { label: "Listar incidencias por periodo y empleado" },
          { label: "Registrar falta injustificada con descuento automatico" },
          {
            label: "Registrar retardo (menor o mayor a tolerancia configurada)",
          },
          { label: "Registrar incapacidad IMSS con folio y tipo" },
          { label: "Registrar vacacion pagada (prima incluida en calculo)" },
          { label: "Registrar permiso con goce de sueldo" },
          { label: "Registrar permiso sin goce de sueldo" },
          { label: "Sincronizar vacaciones aprobadas del periodo" },
          { label: "Sincronizar permisos aprobados del periodo" },
          { label: "Eliminar incidencia manual (no las sincronizadas)" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/hr/nomina/incidencias",
            description: "Listar incidencias",
          },
          {
            method: "GET",
            path: "/hr/nomina/incidencias/{id}",
            description: "Detalle de incidencia",
          },
          {
            method: "POST",
            path: "/hr/nomina/incidencias",
            description: "Registrar incidencia",
          },
          {
            method: "PUT",
            path: "/hr/nomina/incidencias/{id}",
            description: "Actualizar incidencia",
          },
          {
            method: "DELETE",
            path: "/hr/nomina/incidencias/{id}",
            description: "Eliminar incidencia manual",
          },
          {
            method: "POST",
            path: "/hr/nomina/incidencias/sincronizar-vacaciones",
            description: "Importar vacaciones aprobadas",
          },
          {
            method: "POST",
            path: "/hr/nomina/incidencias/sincronizar-permisos",
            description: "Importar permisos aprobados",
          },
        ],
        states: [
          "FaltaInjustificada",
          "RetardoMenor",
          "RetardoMayor",
          "Incapacidad",
          "VacacionPagada",
          "PermisoConGoce",
          "PermisoSinGoce",
          "DiaEconomico",
          "Otro",
        ],
      },
    ],
  },
  {
    label: "Tiempo Extra",
    icon: "mdi:clock-outline",
    description:
      "Registro, calculo y aprobacion de horas extra segun LFT: primeras 9 horas semanales al doble, restantes al triple.",
    cards: [
      {
        title: "Tiempo Extra",
        description:
          "Registro de horas extra por empleado y dia. El sistema calcula automaticamente el importe segun LFT. Requiere aprobacion para incluirse en el calculo de nomina. Soporta evidencias fotograficas.",
        route: "/recursos-humanos/nomina/tiempo-extra",
        icon: "mdi:clock-outline",
        bgColor: "#ede9fe",
        roles: [
          "SuperUsuario",
          "Administrador",
          "RecursosHumanos",
          "Direccion",
        ],
        actions: [
          { label: "Listar tiempo extra por periodo y empleado" },
          { label: "Registrar horas simples (pago doble, primeras 9h/semana)" },
          { label: "Registrar horas dobles (pago triple, horas adicionales)" },
          { label: "Ver calculo automatico del importe LFT" },
          { label: "Aprobar tiempo extra para incluirlo en nomina" },
          { label: "Rechazar tiempo extra con motivo" },
          { label: "Subir evidencia fotografica (foto del registro firmado)" },
          { label: "Eliminar registro (solo si no aprobado)" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/hr/nomina/tiempo-extra",
            description: "Listar tiempo extra",
          },
          {
            method: "GET",
            path: "/hr/nomina/tiempo-extra/{id}",
            description: "Detalle",
          },
          {
            method: "POST",
            path: "/hr/nomina/tiempo-extra",
            description: "Registrar tiempo extra",
          },
          {
            method: "PUT",
            path: "/hr/nomina/tiempo-extra/{id}",
            description: "Actualizar",
          },
          {
            method: "PUT",
            path: "/hr/nomina/tiempo-extra/{id}/aprobar",
            description: "Aprobar",
          },
          {
            method: "PUT",
            path: "/hr/nomina/tiempo-extra/{id}/rechazar",
            description: "Rechazar con motivo",
          },
          {
            method: "DELETE",
            path: "/hr/nomina/tiempo-extra/{id}",
            description: "Eliminar (no aprobado)",
          },
          {
            method: "POST",
            path: "/hr/nomina/tiempo-extra/{id}/evidencias",
            description: "Subir evidencia fotografica",
          },
        ],
        states: ["PendienteAprobacion", "Aprobado", "Rechazado"],
      },
    ],
  },
  {
    label: "Prestamos",
    icon: "mdi:wallet",
    description:
      "Autorizacion de prestamos a empleados con descuento automatico por quincena y control de amortizacion.",
    cards: [
      {
        title: "Prestamos de Empleados",
        description:
          "Solicitud y autorizacion de prestamos descontados via nomina. El sistema genera la tabla de amortizacion automaticamente y aplica el descuento al cerrar cada nomina. Seguimiento del saldo pendiente en tiempo real.",
        route: "/recursos-humanos/nomina/prestamos",
        icon: "mdi:wallet",
        bgColor: "#d1fae5",
        roles: [
          "SuperUsuario",
          "Direccion",
          "Administrador",
          "RecursosHumanos",
        ],
        actions: [
          { label: "Listar prestamos (filtrar por estado o empleado)" },
          { label: "Solicitar nuevo prestamo indicando monto y quincenas" },
          { label: "Autorizar prestamo (genera tabla de amortizacion)" },
          { label: "Ver tabla de amortizacion completa" },
          { label: "Ver historial de pagos realizados por nomina" },
          { label: "Cancelar prestamo activo" },
          { label: "Eliminar solicitud (solo En Revision)" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/hr/nomina/prestamos",
            description: "Listar prestamos",
          },
          {
            method: "GET",
            path: "/hr/nomina/prestamos/{id}",
            description: "Detalle del prestamo",
          },
          {
            method: "GET",
            path: "/hr/nomina/prestamos/por-empleado/{id}",
            description: "Prestamos activos de un empleado",
          },
          {
            method: "POST",
            path: "/hr/nomina/prestamos",
            description: "Solicitar prestamo",
          },
          {
            method: "PUT",
            path: "/hr/nomina/prestamos/{id}/autorizar",
            description: "Autorizar prestamo",
          },
          {
            method: "PUT",
            path: "/hr/nomina/prestamos/{id}/cancelar",
            description: "Cancelar prestamo",
          },
          {
            method: "DELETE",
            path: "/hr/nomina/prestamos/{id}",
            description: "Eliminar solicitud",
          },
          {
            method: "GET",
            path: "/hr/nomina/prestamos/{id}/historial-pagos",
            description: "Historial de amortizaciones",
          },
        ],
        states: ["EnRevision", "Activo", "Completado", "Cancelado"],
      },
    ],
  },
  {
    label: "Evidencias y Reportes",
    icon: "mdi:image-multiple",
    description:
      "Archivos fotograficos de nomina firmada, tiempo extra y asistencia. Recibos individuales en PDF y exportacion a Excel.",
    cards: [
      {
        title: "Evidencias de Nomina",
        description:
          "Gestion de archivos de soporte: foto de nomina firmada, foto de registro de tiempo extra firmado y comprobantes de asistencia. Equivale a las hojas 3, 4 y 5 del Excel original.",
        route: "/recursos-humanos/nomina/evidencias",
        icon: "mdi:image-multiple",
        bgColor: "#fdf4ff",
        roles: ["SuperUsuario", "Administrador", "RecursosHumanos"],
        actions: [
          { label: "Ver evidencias de una nomina por tipo" },
          { label: "Subir foto de nomina firmada (hoja 3 del Excel)" },
          { label: "Subir foto de tiempo extra firmado (hoja 4 del Excel)" },
          { label: "Subir comprobante de asistencia (hoja 5 del Excel)" },
          { label: "Subir certificado de incapacidad IMSS" },
          { label: "Ver o descargar archivo de evidencia" },
          { label: "Eliminar evidencia" },
        ],
        endpoints: [
          {
            method: "GET",
            path: "/hr/nomina/{nominaId}/evidencias",
            description: "Listar evidencias de una nomina",
          },
          {
            method: "POST",
            path: "/hr/nomina/{nominaId}/evidencias",
            description: "Subir evidencia (multipart/form-data)",
          },
          {
            method: "DELETE",
            path: "/hr/nomina/evidencias/{id}",
            description: "Eliminar evidencia",
          },
        ],
        states: [
          "NominaFirmada",
          "TiempoExtra",
          "Asistencia",
          "Incapacidad",
          "Otro",
        ],
      },
    ],
  },
];

type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

interface HeroMetric {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: string;
}

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-nomina-dashboard",
  imports: [
    WebButtonIcon,WebButtonLabel, TagModule, AppIcon],
  templateUrl: "./nomina-dashboard.html",
  styleUrls: ["./nomina-dashboard.scss"],
})
export default class NominaDashboard {
  private router = inject(Router);

  groups = GROUPS;
  expandedCard = signal<string | null>(null);

  readonly heroMetrics: HeroMetric[] = [
    {
      label: "Modulos funcionales",
      value: String(GROUPS.reduce((a, g) => a + g.cards.length, 0)),
      detail: "Paginas y funciones del modulo",
      icon: "mdi:grid",
      tone: "primary",
    },
    {
      label: "Grupos de trabajo",
      value: String(GROUPS.length),
      detail: "Areas funcionales de nomina",
      icon: "mdi:sitemap",
      tone: "info",
    },
    {
      label: "Endpoints documentados",
      value: String(
        GROUPS.reduce(
          (a, g) => a + g.cards.reduce((b, c) => b + c.endpoints.length, 0),
          0,
        ),
      ),
      detail: "Rutas del API implementadas",
      icon: "mdi:server",
      tone: "success",
    },
  ];

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }

  toggleExpand(cardTitle: string) {
    this.expandedCard.update((v) => (v === cardTitle ? null : cardTitle));
  }

  isExpanded(cardTitle: string): boolean {
    return this.expandedCard() === cardTitle;
  }

  roleTagSeverity(role: NominaRole): TagSeverity {
    const map: Record<NominaRole, TagSeverity> = {
      SuperUsuario: "warn",
      Administrador: "info",
      RecursosHumanos: "success",
      Direccion: "danger",
      Gerente: "secondary",
    };
    return map[role];
  }
}
