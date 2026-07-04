import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

type TagSeverity = "success" | "info" | "warn" | "danger" | "secondary" | "contrast";

interface TipoDocumento {
  tipo: string;
  codigo: string;
  destinatario: string;
  confidencialidad: string;
  colorToken: string;
  severity: TagSeverity;
}

interface AccesoRol {
  documento: string;
  superUsuario: string;
  direccion: string;
  staff: string;
  condomino: string;
  proveedor: string;
}

interface NomenclaturaCampo {
  campo: string;
  valores: string;
}

@Component({
  selector: "app-catalog-docs",
  imports: [CommonModule, CardModule, TableModule, TagModule, AppIcon],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">Esténdar Documental LuxuryApp</h2>
        <p class="text-secondary">
          Guía de gobierno para procedimientos, manuales e instructivos corporativos.
        </p>
      </div>

      <div class="grid">
        <div class="col-12">
          <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">Clasificación de Documentos</h3>
          <div class="grid">
            @for (doc of tiposDocumento; track doc.codigo) {
            <div class="col-12 md:col-6 xl:col-4">
              <p-card styleClass="h-full overflow-hidden shadow-1 transition-all hover:shadow-3">
                <div class="flex align-items-center justify-content-between text-white -mt-4 -mx-4 mb-3 px-4 py-3"
                     [style.background]="doc.colorToken">
                  <strong>{{ doc.codigo }}</strong>
                  <p-tag [value]="doc.confidencialidad" [severity]="doc.severity"></p-tag>
                </div>
                <div class="flex flex-column gap-2">
                  <strong class="text-lg">{{ doc.tipo }}</strong>
                  <span class="text-xs text-secondary">Audiencia: {{ doc.destinatario }}</span>
                  <code class="block surface-100 border-1 surface-border border-round px-3 py-2 text-primary text-xs mt-2">
                    {{ getNomenclaturaEjemplo(doc) }}
                  </code>
                </div>
              </p-card>
            </div>
            }
          </div>
        </div>

        <div class="col-12 lg:col-6 mt-4">
          <p-card header="Nomenclatura Inteligente">
            <div class="bg-primary text-white border-round-lg p-3 mb-3">
              <small class="text-yellow-500 font-bold block mb-1">FORMATO OBLIGATORIO</small>
              <code class="text-sm md:text-base">[TIPO]-[DEPTO]-[CODIGO]_v[X.Y]_[AAAA-MM]_[ESTADO].pdf</code>
            </div>
            <p-table [value]="camposNomenclatura" styleClass="p-datatable-sm">
              <ng-template pTemplate="header"><tr><th>Campo</th><th>Valores</th></tr></ng-template>
              <ng-template pTemplate="body" let-row><tr><td><code>{{ row.campo }}</code></td><td class="text-xs">{{ row.valores }}</td></tr></ng-template>
            </p-table>
          </p-card>
        </div>

        <div class="col-12 lg:col-6 mt-4">
          <p-card header="Matriz de Acceso por Rol">
            <p-table [value]="matrizAcceso" [scrollable]="true" scrollHeight="300px" styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr><th>Documento</th><th>Super Usuario</th><th>Dirección</th><th>Staff</th><th>Condomino</th><th>Proveedor</th></tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td class="text-xs font-bold">{{ row.documento }}</td>
                  <td><p-tag [value]="row.superUsuario" [severity]="getColorAcceso(row.superUsuario)" /></td>
                  <td><p-tag [value]="row.direccion" [severity]="getColorAcceso(row.direccion)" /></td>
                  <td><p-tag [value]="row.staff" [severity]="getColorAcceso(row.staff)" /></td>
                  <td><p-tag [value]="row.condomino" [severity]="getColorAcceso(row.condomino)" /></td>
                  <td><p-tag [value]="row.proveedor" [severity]="getColorAcceso(row.proveedor)" /></td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
      </div>
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogDocs {
  readonly tiposDocumento: TipoDocumento[] = [
    { tipo: "Procedimiento Operativo", codigo: "PROC", destinatario: "Staff / Contractor", confidencialidad: "Interno", colorToken: "var(--ds-primary)", severity: "info" },
    { tipo: "Manual Tecnico", codigo: "MANT", destinatario: "Staff especializado", confidencialidad: "Restringido", colorToken: "var(--ds-help, #7c3aed)", severity: "danger" },
    { tipo: "Instructivo Residentes", codigo: "INST", destinatario: "Condomino", confidencialidad: "Publico", colorToken: "var(--ds-document-neutral)", severity: "success" },
    { tipo: "Protocolo de Emergencia", codigo: "PROT", destinatario: "Todos", confidencialidad: "Critico", colorToken: "var(--ds-warning)", severity: "warn" },
    { tipo: "Politica Corporativa", codigo: "POLI", destinatario: "Executive / Corporate", confidencialidad: "Confidencial", colorToken: "var(--ds-success)", severity: "danger" },
    { tipo: "Comunicado a Residentes", codigo: "COMU", destinatario: "Condomino", confidencialidad: "Publico", colorToken: "var(--ds-luxury-gold)", severity: "success" },
  ];

  readonly matrizAcceso: AccesoRol[] = [
    { documento: "Procedimiento Operativo", superUsuario: "Editar", direccion: "Aprobar", staff: "Leer", condomino: "Sin acceso", proveedor: "Leer parcial" },
    { documento: "Manual Tecnico", superUsuario: "Editar", direccion: "Consultar", staff: "Leer", condomino: "Sin acceso", proveedor: "Si aplica" },
    { documento: "Instructivo Residentes", superUsuario: "Publicar", direccion: "Aprobar", staff: "Consultar", condomino: "Leer", proveedor: "Sin acceso" },
    { documento: "Protocolo Emergencia", superUsuario: "Editar", direccion: "Aprobar", staff: "Leer", condomino: "Version simplificada", proveedor: "Leer" },
    { documento: "Politica Corporativa", superUsuario: "Editar", direccion: "Aprobar", staff: "Sin acceso", condomino: "Sin acceso", proveedor: "Sin acceso" },
  ];

  readonly camposNomenclatura: NomenclaturaCampo[] = [
    { campo: "TIPO", valores: "PROC, MANT, INST, PROT, POLI, COMU" },
    { campo: "DEPTO", valores: "ADMI, LEGA, MANT, SIST, RRHH, CONT, OPER, SECU, LIMP, JARD" },
    { campo: "CODIGO", valores: "Numero secuencial de 3 digitos: 001, 002, 003" },
    { campo: "Version", valores: "v1.0 para publicacion inicial; v1.1 para ajuste menor" },
    { campo: "Fecha", valores: "AAAA-MM de publicacion o vigencia" },
    { campo: "ESTADO", valores: "BORRADOR, REVISION, APROBADO, VIGENTE, OBSOLETO" },
  ];

  getNomenclaturaEjemplo(doc: TipoDocumento): string {
    return `${doc.codigo}-DEPTO-001_v1.0_2026-04_VIGENTE.pdf`;
  }

  getColorAcceso(valor: string): TagSeverity {
    if (valor === "Sin acceso") return "danger";
    if (valor === "Editar" || valor === "Publicar") return "success";
    if (valor === "Aprobar") return "info";
    if (["Leer", "Consultar", "Leer parcial", "Version simplificada"].includes(valor)) return "secondary";
    if (valor === "Si aplica") return "warn";
    return "warn";
  }
}
