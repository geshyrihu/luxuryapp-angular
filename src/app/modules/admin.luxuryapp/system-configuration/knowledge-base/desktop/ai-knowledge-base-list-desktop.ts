import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { ButtonWeb } from "@ui/buttons/web";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { AppTag } from "@ui/web/tag/tag";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { AiKnowledgeBaseDto } from "@core/interfaces/ai-knowledge-base.dto";

@Component({
  selector: "app-ai-knowledge-base-list-desktop",
  templateUrl: "./ai-knowledge-base-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    AppTag,
    AppIcon,
    WebButtonIconDelete,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
  ],
})
export class AiKnowledgeBaseListDesktop {
  data = input.required<AiKnowledgeBaseDto[]>();
  globalFilterFields = input<string[]>([]);
  loading = input<boolean>(false);

  add = output<any>();
  edit = output<any>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
