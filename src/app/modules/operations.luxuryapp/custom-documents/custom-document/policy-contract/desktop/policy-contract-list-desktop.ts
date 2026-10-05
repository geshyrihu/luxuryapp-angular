import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-policy-contract-list-desktop",
  templateUrl: "./policy-contract-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    WebButtonIconActiveDesactive,
    WebButtonIconViewPdf,
    WebButtonIconDelete,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,
    LuxTableCaption,
  ],
})
export class PolicyContractListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isCurrent = input<boolean>(true);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  deleteDocument = output<any>();
  selectActive = output<boolean>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  getTagSeverity(tagLabel: string | null): "success" | "warn" | "danger" {
    if (tagLabel === "Vigente") return "success";
    if (tagLabel === "Próximo a vencer") return "warn";
    if (tagLabel === "Vencido") return "danger";
  }
}
