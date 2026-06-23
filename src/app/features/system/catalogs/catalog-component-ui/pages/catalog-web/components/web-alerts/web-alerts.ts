import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

@Component({
  selector: "app-web-alerts",
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, MessageModule, ToastModule, DividerModule, AppIcon],
  providers: [MessageService],
  template: `
    <p-toast position="top-right" />

    <div class="grid">

      <!-- Severities -->
      <div class="col-12">
        <p-card header="Messages — Todos los Severities">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Usa <code>p-message</code> para feedback contextual y persistente dentro de una vista.
            Reserva el toast para confirmaciones de acciones puntuales.
          </p>
          <div class="flex flex-column gap-3">
            <p-message severity="success" text="Registro guardado correctamente. El folio ERP-2026-041 está disponible." />
            <p-message severity="info"    text="La sincronización puede tardar hasta 5 minutos. Puedes continuar trabajando." />
            <p-message severity="warn"    text="Faltan 3 documentos por validar antes de aprobar este proceso." />
            <p-message severity="error"   text="Sin permisos para aprobar este proceso. Contacta al administrador del sistema." />
            <p-message severity="secondary" text="Mensaje de referencia o contexto adicional de baja prioridad." />
            <p-message severity="contrast"  text="Mensaje de contraste para alertas de máxima visibilidad." />
          </div>
        </p-card>
      </div>

      <!-- Closable -->
      <div class="col-12 lg:col-6">
        <p-card header="Closable Messages">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Agrega <code>[closable]="true"</code> cuando el usuario puede descartar el aviso manualmente.
          </p>
          <div class="flex flex-column gap-3">
            <p-message severity="success" text="Pago procesado. Puedes cerrar este aviso." [closable]="true" />
            <p-message severity="warn"    text="Sesión por vencer. Guarda tu trabajo." [closable]="true" />
            <p-message severity="error"   text="Error de red. Verifica tu conexión." [closable]="true" />
          </div>
        </p-card>
      </div>

      <!-- Auto-dismiss -->
      <div class="col-12 lg:col-6">
        <p-card header="Auto-dismiss vs. Sticky">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            <code>[life]="ms"</code> descarta el mensaje automáticamente.
            Sin <code>life</code>, el mensaje es sticky.
          </p>
          <div class="flex flex-column gap-3">
            <p-message severity="success" text="Auto-dismiss en 8 s. Desaparece solo." [life]="8000" />
            <p-message severity="info" text="Sticky: permanece hasta ser cerrado manualmente." [closable]="true" />
          </div>
        </p-card>
      </div>

      <!-- Toast triggers -->
      <div class="col-12">
        <p-card header="Toast Notifications">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Flotan en pantalla y desaparecen automáticamente (4 s). Úsalos para confirmar acciones,
            nunca para errores críticos bloqueantes que requieren decisión del usuario.
          </p>
          <div class="flex flex-wrap gap-2 mb-4 p-3 border-round surface-ground">
            <p-button label="Success" severity="success" icon="pi pi-check-circle" (onClick)="toast('success')" />
            <p-button label="Info"    severity="info"    icon="pi pi-info-circle"  (onClick)="toast('info')" />
            <p-button label="Warning" severity="warn"    icon="pi pi-exclamation-triangle" (onClick)="toast('warn')" />
            <p-button label="Error"   severity="danger"  icon="pi pi-times-circle" (onClick)="toast('error')" />
            <p-button label="Sticky" severity="secondary" [outlined]="true"
                      icon="pi pi-thumbtack" (onClick)="toastSticky()" />
            <p-button label="Múltiples" severity="secondary" [outlined]="true"
                      icon="pi pi-bell" (onClick)="toastMultiple()" />
          </div>

          <p-divider />

          <div class="grid mt-3">
            @for (r of rules; track r.severity) {
              <div class="col-12 md:col-6 xl:col-3">
                <div class="flex align-items-start gap-2 p-3 border-round border-1"
                     [style.background]="r.bg" [style.border-color]="r.borderColor">
                  <app-icon [icon]="r.icon" [style.color]="r.color" class="text-xl flex-shrink-0 mt-1" />
                  <div>
                    <strong class="block text-sm" [style.color]="r.color">{{ r.label }}</strong>
                    <span class="text-xs text-color-secondary line-height-3">{{ r.when }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>

      <!-- Validación inline -->
      <div class="col-12">
        <p-card header="Feedback de Validación Inline">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Coloca el <code>p-message</code> inmediatamente debajo del campo.
            Un único mensaje por campo; no acumules varios errores en el mismo bloque.
          </p>
          <div class="grid">
            <div class="col-12 md:col-4">
              <label class="block text-sm font-semibold mb-1">Campo correcto</label>
              <div class="flex align-items-center gap-2 p-2 border-round border-1"
                   style="border-color:var(--ds-success);background:var(--ds-success-light)">
                <app-icon icon="mdi:check-circle" style="color:var(--ds-success)" />
                <span class="text-sm">usuario&#64;empresa.com</span>
              </div>
              <p-message severity="success" text="Email válido y disponible." styleClass="mt-1 block" />
            </div>
            <div class="col-12 md:col-4">
              <label class="block text-sm font-semibold mb-1">Campo con advertencia</label>
              <div class="flex align-items-center gap-2 p-2 border-round border-1"
                   style="border-color:var(--ds-warning);background:var(--ds-warning-light)">
                <app-icon icon="mdi:alert" style="color:var(--ds-warning)" />
                <span class="text-sm">abc123</span>
              </div>
              <p-message severity="warn" text="Contraseña débil. Agrega símbolos." styleClass="mt-1 block" />
            </div>
            <div class="col-12 md:col-4">
              <label class="block text-sm font-semibold mb-1">Campo con error</label>
              <div class="flex align-items-center gap-2 p-2 border-round border-1"
                   style="border-color:var(--ds-danger);background:var(--ds-danger-light)">
                <app-icon icon="mdi:close-circle" style="color:var(--ds-danger)" />
                <span class="text-sm">no-es-un-email</span>
              </div>
              <p-message severity="error" text="Formato de email inválido." styleClass="mt-1 block" />
            </div>
          </div>
        </p-card>
      </div>

    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebAlerts {
  private msgSvc = inject(MessageService);

  readonly rules = [
    { severity: "success", label: "Success",       icon: "mdi:check-circle",  color: "var(--ds-success)", bg: "var(--ds-success-light)", borderColor: "var(--ds-success)", when: "Operación completada, registro guardado, confirmación positiva." },
    { severity: "info",    label: "Info",           icon: "mdi:information",   color: "var(--ds-info)",    bg: "var(--ds-info-light)",    borderColor: "var(--ds-info)",    when: "Contexto adicional, proceso en curso, ayuda no bloqueante." },
    { severity: "warn",    label: "Warning",        icon: "mdi:alert",         color: "var(--ds-warning)", bg: "var(--ds-warning-light)", borderColor: "var(--ds-warning)", when: "Atención requerida, pendiente de revisión, riesgo moderado." },
    { severity: "error",   label: "Error / Danger", icon: "mdi:close-circle",  color: "var(--ds-danger)",  bg: "var(--ds-danger-light)",  borderColor: "var(--ds-danger)",  when: "Error crítico, acción bloqueada, sin permisos, fallo del sistema." },
  ];

  private readonly msgs: Record<string, { summary: string; detail: string }> = {
    success: { summary: "Guardado",     detail: "El registro fue actualizado correctamente." },
    info:    { summary: "Información",  detail: "La sincronización puede tardar hasta 5 minutos." },
    warn:    { summary: "Atención",     detail: "Faltan 2 documentos por validar antes de continuar." },
    error:   { summary: "Error",        detail: "No se pudo completar la operación. Intenta de nuevo." },
  };

  toast(severity: string) {
    const m = this.msgs[severity];
    this.msgSvc.add({ severity, summary: m.summary, detail: m.detail, life: 4000 });
  }

  toastSticky() {
    this.msgSvc.add({
      severity: "warn", summary: "Sesión por vencer",
      detail: "Tu sesión expira en 5 minutos. Guarda tu trabajo.",
      sticky: true, closable: true,
    });
  }

  toastMultiple() {
    this.msgSvc.addAll([
      { severity: "success", summary: "Paso 1", detail: "Validación exitosa.", life: 3000 },
      { severity: "info",    summary: "Paso 2", detail: "Procesando envío...", life: 4000 },
      { severity: "warn",    summary: "Aviso",  detail: "El correo no fue confirmado.", life: 5000 },
    ]);
  }
}
