import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

interface HRModuleCard {
  title: string;
  description: string;
  route: string;
  emoji: string;
  color: string;
  bgColor: string;
  /** Roles con acceso. Vacío = todos los usuarios autenticados. */
  roles: ApplicationRole[];
}

interface HRModuleGroup {
  label: string;
  emoji: string;
  cards: HRModuleCard[];
}

@Component({
  selector: "app-hr-dashboard",
  imports: [AppIcon],
  templateUrl: "./hr-dashboard.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
        padding: 1.5rem;
      }
    `,
  ],
})
export class HRDashboard {
  private router = inject(Router);
  private aspRoleS = inject(AspRoleService);

  currentUserRoles: string[] = [];

  constructor() {
    this.currentUserRoles = this.aspRoleS.getUserRoles() || [];
  }

  private readonly allGroups: HRModuleGroup[] = [
    // -------------------------------------------------------------
    // INCIDENCIAS Y SANCIONES
    // -------------------------------------------------------------
    {
      label: "Incidencias y Sanciones",
      emoji: "??",
      cards: [
        {
          title: "Incidencias Disciplinarias",
          description:
            "Registro y seguimiento de incidentes de conducta, desempeño, seguridad o cumplimiento.",
          route: "/recursos-humanos/incidents",
          emoji: "??",
          color: "#dc2626",
          bgColor: "#fee2e2",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
            ApplicationRole.Administrador,
            ApplicationRole.Direccion,
            ApplicationRole.GerenteOperaciones,
            ApplicationRole.GerenteAtencion,
          ],
        },
        {
          title: "Dashboard de Incidencias",
          description:
            "Mátricas y análisis de incidencias: KPIs, gróficos por mes/tipo/severidad y ranking de empleados.",
          route: "/recursos-humanos/incident-dashboard",
          emoji: "??",
          color: "#0f766e",
          bgColor: "#ccfbf1",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
            ApplicationRole.Direccion,
          ],
        },
        {
          title: "Reportes de Incidencias",
          description:
            "Reportes estadósticos consolidados de incidencias con filtros avanzados y exportación.",
          route: "/recursos-humanos/incident-reports",
          emoji: "??",
          color: "#0891b2",
          bgColor: "#cffafe",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
          ],
        },
        {
          title: "Sanciones",
          description:
            "Gestión de sanciones aplicadas con seguimiento, apelación y trazabilidad completa.",
          route: "/recursos-humanos/sanctions",
          emoji: "??",
          color: "#7c2d12",
          bgColor: "#fed7aa",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
            ApplicationRole.Administrador,
            ApplicationRole.Direccion,
          ],
        },
      ],
    },

    // -------------------------------------------------------------
    // PERMISOS
    // -------------------------------------------------------------
    {
      label: "Permisos",
      emoji: "???",
      cards: [
        {
          title: "Mis Solicitudes de Permiso",
          description:
            "Visualiza y gestiona tus solicitudes de permiso personal, módico o laboral.",
          route: "/recursos-humanos/my-requests",
          emoji: "??",
          color: "#0369a1",
          bgColor: "#e0f2fe",
          roles: [],
        },
        {
          title: "Aprobaciones de Permisos",
          description:
            "Panel de aprobación y rechazo de solicitudes de permiso del equipo a cargo.",
          route: "/recursos-humanos/approval",
          emoji: "?",
          color: "#15803d",
          bgColor: "#dcfce7",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
            ApplicationRole.Administrador,
            ApplicationRole.GerenteOperaciones,
            ApplicationRole.GerenteAtencion,
            ApplicationRole.Direccion,
          ],
        },
      ],
    },

    // -------------------------------------------------------------
    // VACACIONES
    // -------------------------------------------------------------
    {
      label: "Vacaciones",
      emoji: "???",
      cards: [
        {
          title: "Mis Vacaciones",
          description:
            "Consulta tu historial de solicitudes de vacaciones y el estado de cada período.",
          route: "/recursos-humanos/my-vacations",
          emoji: "??",
          color: "#0891b2",
          bgColor: "#cffafe",
          roles: [],
        },
        {
          title: "Saldo de Vacaciones",
          description:
            "Visualiza tu saldo disponible de días de vacaciones y el historial de consumo.",
          route: "/recursos-humanos/saldo-vacaciones",
          emoji: "??",
          color: "#7c3aed",
          bgColor: "#ede9fe",
          roles: [],
        },
        {
          title: "Calendario de Personal",
          description:
            "Vista de calendario unificada con permisos y vacaciones de todo el equipo.",
          route: "/recursos-humanos/vacation-calendar",
          emoji: "??",
          color: "#0f766e",
          bgColor: "#ccfbf1",
          roles: [],
        },
        {
          title: "Historial de Solicitudes",
          description:
            "Consulta el historial completo de solicitudes de permisos y vacaciones.",
          route: "/recursos-humanos/requests-history",
          emoji: "???",
          color: "#92400e",
          bgColor: "#fef3c7",
          roles: [],
        },
        {
          title: "Registrar Vacaciones Pasadas",
          description:
            "Registra períodos de vacaciones anteriores al sistema para completar el historial.",
          route: "/recursos-humanos/register-past-vacations",
          emoji: "??",
          color: "#6b7280",
          bgColor: "#f3f4f6",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
            ApplicationRole.Administrador,
          ],
        },
        {
          title: "Auditoría de Vacaciones",
          description:
            "Revisa el saldo e historial de vacaciones de cualquier empleado del cliente.",
          route: "/recursos-humanos/auditoria-vacaciones",
          emoji: "??",
          color: "#1e40af",
          bgColor: "#dbeafe",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
          ],
        },
        {
          title: "Administración de Balances",
          description:
            "Ajuste y administración de saldos de vacaciones para todos los empleados.",
          route: "/recursos-humanos/admin-balances-vacaciones",
          emoji: "??",
          color: "#374151",
          bgColor: "#e5e7eb",
          roles: [ApplicationRole.SuperUsuario],
        },
      ],
    },

    // -------------------------------------------------------------
    // CONTRATOS
    // -------------------------------------------------------------
    {
      label: "Contratos",
      emoji: "??",
      cards: [
        {
          title: "Contratos Laborales",
          description:
            "Gestión de contratos de trabajo, historial laboral y documentación contractual de empleados.",
          route: "/recursos-humanos/contracts",
          emoji: "??",
          color: "#1e40af",
          bgColor: "#dbeafe",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
            ApplicationRole.Comite,
          ],
        },
        {
          title: "Machotes de Contratos",
          description:
            "Plantillas reutilizables para generación rópida de contratos con variables dinámicas.",
          route: "/recursos-humanos/contract-templates",
          emoji: "??",
          color: "#059669",
          bgColor: "#d1fae5",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
          ],
        },
        {
          title: "Adendas a Contratos",
          description:
            "Modificaciones formales a contratos existentes: salarios, puestos, extensiones y condiciones.",
          route: "/recursos-humanos/contract-addendums",
          emoji: "??",
          color: "#7c3aed",
          bgColor: "#ede9fe",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
            ApplicationRole.Comite,
          ],
        },
        {
          title: "Machotes de Adendas",
          description:
            "Plantillas estandarizadas para adendas de modificación salarial, cambio de puesto y mós.",
          route: "/recursos-humanos/addendum-templates",
          emoji: "??",
          color: "#ea580c",
          bgColor: "#ffedd5",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
          ],
        },
      ],
    },

    // -------------------------------------------------------------
    // CONFIGURACIóN
    // -------------------------------------------------------------
    {
      label: "Configuración",
      emoji: "??",
      cards: [
        {
          title: "Catálogos de RH",
          description:
            "Administración de tipos de incidencia y tipos de sanción del sistema.",
          route: "/admin/incident-types",
          emoji: "??",
          color: "#4338ca",
          bgColor: "#e0e7ff",
          roles: [
            ApplicationRole.SuperUsuario,
            ApplicationRole.RecursosHumanos,
          ],
        },
      ],
    },
  ];

  getVisibleGroups(): HRModuleGroup[] {
    return this.allGroups
      .map((group) => ({
        ...group,
        cards: group.cards.filter(
          (card) =>
            card.roles.length === 0 ||
            card.roles.some((role) => this.currentUserRoles.includes(role)),
        ),
      }))
      .filter((group) => group.cards.length > 0);
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  getRoleNames(roles: ApplicationRole[]): string {
    if (roles.length === 0) return "Todos los usuarios";
    const roleNames: Record<string, string> = {
      [ApplicationRole.SuperUsuario]: "Super Usuario",
      [ApplicationRole.Direccion]: "Dirección",
      [ApplicationRole.Administrador]: "Administrador",
      [ApplicationRole.GerenteOperaciones]: "Gerente Operaciones",
      [ApplicationRole.GerenteAtencion]: "Gerente Atención",
      [ApplicationRole.GerenteMantenimiento]: "Gerente Mantenimiento",
      [ApplicationRole.JefeMantenimiento]: "Jefe Mantenimiento",
      [ApplicationRole.Asistente]: "Asistente",
      [ApplicationRole.Comite]: "Comité",
      [ApplicationRole.Legal]: "Legal",
      [ApplicationRole.CoordinacionLegal]: "Coordinación Legal",
      [ApplicationRole.Reclutamiento]: "Reclutamiento",
      [ApplicationRole.RecursosHumanos]: "Recursos Humanos",
      [ApplicationRole.SistemasGeneral]: "Sistemas",
      [ApplicationRole.Sistemas]: "Sistemas",
      [ApplicationRole.Mensajeria]: "Mensajería",
      [ApplicationRole.SupervisionOperativa]: "Supervisión Operativa",
      [ApplicationRole.Almacenista]: "Almacenista",
      [ApplicationRole.Contador]: "Contador",
      [ApplicationRole.Cobranza]: "Cobranza",
      [ApplicationRole.TecnicoMantenimiento]: "Tócnico Mantenimiento",
      [ApplicationRole.JardineriaInterna]: "Jardinería",
      [ApplicationRole.SeguridadInterna]: "Seguridad",
      [ApplicationRole.SupervisorObra]: "Supervisor Obra",
      [ApplicationRole.Recepcionista]: "Recepcionista",
      [ApplicationRole.Ludotecaria]: "Ludotecaria",
      [ApplicationRole.Condomino]: "Condomino",
      [ApplicationRole.Jardineria]: "Jardinería",
      [ApplicationRole.Limpieza]: "Limpieza",
      [ApplicationRole.Seguridad]: "Seguridad",
      [ApplicationRole.Proveedor]: "Proveedor",
    };
    return roles.map((r) => roleNames[r] || r).join(", ");
  }
}
