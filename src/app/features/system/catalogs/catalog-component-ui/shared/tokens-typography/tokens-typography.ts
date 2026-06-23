import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";

@Component({
  selector: "app-tokens-typography",
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, CardModule, MessageModule],
  template: `
    <!-- ── Escala de Encabezados ──────────────────────────────────── -->
    <div class="mb-6">
      <h3 class="text-xl font-bold mb-1 border-bottom-1 border-300 pb-2">Escala de Encabezados</h3>
      <p class="text-sm text-color-secondary mt-1 mb-4">
        Familia base: <strong>Inter</strong> (headings: <strong>Hanken Grotesk</strong>). Usa un único nivel de heading por vista para mantener jerarquía clara.
      </p>
      <div class="flex flex-column gap-3">
        @for (h of headings; track h.tag) {
          <div class="surface-card border-1 border-round p-3 flex align-items-center gap-3">
            <div class="flex-grow-1">
              <div [style.font-size]="h.size"
                   [style.font-weight]="h.weight"
                   [style.font-family]="'var(--ds-font-family-base)'"
                   [style.line-height]="'1.2'"
                   class="text-color">
                {{ h.ejemplo }}
              </div>
            </div>
            <div class="flex flex-column align-items-end gap-1 flex-shrink-0">
              <p-tag [value]="h.size" severity="secondary" />
              <code class="text-xs">{{ h.token }}</code>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- ── Escala ERP UI ─────────────────────────────────────────── -->
    <div class="mb-6">
      <h3 class="text-xl font-bold mb-1 border-bottom-1 border-300 pb-2">Escala Tipográfica ERP</h3>
      <p class="text-sm text-color-secondary mt-1 mb-4">
        Tokens de tamaño de texto para cada contexto operativo. Un solo uso por nivel evita jerarquías rotas.
      </p>
      <p-table [value]="erpScale" responsiveLayout="scroll" styleClass="p-datatable-sm">
        <ng-template #header>
          <tr>
            <th>Uso</th>
            <th>Token CSS</th>
            <th>Tamaño</th>
            <th>Ejemplo vivo</th>
            <th>Criterio</th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td><strong>{{ item.role }}</strong></td>
            <td><code class="text-xs">{{ item.token }}</code></td>
            <td><p-tag [value]="item.size" severity="secondary" /></td>
            <td>
              <span [style.font-size]="item.size"
                    [style.font-family]="'var(--ds-font-family-base)'">
                {{ item.example }}
              </span>
            </td>
            <td class="text-sm text-color-secondary">{{ item.usage }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- ── Familias Tipográficas ──────────────────────────────────── -->
    <div class="mb-2">
      <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">Familias Tipográficas</h3>
      <div class="grid">
        @for (f of families; track f.token) {
          <div class="col-12 md:col-6 xl:col-4">
            <div class="surface-card border-1 border-round p-4">
              <span class="text-xs font-bold text-color-secondary uppercase" style="letter-spacing:.06em">{{ f.label }}</span>
              <div class="mt-2 mb-2" [style.font-family]="f.css" style="font-size:1.5rem;line-height:1.3">
                AaBbCc 0123
              </div>
              <code class="text-xs block mb-1">{{ f.token }}</code>
              <span class="text-xs text-color-secondary">{{ f.uso }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    code {
      background: var(--ds-bg-sunken);
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      font-family: var(--ds-font-family-mono);
      display: inline-block;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class TokensTypography {
  readonly headings = [
    { tag: "h1", size: "2rem",    weight: "700", token: "--ds-font-size-display",     ejemplo: "h1 · Display 32px — Portada de módulo o hero institucional" },
    { tag: "h2", size: "1.75rem", weight: "700", token: "--ds-font-size-page-title",  ejemplo: "h2 · Page Title 28px — Título principal de vista" },
    { tag: "h3", size: "1.25rem", weight: "600", token: "--ds-font-size-section-title", ejemplo: "h3 · Section Title 20px — Agrupación dentro de cards o paneles" },
    { tag: "h4", size: "1rem",    weight: "600", token: "--ds-font-size-card-title",  ejemplo: "h4 · Card / Dialog 16px — Encabezado compacto" },
    { tag: "p",  size: "0.9375rem", weight: "400", token: "--ds-font-size-body",      ejemplo: "p · Body 15px — Lectura operativa y párrafos breves" },
    { tag: "label", size: "0.875rem", weight: "500", token: "--ds-font-size-label",   ejemplo: "label · 14px — Label persistente sobre controles" },
    { tag: "small", size: "0.8125rem", weight: "400", token: "--ds-font-size-help",   ejemplo: "small · Help 13px — Hints, restricciones y validaciones" },
    { tag: "micro", size: "0.75rem",  weight: "400", token: "--ds-font-size-micro",   ejemplo: "micro · 12px — Metadatos y badges secundarios" },
  ];

  readonly erpScale = [
    { role: "Display institucional", token: "--ds-font-size-display",       size: "32px",   usage: "Hero interno, portada de módulo, pantalla guía.", example: "Demo institucional" },
    { role: "Título de página",      token: "--ds-font-size-page-title",    size: "28px",   usage: "Una vez por vista; describe la tarea operativa principal.", example: "Solicitudes de mantenimiento" },
    { role: "Título de sección",     token: "--ds-font-size-section-title", size: "20px",   usage: "Agrupa información relacionada en cards o paneles.", example: "Datos generales" },
    { role: "Card / Dialog",         token: "--ds-font-size-card-title",    size: "16px",   usage: "Encabezados compactos en cards, dialogs y paneles.", example: "Resumen financiero" },
    { role: "Texto operativo",       token: "--ds-font-size-body",          size: "15px",   usage: "Párrafos breves, instrucciones y lectura normal del ERP.", example: "Selecciona el área responsable" },
    { role: "Label",                 token: "--ds-font-size-label",         size: "14px",   usage: "Siempre visible sobre el campo; no sustituir por placeholder.", example: "Importe autorizado" },
    { role: "Tabla y listas",        token: "--ds-font-size-table",         size: "14px",   usage: "Contenido compacto, alineado y fácil de comparar.", example: "ERP-2026-001 | Finanzas" },
    { role: "Ayuda y validación",    token: "--ds-font-size-help",          size: "13px",   usage: "Hints, restricciones, validaciones y textos secundarios.", example: "Máx. 255 caracteres" },
    { role: "KPI compacto",          token: "--ds-font-size-metric",        size: "24px",   usage: "Métricas de dashboard, valores destacados.", example: "$ 124,500" },
    { role: "Micro / Badge",         token: "--ds-font-size-micro",         size: "12px",   usage: "Metadatos, versiones, timestamps y etiquetas pequeñas.", example: "v2.1 · 2026-04" },
  ];

  readonly families = [
    {
      label: "UI Base",
      token: "--ds-font-family-base",
      css: "'Inter', 'Hanken Grotesk', sans-serif",
      uso: "Pantallas Angular, PrimeNG, Ionic y todas las vistas operativas del ERP.",
    },
    {
      label: "Monoespaciada",
      token: "--ds-font-family-mono",
      css: "'Roboto Mono', 'Consolas', monospace",
      uso: "Folios, códigos, versiones, nombres de archivo y bloques de código.",
    },
    {
      label: "Documental",
      token: "--ds-font-family-document",
      css: "'Hanken Grotesk', 'Inter', sans-serif",
      uso: "Portadas, encabezados y cuerpo de documentos exportables (PDF, Word).",
    },
  ];
}
