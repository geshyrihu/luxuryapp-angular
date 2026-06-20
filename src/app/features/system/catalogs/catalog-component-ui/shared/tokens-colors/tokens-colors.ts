import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

interface PaletaColor {
  nombre: string;
  rol: string;
  token: string;
  uso: string;
}

@Component({
  selector: "app-tokens-colors",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    DividerModule,
    TooltipModule,
    MessageModule,
    AppIcon,
  ],
  template: `
    <div class="grid">
      <div class="col-12">
        <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">Paletas Cromáticas</h3>
        <p-message severity="info" text="LuxuryApp utiliza una paleta primaria para la UI y una paleta Premium/Soporte para documentos oficiales." class="mb-4 block"></p-message>

        <div class="grid">
          @for (color of paleta; track color.token) {
            <div class="col-12 md:col-6 xl:col-4">
              <div class="token-swatch shadow-1 flex align-items-center p-3 surface-card border-round cursor-pointer transition-all hover:shadow-3" (click)="copy(color.token)">
                <div class="swatch-color border-round-sm mr-3" [style.background]="'var(' + color.token + ')'" style="width: 50px; height: 50px;"></div>
                <div class="swatch-info flex-grow-1">
                  <span class="block font-bold text-sm">{{ color.nombre }}</span>
                  <code class="text-primary text-xs">{{ color.token }}</code>
                  <div class="text-xs text-secondary mt-1 line-height-2">{{ color.uso }}</div>
                </div>
                <app-icon [icon]="'copy'" class="text-400" />
              </div>
            </div>
          }
        </div>
      </div>

      <div class="col-12 mt-5">
        <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">Tipografía de Sistema</h3>
        <div class="grid">
          <div class="col-12 lg:col-8">
            <p-table [value]="estilosTipografia" responsiveLayout="scroll" styleClass="p-datatable-sm shadow-1 border-round overflow-hidden">
              <ng-template pTemplate="header">
                <tr>
                  <th>Elemento</th>
                  <th>Familia</th>
                  <th>Tamaño</th>
                  <th>Uso Recomendado</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td><strong>{{ row.elemento }}</strong></td>
                  <td class="font-mono text-xs">{{ row.familia }}</td>
                  <td><p-tag [value]="row.tamano" severity="secondary"></p-tag></td>
                  <td class="text-sm">{{ row.uso }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
          <div class="col-12 lg:col-4">
            <p-card header="Reglas de Elevación">
              <div class="flex flex-column gap-3">
                <div class="shadow-1 p-3 border-round surface-card border-1 border-100">Shadow 1 (Cards Standard)</div>
                <div class="shadow-2 p-3 border-round surface-card border-1 border-100">Shadow 2 (Overlays / Modals)</div>
                <div class="shadow-3 p-3 border-round surface-card border-1 border-100">Shadow 3 (Popovers)</div>
                <div class="shadow-4 p-3 border-round surface-card border-1 border-100">Shadow 4 (Focus / Floating)</div>
              </div>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .token-swatch {
      width: 100%;
      background: var(--ds-bg-surface);
      border-radius: var(--ds-radius-md);
      overflow: hidden;
      cursor: pointer;
      border: 1px solid var(--ds-border);
      transition: transform 0.2s;
    }
    .token-swatch:hover {
      transform: translateY(-4px);
      border-color: var(--ds-primary);
    }
    .swatch-color {
      border-radius: var(--ds-radius-sm);
    }
    code {
      background: var(--ds-bg-sunken);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: var(--ds-font-family-mono);
    }
  `],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})
export class TokensColors {
  private messageService = inject(MessageService);

  readonly paleta: PaletaColor[] = [
    { nombre: "Primary", rol: "Acción principal", token: "--ds-primary", uso: "Botones principales, foco, navegación." },
    { nombre: "On Primary", rol: "Texto sobre primario", token: "--ds-on-primary", uso: "Iconos y texto dentro de botones primarios." },
    { nombre: "Primary Container", rol: "Fondo primario suave", token: "--ds-primary-container", uso: "Superficies destacadas o de selección." },
    { nombre: "On Primary Container", rol: "Texto en contenedor primario", token: "--ds-on-primary-container", uso: "Textos en superficies destacadas." },
    
    { nombre: "Secondary", rol: "Acción secundaria", token: "--ds-secondary", uso: "Botones secundarios, chips, divisores." },
    { nombre: "On Secondary", rol: "Texto sobre secundario", token: "--ds-on-secondary", uso: "Texto en elementos secundarios." },
    { nombre: "Secondary Container", rol: "Fondo secundario suave", token: "--ds-secondary-container", uso: "Elementos inactivos o de menor prioridad." },
    { nombre: "On Secondary Container", rol: "Texto en contenedor secundario", token: "--ds-on-secondary-container", uso: "Textos en superficies secundarias." },

    { nombre: "Tertiary", rol: "Accento / Destacado", token: "--ds-tertiary", uso: "Alertas informativas, elementos de éxito." },
    { nombre: "On Tertiary", rol: "Texto sobre terciario", token: "--ds-on-tertiary", uso: "Texto en botones o alertas terciarias." },

    { nombre: "Error", rol: "Peligro / Destructivo", token: "--ds-error", uso: "Textos de error, botones de eliminar." },
    { nombre: "On Error", rol: "Texto sobre error", token: "--ds-on-error", uso: "Texto blanco en botones destructivos." },
    { nombre: "Error Container", rol: "Fondo de error suave", token: "--ds-error-container", uso: "Fondos de alertas de error." },
    { nombre: "On Error Container", rol: "Texto en contenedor error", token: "--ds-on-error-container", uso: "Textos dentro de alertas de error." },

    { nombre: "Surface", rol: "Fondo principal", token: "--ds-surface", uso: "Fondo de tarjetas, modales y listas." },
    { nombre: "On Surface", rol: "Texto principal", token: "--ds-on-surface", uso: "Textos base legibles sobre Surface." },
    { nombre: "Surface Variant", rol: "Fondo secundario", token: "--ds-surface-variant", uso: "Fondos de campos de texto o menús." },
    { nombre: "On Surface Variant", rol: "Texto secundario", token: "--ds-on-surface-variant", uso: "Textos de ayuda, labels, iconos inactivos." },
    
    { nombre: "Outline", rol: "Bordes principales", token: "--ds-outline", uso: "Bordes de botones, inputs, separadores." },
    { nombre: "Outline Variant", rol: "Bordes suaves", token: "--ds-outline-variant", uso: "Divisores tenues en listas." },
    
    { nombre: "Background", rol: "Fondo de aplicación", token: "--ds-background", uso: "Fondo de toda la página." },
    { nombre: "On Background", rol: "Texto sobre fondo", token: "--ds-on-background", uso: "Titulos principales fuera de tarjetas." },
  ];

  readonly estilosTipografia = [
    {
      elemento: "UI ERP",
      familia: "DM Sans / Inter",
      tamano: "13-32px",
      uso: "Pantallas Angular, PrimeNG, Ionic y operaciones diarias.",
    },
    {
      elemento: "Titulo de documento",
      familia: "DM Sans / Montserrat",
      tamano: "24-28pt",
      uso: "Portadas y encabezados de documentos exportables.",
    },
    {
      elemento: "Cuerpo documental",
      familia: "DM Sans / Inter",
      tamano: "10-11pt",
      uso: "Contenido extenso imprimible o PDF corporativo.",
    },
    {
      elemento: "Codigo y nomenclatura",
      familia: "Roboto Mono / Consolas",
      tamano: "9-10pt",
      uso: "Folios, codigos, versiones y nombres de archivo.",
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
