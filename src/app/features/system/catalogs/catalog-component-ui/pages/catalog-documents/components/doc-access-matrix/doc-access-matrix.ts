import { Component, input } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";

interface AccesoRol {
  documento: string;
  superUsuario: string;
  direccion: string;
  staff: string;
  condomino: string;
  proveedor: string;
}

type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

@Component({
  selector: "app-doc-access-matrix",
  standalone: true,
  imports: [CardModule, TableModule, TagModule],
  template: `
    <p-card header="Matriz de Acceso por Rol">
      <p-table [value]="matrizAcceso()" [scrollable]="true" scrollHeight="300px" styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th>Documento</th>
            <th>Super Usuario</th>
            <th>Dirección</th>
            <th>Staff</th>
            <th>Condomino</th>
            <th>Proveedor</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
          <tr>
            <td class="text-xs font-bold">{{ row.documento }}</td>
            <td><p-tag [value]="row.superUsuario" [severity]="getColorAcceso(row.superUsuario)"></p-tag></td>
            <td><p-tag [value]="row.direccion" [severity]="getColorAcceso(row.direccion)"></p-tag></td>
            <td><p-tag [value]="row.staff" [severity]="getColorAcceso(row.staff)"></p-tag></td>
            <td><p-tag [value]="row.condomino" [severity]="getColorAcceso(row.condomino)"></p-tag></td>
            <td><p-tag [value]="row.proveedor" [severity]="getColorAcceso(row.proveedor)"></p-tag></td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
})
export class DocAccessMatrix {
  matrizAcceso = input<AccesoRol[]>([]);

  getColorAcceso(valor: string): TagSeverity {
    if (valor === "Sin acceso") return "danger";
    if (valor === "Editar" || valor === "Publicar") return "success";
    if (valor === "Aprobar") return "info";
    if (valor === "Leer" || valor === "Consultar" || valor === "Leer parcial" || valor === "Version simplificada") {
      return "secondary";
    }
    if (valor === "Si aplica") return "warn";
    return "warn";
  }
}
