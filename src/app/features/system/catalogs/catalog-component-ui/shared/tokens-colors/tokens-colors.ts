import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MessageService } from "primeng/api";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";

interface TokenColor {
  nombre: string;
  token: string;
  uso: string;
}

interface TokenGroup {
  titulo: string;
  descripcion: string;
  tokens: TokenColor[];
}

@Component({
  selector: "app-tokens-colors",

  imports: [
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
    DividerModule,
    TooltipModule,
    MessageModule,
    ToastModule,
    AppIcon,
  ],
  template: `
    <p-toast position="top-right" />

    <!-- -- Material 3 Structural Roles ---------------------------- -->
    <div class="mb-6">
      <h3 class="text-xl font-bold mb-1 border-bottom-1 border-300 pb-2">
        Roles Estructurales (Material 3)
      </h3>
      <p class="text-sm text-color-secondary mt-1 mb-4">
        Tokens de arquitectura de color. Definen superficies, texto y contornos
        del sistema. Haz clic en cualquier swatch para copiar el token.
      </p>
      <div class="grid">
        @for (color of paleta; track color.token) {
          <div class="col-12 md:col-6 xl:col-4">
            <div
              class="token-swatch flex align-items-center p-3 surface-card border-1 border-round cursor-pointer"
              (click)="copy(color.token)"
              [pTooltip]="'Copiar ' + color.token"
              tooltipPosition="top"
            >
              <div
                class="swatch-color border-round-sm mr-3 flex-shrink-0"
                [style.background]="'var(' + color.token + ')'"
                style="width:48px;height:48px;border:1px solid var(--ds-border)"
              ></div>
              <div class="flex-grow-1 min-w-0">
                <span class="block font-bold text-sm">{{ color.nombre }}</span>
                <code class="text-xs">{{ color.token }}</code>
                <div class="text-xs text-color-secondary mt-1 line-height-2">
                  {{ color.uso }}
                </div>
              </div>
              <app-icon
                [icon]="'mdi:content-copy'"
                class="text-color-secondary text-sm ml-2 flex-shrink-0"
              />
            </div>
          </div>
        }
      </div>
    </div>

    <!-- -- Semantic Operational Tokens ---------------------------- -->
    <div class="mb-6">
      <h3 class="text-xl font-bold mb-1 border-bottom-1 border-300 pb-2">
        Tokens Semínticos Operacionales
      </h3>
      <p class="text-sm text-color-secondary mt-1 mb-4">
        Colores de uso directo en componentes: botones, badges, alertas y
        estados de negocio. Son la capa que PrimeNG y los custom components
        consumen via <code>--ds-*</code>.
      </p>

      @for (group of semanticGroups; track group.titulo) {
        <div class="mb-4">
          <div class="flex align-items-center gap-2 mb-2">
            <span
              class="font-semibold text-sm uppercase text-color-secondary"
              style="letter-spacing:.06em"
              >{{ group.titulo }}</span
            >
            <span class="text-xs text-color-secondary"
              >é {{ group.descripcion }}</span
            >
          </div>
          <div class="grid">
            @for (color of group.tokens; track color.token) {
              <div class="col-12 md:col-6 xl:col-3">
                <div
                  class="token-swatch flex align-items-center p-3 surface-card border-1 border-round cursor-pointer"
                  (click)="copy(color.token)"
                  [pTooltip]="'Copiar ' + color.token"
                  tooltipPosition="top"
                >
                  <div
                    class="swatch-color border-round-sm mr-3 flex-shrink-0"
                    [style.background]="'var(' + color.token + ')'"
                    style="width:40px;height:40px;border:1px solid var(--ds-border)"
                  ></div>
                  <div class="flex-grow-1 min-w-0">
                    <span class="block font-semibold text-sm">{{
                      color.nombre
                    }}</span>
                    <code class="text-xs">{{ color.token }}</code>
                    <div
                      class="text-xs text-color-secondary mt-1 line-height-2"
                    >
                      {{ color.uso }}
                    </div>
                  </div>
                  <app-icon
                    [icon]="'mdi:content-copy'"
                    class="text-color-secondary text-sm ml-2 flex-shrink-0"
                  />
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- -- Reglas de Elevación -------------------------------------- -->
    <div class="mb-2">
      <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">
        Reglas de Elevación (Sombras)
      </h3>
      <div class="grid">
        @for (s of shadowLevels; track s.label) {
          <div class="col-12 md:col-6 xl:col-3">
            <div
              class="surface-card border-round p-4 flex flex-column gap-2"
              [ngStyle]="{ 'box-shadow': s.value }"
            >
              <span class="font-bold text-sm">{{ s.label }}</span>
              <code class="text-xs text-color-secondary">{{ s.token }}</code>
              <span class="text-xs text-color-secondary">{{ s.uso }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .token-swatch {
        border-color: var(--ds-border);
        transition:
          transform 0.15s,
          border-color 0.15s,
          box-shadow 0.15s;
      }
      .token-swatch:hover {
        transform: translateY(-3px);
        border-color: var(--ds-primary);
        box-shadow: var(--ds-shadow-md);
      }
      code {
        background: var(--ds-bg-sunken);
        padding: 0.15rem 0.35rem;
        border-radius: 4px;
        font-family: var(--ds-font-family-mono);
        display: inline-block;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [MessageService],
})
export class TokensColors {
  private messageService = inject(MessageService);

  // -- Material 3 structural roles ----------------------------------
  readonly paleta: TokenColor[] = [
    {
      nombre: "Primary",
      token: "--ds-primary",
      uso: "Acción principal, navegación activa, foco.",
    },
    {
      nombre: "On Primary",
      token: "--ds-on-primary",
      uso: "Texto/icono sobre superficie primaria.",
    },
    {
      nombre: "Primary Container",
      token: "--ds-primary-container",
      uso: "Superficies destacadas o de selección.",
    },
    {
      nombre: "On Primary Container",
      token: "--ds-on-primary-container",
      uso: "Texto en contenedor primario suave.",
    },

    {
      nombre: "Secondary",
      token: "--ds-secondary",
      uso: "Botones secundarios, chips, divisores.",
    },
    {
      nombre: "On Secondary",
      token: "--ds-on-secondary",
      uso: "Texto sobre elemento secundario.",
    },
    {
      nombre: "Secondary Container",
      token: "--ds-secondary-container",
      uso: "Fondos de menor prioridad, inactivos.",
    },
    {
      nombre: "On Secondary Container",
      token: "--ds-on-secondary-container",
      uso: "Texto en contenedor secundario.",
    },

    {
      nombre: "Tertiary",
      token: "--ds-tertiary",
      uso: "Acento terciario: óxito alternativo, teal.",
    },
    {
      nombre: "On Tertiary",
      token: "--ds-on-tertiary",
      uso: "Texto sobre elemento terciario.",
    },

    {
      nombre: "Error / Danger",
      token: "--ds-error",
      uso: "Eliminación, estados bloqueantes, errores.",
    },
    {
      nombre: "On Error",
      token: "--ds-on-error",
      uso: "Texto blanco en superficies de error.",
    },
    {
      nombre: "Error Container",
      token: "--ds-error-container",
      uso: "Fondo suave para alertas de error.",
    },
    {
      nombre: "On Error Container",
      token: "--ds-on-error-container",
      uso: "Texto dentro de alertas de error.",
    },

    {
      nombre: "Surface",
      token: "--ds-surface",
      uso: "Fondo de cards, modales y listas.",
    },
    {
      nombre: "On Surface",
      token: "--ds-on-surface",
      uso: "Texto principal sobre superficie.",
    },
    {
      nombre: "Surface Variant",
      token: "--ds-surface-variant",
      uso: "Fondos de inputs o menís secundarios.",
    },
    {
      nombre: "On Surface Variant",
      token: "--ds-on-surface-variant",
      uso: "Labels, iconos inactivos, texto ayuda.",
    },

    {
      nombre: "Outline",
      token: "--ds-outline",
      uso: "Bordes de controles interactivos.",
    },
    {
      nombre: "Outline Variant",
      token: "--ds-outline-variant",
      uso: "Divisores tenues entre secciones.",
    },

    {
      nombre: "Background",
      token: "--ds-background",
      uso: "Fondo general de la aplicación.",
    },
    {
      nombre: "On Background",
      token: "--ds-on-background",
      uso: "Tútulos principales fuera de cards.",
    },
  ];

  // -- Semantic operational tokens (grouped) -----------------------
  readonly semanticGroups: TokenGroup[] = [
    {
      titulo: "óxito",
      descripcion: "Confirmaciones, mítricas positivas, estados completados",
      tokens: [
        {
          nombre: "Success",
          token: "--ds-success",
          uso: "Color de texto/icono en elementos de óxito.",
        },
        {
          nombre: "Success Light",
          token: "--ds-success-light",
          uso: "Fondo suave para banners y badges de óxito.",
        },
      ],
    },
    {
      titulo: "Atención",
      descripcion: "Pendientes, riesgos moderados, alertas no cróticas",
      tokens: [
        {
          nombre: "Warning",
          token: "--ds-warning",
          uso: "Texto/icono en alertas y estados pendientes.",
        },
        {
          nombre: "Warning Light",
          token: "--ds-warning-light",
          uso: "Fondo suave para alertas de atención.",
        },
      ],
    },
    {
      titulo: "Peligro",
      descripcion: "Errores, eliminación, estados bloqueantes",
      tokens: [
        {
          nombre: "Danger",
          token: "--ds-danger",
          uso: "Texto/icono en acciones destructivas.",
        },
        {
          nombre: "Danger Light",
          token: "--ds-danger-light",
          uso: "Fondo suave para alertas de error.",
        },
      ],
    },
    {
      titulo: "Información",
      descripcion: "Contexto, ayuda, mensajes informativos",
      tokens: [
        {
          nombre: "Info",
          token: "--ds-info",
          uso: "Texto/icono en mensajes informativos.",
        },
        {
          nombre: "Info Light",
          token: "--ds-info-light",
          uso: "Fondo suave para banners informativos.",
        },
      ],
    },
    {
      titulo: "Identidad & Documental",
      descripcion: "Acento premium y neutrales para documentos",
      tokens: [
        {
          nombre: "Luxury Gold",
          token: "--ds-luxury-gold",
          uso: "Acento premium en reportes y portadas.",
        },
        {
          nombre: "Luxury Gold Light",
          token: "--ds-luxury-gold-light",
          uso: "Fondo suave para acentos dorados.",
        },
        {
          nombre: "Document Neutral",
          token: "--ds-document-neutral",
          uso: "Metadatos, fechas, versionado.",
        },
      ],
    },
    {
      titulo: "Fondos del Sistema",
      descripcion: "Superficies de página, cards e inputs",
      tokens: [
        {
          nombre: "BG Page",
          token: "--ds-bg-page",
          uso: "Fondo general de vistas administrativas.",
        },
        {
          nombre: "BG Surface",
          token: "--ds-bg-surface",
          uso: "Cards, formularios, modales.",
        },
        {
          nombre: "BG Sunken",
          token: "--ds-bg-sunken",
          uso: "Inputs, zonas hundidas, código.",
        },
        {
          nombre: "BG Elevated",
          token: "--ds-bg-elevated",
          uso: "Elementos flotantes sobre la superficie.",
        },
      ],
    },
    {
      titulo: "Texto",
      descripcion: "Jerarquóa tipogrófica por importancia",
      tokens: [
        {
          nombre: "Text Primary",
          token: "--ds-text-primary",
          uso: "Cuerpo principal, tútulos operativos.",
        },
        {
          nombre: "Text Secondary",
          token: "--ds-text-secondary",
          uso: "Labels, captions, texto de apoyo.",
        },
        {
          nombre: "Text Muted",
          token: "--ds-text-muted",
          uso: "Metadatos, hints, placeholders.",
        },
      ],
    },
    {
      titulo: "Bordes",
      descripcion: "Separación visual de controles y superficies",
      tokens: [
        {
          nombre: "Border",
          token: "--ds-border",
          uso: "Borde esténdar de cards e inputs.",
        },
        {
          nombre: "Border Strong",
          token: "--ds-border-strong",
          uso: "Borde ónfasis, divisores fuertes.",
        },
      ],
    },
  ];

  readonly shadowLevels = [
    {
      label: "Shadow SM",
      token: "--ds-shadow-sm",
      value: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.06)",
      uso: "Cards esténdar, listas.",
    },
    {
      label: "Shadow MD",
      token: "--ds-shadow-md",
      value: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.06)",
      uso: "Overlays, paneles secundarios.",
    },
    {
      label: "Shadow LG",
      token: "--ds-shadow-lg",
      value:
        "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.06)",
      uso: "Popovers, tooltips grandes.",
    },
    {
      label: "Shadow XL",
      token: "--ds-shadow-xl",
      value:
        "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)",
      uso: "Modales, drawers, FAB.",
    },
  ];

  async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.messageService.add({
        severity: "success",
        summary: "Copiado",
        detail: text,
        life: 1500,
      });
    } catch {
      this.messageService.add({
        severity: "error",
        summary: "Error al copiar",
        detail: "No se pudo copiar al portapapeles",
        life: 3000,
      });
    }
  }
}
