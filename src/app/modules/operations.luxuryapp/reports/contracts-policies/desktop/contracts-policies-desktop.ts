import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppSortableColumn, AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-contracts-policies-desktop",
  templateUrl: "./contracts-policies-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PdfViewerTrigger,
    AppTable,
    AppSortableColumn,
    LuxTableCaption,
    TableFooter],
})
export class ContractsPoliciesDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  scrollHeight = input<string>("");
  isCloseToEndDate = input.required<(endDate: string | Date) => boolean>();
}
