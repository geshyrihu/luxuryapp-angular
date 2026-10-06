import { ButtonWeb } from "@ui/buttons/web";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { NominaEncabezadoDTO } from "../../interfaces/nomina-encabezado.interface";

@Component({
  selector: "app-nominas-desktop",
  templateUrl: "./nominas-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonWeb, 
    CommonModule,
    LxTag,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption],
})
export class NominasDesktop {
  private tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<NominaEncabezadoDTO[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  add = output<void>();
  view = output<NominaEncabezadoDTO>();
  changeState = output<{ item: NominaEncabezadoDTO; action: string }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  getEstadoSeverity(estadoValue: number): string {
    const map: Record<number, string> = {
      0: "secondary",
      1: "info",
      2: "success",
      3: "contrast",
      4: "secondary",
    };
    return map[estadoValue] ?? "secondary";
  }

  puedeEnviar(estadoValue: number): boolean {
    return estadoValue === 0;
  }

  puedeAprobar(estadoValue: number): boolean {
    return estadoValue === 1;
  }

  puedePagar(estadoValue: number): boolean {
    return estadoValue === 2;
  }

  puedeCerrar(estadoValue: number): boolean {
    return estadoValue === 3;
  }
}
