import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, effect, inject, signal } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { TagSeverity } from "@ui/base/tag.base";
import { NIVEL_PRIORIDAD_TAG_OPTIONS } from "../nivel-prioridad-tag-options";
import { TIPO_SOLICITUD_TAG_OPTIONS } from "../tipo-solicitud-tag-options";

@Component({
  selector: "app-product-detail-modal",
  standalone: true,
  imports: [CommonModule, LxTag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-3">
      @if (solicitud()) {
      <div class="mb-3">
        <div class="d-flex align-items-center gap-2 mb-2">
          <lx-tag [value]="getTipoSolicitudLabel(solicitud().tipoSolicitud)" [severity]="getTipoSolicitudSeverity(solicitud().tipoSolicitud)" [rounded]="true" />
          <lx-tag [value]="getPrioridadLabel(solicitud().prioridad)" [severity]="getPrioridadSeverity(solicitud().prioridad)" [rounded]="true" />
        </div>
        <h4 class="fw-semibold mb-1">{{ solicitud().equipoOInstalacion }}</h4>
        <p class="text-body-secondary mb-0">{{ solicitud().justificacionGasto }}</p>
      </div>

      <div class="table-responsive">
        <table class="table table-sm table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 3rem">N°</th>
              <th>PRODUCTO</th>
              <th class="text-end" style="width: 8rem">CANTIDAD</th>
              <th style="width: 8rem">UNIDAD</th>
              <th class="text-end" style="width: 10rem">TOTAL 1</th>
              <th class="text-end" style="width: 10rem">TOTAL 2</th>
              <th class="text-end" style="width: 10rem">TOTAL 3</th>
            </tr>
          </thead>
          <tbody>
            @for (detail of solicitud().solicitudCompraDetalle; track detail.id; let i = $index) {
            <tr>
              <td class="fw-semibold text-center">{{ i + 1 }}</td>
              <td class="line-height-3">{{ detail.producto }}</td>
              <td class="text-end text-nowrap">{{ detail.cantidad }}</td>
              <td class="text-nowrap">{{ detail.unidadMedida }}</td>
              <td class="text-end text-nowrap">{{ detail.total | number : "1.0-0" }}</td>
              <td class="text-end text-nowrap">{{ detail.total2 | number : "1.0-0" }}</td>
              <td class="text-end text-nowrap">{{ detail.total3 | number : "1.0-0" }}</td>
            </tr>
            } @empty {
            <tr>
              <td colspan="7" class="text-center text-body-secondary py-4">
                No hay productos en esta solicitud.
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ProductDetailModalComponent {
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly dialogRef = inject(DynamicDialogRef);

  solicitud = signal<any>(null);

  constructor() {
    const data = this.dialogConfig.data;
    if (data?.solicitud) {
      this.solicitud.set(data.solicitud);
    }
  }

  getTipoSolicitudLabel(value: number): string {
    return TIPO_SOLICITUD_TAG_OPTIONS.find((item) => item.value === value)?.label ?? "N/D";
  }

  getTipoSolicitudSeverity(value: number): TagSeverity {
    return TIPO_SOLICITUD_TAG_OPTIONS.find((item) => item.value === value)?.severity ?? "secondary";
  }

  getPrioridadLabel(value: number): string {
    return NIVEL_PRIORIDAD_TAG_OPTIONS.find((item) => item.value === value)?.label ?? "N/D";
  }

  getPrioridadSeverity(value: number): TagSeverity {
    return NIVEL_PRIORIDAD_TAG_OPTIONS.find((item) => item.value === value)?.severity ?? "secondary";
  }
}