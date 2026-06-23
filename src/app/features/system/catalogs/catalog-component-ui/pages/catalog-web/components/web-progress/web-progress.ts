import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { ProgressBarModule } from "primeng/progressbar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SkeletonModule } from "primeng/skeleton";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

@Component({
  selector: "app-web-progress",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    SkeletonModule,
    DividerModule,
    TagModule,
    AppIcon,
  ],
  template: `
    <div class="grid">

      <!-- ── ProgressBar ──────────────────────────────────────────── -->
      <div class="col-12">
        <p-card header="ProgressBar — p-progressBar">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Usa la barra determinada cuando conoces el progreso exacto.
            La indeterminada solo para procesos de duración desconocida y breve.
          </p>

          <div class="grid">

            <!-- Determinadas con valores -->
            <div class="col-12 lg:col-6">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block" style="letter-spacing:.06em">Determinadas</span>
              <div class="flex flex-column gap-4">
                @for (pb of progressBars; track pb.label) {
                  <div>
                    <div class="flex justify-content-between align-items-center mb-1">
                      <span class="text-sm font-medium">{{ pb.label }}</span>
                      <div class="flex align-items-center gap-2">
                        <span class="text-sm font-bold">{{ pb.value }}%</span>
                        <p-tag [value]="pb.tag" [severity]="pb.severity" [rounded]="true" />
                      </div>
                    </div>
                    <p-progressBar [value]="pb.value" [showValue]="false"
                                   [style]="{'height': '8px', '--p-progressbar-value-background': pb.color}" />
                  </div>
                }
              </div>
            </div>

            <!-- Simulación interactiva -->
            <div class="col-12 lg:col-6">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block" style="letter-spacing:.06em">Simulación interactiva</span>
              <div class="flex flex-column gap-3">
                <div class="flex justify-content-between align-items-center">
                  <span class="text-sm font-medium">Cargando reporte...</span>
                  <span class="text-2xl font-bold text-primary">{{ simValue() }}%</span>
                </div>
                <p-progressBar [value]="simValue()" [showValue]="false" [style]="{'height':'12px'}" />
                <div class="flex gap-2">
                  <p-button label="Iniciar" icon="mdi:play"  size="small" (onClick)="startSim()"
                            [disabled]="simRunning()" />
                  <p-button label="Reiniciar" icon="mdi:refresh" size="small" severity="secondary" [outlined]="true"
                            (onClick)="resetSim()" />
                </div>
              </div>

              <p-divider class="my-4" />

              <!-- Indeterminadas -->
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block" style="letter-spacing:.06em">Indeterminadas</span>
              <div class="flex flex-column gap-3">
                <div>
                  <span class="text-xs text-color-secondary mb-1 block">Estándar</span>
                  <p-progressBar mode="indeterminate" [style]="{'height': '6px'}" />
                </div>
                <div>
                  <span class="text-xs text-color-secondary mb-1 block">Con color personalizado</span>
                  <p-progressBar mode="indeterminate" [style]="{'height': '6px', '--p-progressbar-value-background': 'var(--ds-success)'}" />
                </div>
                <div>
                  <span class="text-xs text-color-secondary mb-1 block">Delgada (scanner effect)</span>
                  <p-progressBar mode="indeterminate" [style]="{'height': '3px', '--p-progressbar-value-background': 'var(--ds-warning)'}" />
                </div>
              </div>
            </div>

          </div>
        </p-card>
      </div>

      <!-- ── ProgressSpinner ──────────────────────────────────────── -->
      <div class="col-12 lg:col-6">
        <p-card header="ProgressSpinner — p-progressSpinner">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Para acciones cortas (&lt;2 s). Si la carga puede superar los 2 s, usa skeleton en su lugar.
          </p>

          <div class="grid text-center">

            <!-- Tamaños -->
            <div class="col-12">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block text-left" style="letter-spacing:.06em">Tamaños</span>
              <div class="flex align-items-center justify-content-around flex-wrap gap-4">
                @for (s of spinnerSizes; track s.label) {
                  <div class="flex flex-column align-items-center gap-2">
                    <p-progressSpinner
                      [style]="{width: s.size, height: s.size}"
                      strokeWidth="4"
                    />
                    <span class="text-xs text-color-secondary">{{ s.label }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="col-12"><p-divider /></div>

            <!-- Colores -->
            <div class="col-12">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block text-left" style="letter-spacing:.06em">Colores semánticos</span>
              <div class="flex align-items-center justify-content-around flex-wrap gap-4">
                @for (sc of spinnerColors; track sc.label) {
                  <div class="flex flex-column align-items-center gap-2">
                    <p-progressSpinner
                      style="width:40px;height:40px"
                      [strokeWidth]="sc.strokeWidth"
                      [style]="{'--p-progressspinner-color-1': sc.color, '--p-progressspinner-color-2': sc.color, '--p-progressspinner-color-3': sc.color, '--p-progressspinner-color-4': sc.color}"
                    />
                    <span class="text-xs text-color-secondary">{{ sc.label }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="col-12"><p-divider /></div>

            <!-- Overlay sobre contenido -->
            <div class="col-12">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block text-left" style="letter-spacing:.06em">Overlay sobre contenido (patrón loading)</span>
              <div class="relative surface-ground border-round p-4" style="min-height:120px">
                <div class="grid text-sm">
                  <div class="col-6 surface-card border-1 border-round p-3"><p-skeleton width="80%" /></div>
                  <div class="col-6 surface-card border-1 border-round p-3"><p-skeleton width="60%" /></div>
                  <div class="col-12 surface-card border-1 border-round p-3 mt-2"><p-skeleton width="40%" /></div>
                </div>
                <!-- Overlay -->
                <div class="absolute inset-0 flex align-items-center justify-content-center border-round"
                     style="background:rgba(255,255,255,.75);backdrop-filter:blur(2px)">
                  <div class="flex flex-column align-items-center gap-2">
                    <p-progressSpinner style="width:48px;height:48px" strokeWidth="4" />
                    <span class="text-sm font-medium text-color">Cargando datos...</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </p-card>
      </div>

      <!-- ── Skeleton ─────────────────────────────────────────────── -->
      <div class="col-12 lg:col-6">
        <p-card header="Skeleton — p-skeleton">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            El skeleton anticipa el layout real y reduce el efecto de "flash" al cargar.
            Úsalo en carga estructural: listas, tablas, cards y dashboards.
          </p>

          <div class="flex flex-column gap-5">

            <!-- Texto y bloques -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">Texto y bloques</span>
              <div class="flex flex-column gap-2">
                <p-skeleton width="30%" height="1rem" />
                <p-skeleton width="100%" height=".85rem" />
                <p-skeleton width="85%" height=".85rem" />
                <p-skeleton width="60%" height=".85rem" />
              </div>
            </div>

            <!-- KPI Card skeleton -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">KPI Card</span>
              <div class="surface-card border-1 border-round p-4">
                <div class="flex justify-content-between align-items-start mb-3">
                  <div class="flex-grow-1 pr-3">
                    <p-skeleton width="60%" height=".7rem" styleClass="mb-2" />
                    <p-skeleton width="40%" height="1.75rem" />
                  </div>
                  <p-skeleton shape="circle" size="3rem" />
                </div>
                <p-skeleton width="70%" height=".65rem" />
              </div>
            </div>

            <!-- Lista skeleton -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">Lista de registros</span>
              <div class="flex flex-column gap-3">
                @for (i of [1,2,3]; track i) {
                  <div class="flex align-items-center gap-3 surface-card border-1 border-round p-3">
                    <p-skeleton shape="circle" size="2.5rem" />
                    <div class="flex-grow-1">
                      <p-skeleton width="65%" height=".85rem" styleClass="mb-1" />
                      <p-skeleton width="40%" height=".65rem" />
                    </div>
                    <p-skeleton width="4.5rem" height="1.5rem" borderRadius="999px" />
                  </div>
                }
              </div>
            </div>

            <!-- Fila de tabla -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">Tabla</span>
              <div class="flex flex-column gap-1">
                <p-skeleton width="100%" height="2.25rem" />
                @for (i of [1,2,3]; track i) {
                  <div class="flex gap-2">
                    <p-skeleton width="20%" height="2rem" />
                    <p-skeleton width="40%" height="2rem" />
                    <p-skeleton width="20%" height="2rem" />
                    <p-skeleton width="20%" height="2rem" />
                  </div>
                }
              </div>
            </div>

          </div>
        </p-card>
      </div>

      <!-- Reglas de uso -->
      <div class="col-12">
        <p-card header="¿Cuándo usar cada patrón?">
          <div class="grid">
            @for (r of loadingRules; track r.titulo) {
              <div class="col-12 md:col-6 xl:col-3">
                <div class="surface-ground border-round p-4 h-full flex flex-column gap-2"
                     [style.border-top]="'3px solid ' + r.color">
                  <app-icon [icon]="r.icon" [style.color]="r.color" class="text-2xl" />
                  <strong>{{ r.titulo }}</strong>
                  <p class="m-0 text-sm text-color-secondary line-height-3">{{ r.cuando }}</p>
                  <div class="mt-auto pt-2">
                    <span class="text-xs font-bold text-color-secondary">EVITAR: </span>
                    <span class="text-xs text-color-secondary">{{ r.evitar }}</span>
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
export class WebProgress implements OnInit, OnDestroy {
  simValue  = signal(0);
  simRunning = signal(false);
  private simInterval?: ReturnType<typeof setInterval>;

  ngOnInit() {}
  ngOnDestroy() { this.clearSim(); }

  startSim() {
    this.simRunning.set(true);
    this.simInterval = setInterval(() => {
      const next = this.simValue() + Math.floor(Math.random() * 8) + 3;
      if (next >= 100) {
        this.simValue.set(100);
        this.simRunning.set(false);
        this.clearSim();
      } else {
        this.simValue.set(next);
      }
    }, 300);
  }

  resetSim() {
    this.clearSim();
    this.simValue.set(0);
    this.simRunning.set(false);
  }

  private clearSim() {
    if (this.simInterval) {
      clearInterval(this.simInterval);
      this.simInterval = undefined;
    }
  }

  readonly progressBars = [
    { label: "Presupuesto ejecutado",      value: 78, tag: "En tiempo",  severity: "success" as const, color: "var(--ds-success)" },
    { label: "Solicitudes procesadas",      value: 55, tag: "En proceso", severity: "info"    as const, color: "var(--ds-info)"    },
    { label: "Capacidad de almacenamiento", value: 91, tag: "Crítico",   severity: "danger"  as const, color: "var(--ds-danger)"  },
    { label: "Tareas vencidas / total",     value: 34, tag: "Atención",  severity: "warn"    as const, color: "var(--ds-warning)" },
  ];

  readonly spinnerSizes = [
    { size: "24px", label: "XS (inline)" },
    { size: "40px", label: "SM (botón)" },
    { size: "56px", label: "MD (card)" },
    { size: "80px", label: "LG (página)" },
  ];

  readonly spinnerColors = [
    { label: "Primary",  color: "var(--ds-primary)",  strokeWidth: "4" },
    { label: "Success",  color: "var(--ds-success)",  strokeWidth: "4" },
    { label: "Warning",  color: "var(--ds-warning)",  strokeWidth: "4" },
    { label: "Danger",   color: "var(--ds-danger)",   strokeWidth: "4" },
    { label: "Info",     color: "var(--ds-info)",     strokeWidth: "4" },
  ];

  readonly loadingRules = [
    {
      titulo: "ProgressBar",
      icon: "mdi:progress-check",
      color: "var(--ds-primary)",
      cuando: "Procesos con progreso medible: subida de archivo, importación masiva, generación de reporte.",
      evitar: "No usar para cargas de página normales donde Skeleton es mejor opción.",
    },
    {
      titulo: "Spinner",
      icon: "mdi:loading",
      color: "var(--ds-info)",
      cuando: "Acciones cortas (&lt;2 s): guardar, buscar, autenticar. Útil en botones y modales.",
      evitar: "No para carga de listados o pantallas completas — usa Skeleton.",
    },
    {
      titulo: "Skeleton",
      icon: "mdi:layers-outline",
      color: "var(--ds-success)",
      cuando: "Carga estructural de vistas, listas, tablas y dashboards. Anticipa el layout real.",
      evitar: "No para acciones de usuario individuales — usa Spinner.",
    },
    {
      titulo: "Overlay Spinner",
      icon: "mdi:layers-plus",
      color: "var(--ds-warning)",
      cuando: "Bloqueo de formulario durante submit o procesamiento que impide interacción.",
      evitar: "No bloquear pantallas completas más de 3 s sin feedback adicional.",
    },
  ];
}
