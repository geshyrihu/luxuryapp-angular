import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SkeletonModule } from "primeng/skeleton";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";

interface EmptyState {
  id: string;
  titulo: string;
  descripcion: string;
  icon: string;
  color: string;
  actionLabel: string;
  actionSeverity: "primary" | "secondary" | "success" | "info" | "warn" | "danger";
  actionIcon: string;
  tag?: string;
  tagSeverity?: "success" | "info" | "warn" | "danger" | "secondary";
}

@Component({
  selector: "app-web-empty-states",
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, SkeletonModule, DividerModule, TagModule, ProgressSpinnerModule, AppIcon],
  template: `
    <div class="grid">

      <!-- Estados vacóos principales -->
      <div class="col-12">
        <p-card header="Empty States é Todos los escenarios">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Cada estado vacóo debe explicar <strong>qué falta</strong> y ofrecer
            <strong>una acción concreta</strong> para continuar.
            Nunca dejes una pantalla en blanco sin contexto.
          </p>

          <div class="grid">
            @for (s of states; track s.id) {
              <div class="col-12 md:col-6 xl:col-4">
                <div class="surface-ground border-1 border-round p-5 flex flex-column align-items-center text-center gap-3 h-full"
                     style="min-height:220px; justify-content:center">
                  @if (s.tag) {
                    <p-tag [value]="s.tag" [severity]="s.tagSeverity" [rounded]="true" class="mb-1" />
                  }
                  <app-icon [icon]="s.icon" class="text-5xl" [style.color]="s.color" />
                  <div>
                    <strong class="block text-color text-base">{{ s.titulo }}</strong>
                    <p class="m-0 text-sm text-color-secondary mt-1 line-height-3">{{ s.descripcion }}</p>
                  </div>
                  <p-button
                    [label]="s.actionLabel"
                    [icon]="s.actionIcon"
                    [severity]="s.actionSeverity"
                    [outlined]="s.actionSeverity !== 'primary'"
                    size="small"
                  />
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>

      <!-- Skeleton é Loading states -->
      <div class="col-12 lg:col-6">
        <p-card header="Skeleton é Estados de Carga">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Muestra skeleton cuando el contenido tarda mís de 300 ms.
            Anticipa el layout real para reducir el salto visual (CLS).
          </p>
          <div class="flex flex-column gap-4">

            <!-- Skeleton de lista -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">Lista de registros</span>
              @for (i of [1,2,3,4]; track i) {
                <div class="flex align-items-center gap-3 mb-3">
                  <p-skeleton shape="circle" size="2.5rem" />
                  <div class="flex-grow-1">
                    <p-skeleton width="70%" height=".85rem" styleClass="mb-1" />
                    <p-skeleton width="45%" height=".65rem" />
                  </div>
                  <p-skeleton width="4.5rem" height="1.5rem" borderRadius="999px" />
                </div>
              }
            </div>

            <p-divider />

            <!-- Skeleton de tabla -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">Tabla de datos</span>
              <p-skeleton width="100%" height="2.5rem" styleClass="mb-1" />
              @for (i of [1,2,3]; track i) {
                <div class="flex gap-2 mb-1">
                  <p-skeleton width="20%" height="2rem" />
                  <p-skeleton width="45%" height="2rem" />
                  <p-skeleton width="20%" height="2rem" />
                  <p-skeleton width="15%" height="2rem" />
                </div>
              }
            </div>

            <p-divider />

            <!-- Skeleton de cards KPI -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">KPI Cards</span>
              <div class="grid">
                @for (i of [1,2]; track i) {
                  <div class="col-6">
                    <div class="surface-card border-1 border-round p-3">
                      <div class="flex justify-content-between align-items-start mb-2">
                        <p-skeleton width="5rem" height=".7rem" />
                        <p-skeleton shape="circle" size="2rem" />
                      </div>
                      <p-skeleton width="4rem" height="1.75rem" styleClass="mb-2" />
                      <p-skeleton width="6rem" height=".65rem" />
                    </div>
                  </div>
                }
              </div>
            </div>

          </div>
        </p-card>
      </div>

      <!-- Estados de error de sistema -->
      <div class="col-12 lg:col-6">
        <p-card header="Error Pages é Referencia visual">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Páginas de error como referencia de diseóo. Cada una incluye código HTTP,
            descripción humana y acción para recuperarse.
          </p>
          <div class="flex flex-column gap-3">
            @for (e of errorPages; track e.code) {
              <div class="surface-card border-1 border-round p-4 flex align-items-center gap-4">
                <div class="flex-shrink-0 text-center" style="width:60px">
                  <span class="text-3xl font-bold" [style.color]="e.color">{{ e.code }}</span>
                </div>
                <div class="flex-grow-1">
                  <strong class="block text-sm">{{ e.titulo }}</strong>
                  <span class="text-xs text-color-secondary">{{ e.descripcion }}</span>
                </div>
                <p-tag [value]="e.label" [severity]="e.severity" [rounded]="true" />
              </div>
            }
          </div>
        </p-card>
      </div>

      <!-- Reglas de uso -->
      <div class="col-12">
        <p-card header="Reglas de Estados Vacóos">
          <div class="grid">
            @for (r of rules; track r.titulo) {
              <div class="col-12 md:col-6 xl:col-3">
                <div class="flex align-items-start gap-3 p-3 surface-ground border-round h-full">
                  <app-icon [icon]="r.icon" [style.color]="r.color" class="text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <strong class="block text-sm">{{ r.titulo }}</strong>
                    <p class="m-0 text-xs text-color-secondary mt-1 line-height-3">{{ r.descripcion }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>

    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebEmptyStates {
  readonly states: EmptyState[] = [
    {
      id: "no-data",
      titulo: "Sin registros",
      descripcion: "No hay datos disponibles para mostrar en este módulo todavía.",
      icon: "icon.database-off-outline",
      color: "var(--ds-text-muted)",
      actionLabel: "Agregar primero",
      actionSeverity: "primary",
      actionIcon: "icon.plus",
    },
    {
      id: "no-search",
      titulo: "Sin resultados",
      descripcion: "Tu bósqueda no coincide con ningón registro. Intenta con otros túrminos.",
      icon: "icon.magnify-remove-outline",
      color: "var(--ds-text-muted)",
      actionLabel: "Limpiar filtros",
      actionSeverity: "secondary",
      actionIcon: "icon.filter-off",
    },
    {
      id: "no-permission",
      titulo: "Sin permisos",
      descripcion: "No tienes acceso para ver este módulo. Contacta al administrador.",
      icon: "icon.lock-outline",
      color: "var(--ds-warning)",
      actionLabel: "Solicitar acceso",
      actionSeverity: "warn",
      actionIcon: "icon.account-key",
      tag: "403",
      tagSeverity: "warn",
    },
    {
      id: "error",
      titulo: "Algo salié mal",
      descripcion: "Error de conexión o del servidor. El equipo túcnico fue notificado.",
      icon: "icon.alert-circle-outline",
      color: "var(--ds-danger)",
      actionLabel: "Reintentar",
      actionSeverity: "danger",
      actionIcon: "icon.refresh",
      tag: "500",
      tagSeverity: "danger",
    },
    {
      id: "coming-soon",
      titulo: "En desarrollo",
      descripcion: "Este módulo estaré disponible en la próxima actualización del sistema.",
      icon: "icon.rocket-launch-outline",
      color: "var(--ds-primary)",
      actionLabel: "Notificarme",
      actionSeverity: "secondary",
      actionIcon: "icon.bell-outline",
      tag: "Próximamente",
      tagSeverity: "info",
    },
    {
      id: "offline",
      titulo: "Sin conexión",
      descripcion: "Revisa tu red. Los cambios se guardarón cuando vuelva la conexión.",
      icon: "icon.wifi-off",
      color: "var(--ds-text-muted)",
      actionLabel: "Verificar conexión",
      actionSeverity: "secondary",
      actionIcon: "icon.wifi-refresh",
    },
  ];

  readonly errorPages = [
    { code: "404", titulo: "Página no encontrada",     descripcion: "La ruta solicitada no existe en el sistema.",           color: "var(--ds-warning)", label: "Not Found",  severity: "warn"    as const },
    { code: "403", titulo: "Acceso denegado",          descripcion: "No tienes permisos para acceder a este recurso.",       color: "var(--ds-warning)", label: "Forbidden",  severity: "warn"    as const },
    { code: "500", titulo: "Error del servidor",       descripcion: "Error interno. El equipo túcnico fue notificado.",      color: "var(--ds-danger)",  label: "Server Error",severity: "danger"  as const },
    { code: "503", titulo: "Servicio no disponible",   descripcion: "El servidor esté en mantenimiento. Vuelve pronto.",     color: "var(--ds-danger)",  label: "Unavailable",severity: "danger"  as const },
    { code: "401", titulo: "No autenticado",           descripcion: "Debes iniciar sesión para continuar.",                 color: "var(--ds-info)",    label: "Unauthorized",severity: "info"   as const },
  ];

  readonly rules = [
    { titulo: "Explica qué falta",     icon: "icon.information",     color: "var(--ds-info)",    descripcion: "El mensaje debe decir exactamente por qué la pantalla esté vacóa." },
    { titulo: "Una acción concreta",   icon: "icon.cursor-default-click", color: "var(--ds-primary)", descripcion: "Siempre incluye un CTA que ayude al usuario a resolver el estado." },
    { titulo: "Skeleton antes que spinner", icon: "icon.layers",     color: "var(--ds-success)", descripcion: "Usa skeleton en carga estructural (cards, tablas). Spinner solo en acciones cortas." },
    { titulo: "Nunca pantalla vacóa",  icon: "icon.close-circle",   color: "var(--ds-danger)",  descripcion: "Una pantalla en blanco sin contexto genera confusión y pórdida de confianza." },
  ];
}
