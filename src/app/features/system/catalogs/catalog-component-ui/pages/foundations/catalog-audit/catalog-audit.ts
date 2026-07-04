import { CommonModule } from "@angular/common";
import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { resolveIconifyIcon } from "src/app/core/utils/icon-mapping";

interface ItemChecklist {
  numero: number;
  descripcion: string;
  aprobado: boolean;
}

interface BloqueVisual {
  titulo: string;
  icono: string;
  descripcion: string;
}

@Component({
  selector: "app-catalog-audit",
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    MessageModule,
    TableModule,
    TagModule,
    AppIcon,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">Auditoróa y Bloques Documentales</h2>
        <p class="text-secondary">
          Herramientas para validar la calidad documental y bloques visuales de soporte.
        </p>
      </div>

      <div class="grid">
        <div class="col-12">
          <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">Bloques de Contenido</h3>
          <div class="grid">
            @for (bloque of bloquesVisuales; track bloque.titulo) {
            <div class="col-12 lg:col-4">
              <article class="border-round-xl border-1 p-4 h-full"
                [class.bg-yellow-50]="bloque.titulo === 'Advertencia'"
                [class.border-yellow-300]="bloque.titulo === 'Advertencia'"
                [class.bg-blue-50]="bloque.titulo === 'Nota'"
                [class.border-blue-200]="bloque.titulo === 'Nota'"
                [class.bg-green-50]="bloque.titulo === 'Buena practica'"
                [class.border-green-200]="bloque.titulo === 'Buena practica'">
                <div class="flex align-items-center gap-2 mb-3">
                  <app-icon [icon]="iconifyIcon(bloque.icono)" class="text-xl" />
                  <strong class="text-lg">{{ bloque.titulo }}</strong>
                </div>
                <p class="m-0 text-color-secondary line-height-3 text-sm">{{ bloque.descripcion }}</p>
              </article>
            </div>
            }
          </div>
        </div>

        <div class="col-12 mt-5">
          <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">Checklist de Auditoróa Rápida</h3>
          <p-card [styleClass]="puntajeAprobatorio() ? 'border-left-3 border-green-500 mb-4' : 'border-left-3 border-red-500 mb-4'">
            <div class="flex align-items-center gap-3">
              <div class="w-4rem h-4rem border-round-lg bg-primary text-white flex align-items-center justify-content-center text-2xl font-bold">
                {{ puntajeChecklist() }}
              </div>
              <div>
                <strong class="text-lg">{{ puntajeChecklist() }} / 15 ótems aprobados</strong>
                <p class="m-0 text-secondary text-sm">
                  {{ puntajeAprobatorio() ? "Documento listo para publicación oficial." : "Requiere correcciones obligatorias antes de publicar." }}
                </p>
              </div>
            </div>
          </p-card>

          <div class="grid">
            @for (item of checklist(); track item.numero) {
            <div class="col-12 md:col-6">
              <div class="flex align-items-start gap-3 border-round-lg border-1 p-3 h-full transition-all hover:surface-100 cursor-pointer"
                [class.bg-green-50]="item.aprobado"
                [class.border-green-200]="item.aprobado"
                [class.bg-red-50]="!item.aprobado"
                [class.border-red-200]="!item.aprobado"
                (click)="toggleChecklistItem(item.numero)">
                <p-checkbox [ngModel]="item.aprobado" (ngModelChange)="toggleChecklistItem(item.numero)" [binary]="true"></p-checkbox>
                <p class="m-0 text-sm line-height-2"><strong>{{ item.numero }}.</strong> {{ item.descripcion }}</p>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogAudit {
  readonly bloquesVisuales: BloqueVisual[] = [
    { titulo: "Advertencia", icono: "icon.alert", descripcion: "Usar cuando el incumplimiento genera riesgo fisico, legal, economico u operativo." },
    { titulo: "Nota", icono: "icon.information", descripcion: "Informacion complementaria que aclara el procedimiento sin ser un paso obligatorio." },
    { titulo: "Buena practica", icono: "icon.check-circle", descripcion: "Recomendacion validada por el equipo para elevar calidad y consistencia." },
  ];

  checklist = signal<ItemChecklist[]>([
    { numero: 1, descripcion: "El codigo sigue nomenclatura estandar TIPO-DEPTO-NNN.", aprobado: true },
    { numero: 2, descripcion: "La portada incluye titulo, codigo, version, fecha, clasificacion y estado.", aprobado: true },
    { numero: 3, descripcion: "Existe tabla de control de versiones con al menos una entrada.", aprobado: true },
    { numero: 4, descripcion: "Todas las secciones obligatorias del tipo estan presentes.", aprobado: true },
    { numero: 5, descripcion: "Los terminos del glosario base son usados consistentemente.", aprobado: false },
    { numero: 6, descripcion: "No hay siglas sin definir en su primera aparicion.", aprobado: true },
    { numero: 7, descripcion: "El nivel de confidencialidad esta marcado en encabezado o pie.", aprobado: true },
    { numero: 8, descripcion: "La tipografia corresponde al estandar: Inter para UI, Hanken Grotesk para headings, JetBrains Mono para codigo.", aprobado: false },
    { numero: 9, descripcion: "Los colores pertenecen a tokens DS y no a hexadecimales locales.", aprobado: true },
    { numero: 10, descripcion: "El flujograma, si existe, usa notacion BPMN simplificada.", aprobado: true },
    { numero: 11, descripcion: "La matriz RACI identifica al menos un responsable y un aprobador.", aprobado: true },
    { numero: 12, descripcion: "El tono es apropiado para la audiencia objetivo.", aprobado: true },
    { numero: 13, descripcion: "El documento fue revisado por supervisor antes de aprobacion.", aprobado: false },
    { numero: 14, descripcion: "Los metadatos para repositorio digital estan completos.", aprobado: true },
    { numero: 15, descripcion: "El documento cumple contraste WCAG 2.1 AA en version digital.", aprobado: true },
  ]);

  puntajeChecklist = computed(() => this.checklist().filter((item) => item.aprobado).length);
  puntajeAprobatorio = computed(() => this.puntajeChecklist() >= 12);

  toggleChecklistItem(numero: number): void {
    this.checklist.update((items) =>
      items.map((item) =>
        item.numero === numero ? { ...item, aprobado: !item.aprobado } : item,
      ),
    );
  }

  iconifyIcon(primeClass: string): string {
    return resolveIconifyIcon(primeClass, "icon.cog");
  }
}
