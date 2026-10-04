import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-estado-financiero-list-desktop",
  templateUrl: "./estado-financiero-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxTag,
    WebButtonIcon,
    WebButtonIconConfirm,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    NgbTooltipModule,
    LuxTableCaption,
    TableFooter,
  ],
})
export class EstadoFinancieroListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  processingUpload = input<Set<string>>(new Set());
  processingAuthorize = input<Set<string>>(new Set());
  processingDesauthorize = input<Set<string>>(new Set());
  processingSend = input<Set<string>>(new Set());

  upload = output<{ id: string; title: string }>();
  authorize = output<string>();
  desauthorize = output<string>();
  send = output<{ id: string; title: string }>();
  viewPdf = output<{ url: string; fileName: string }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  isProcessingUpload(id: string): boolean {
    return this.processingUpload().has(id);
  }
  isProcessingAuthorize(id: string): boolean {
    return this.processingAuthorize().has(id);
  }
  isProcessingDesauthorize(id: string): boolean {
    return this.processingDesauthorize().has(id);
  }
  isProcessingSend(id: string): boolean {
    return this.processingSend().has(id);
  }
}
