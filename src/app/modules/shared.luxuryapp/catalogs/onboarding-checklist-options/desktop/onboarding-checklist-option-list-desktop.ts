import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { OnboardingChecklistOptionDto } from "../interfaces/onboarding-checklist-option.dto";
import { formatRoles as formatRolesUtil } from "../onboarding-checklist-option.utils";

@Component({
  selector: "app-onboarding-checklist-option-list-desktop",
  templateUrl: "./onboarding-checklist-option-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonIconEdit,
    WebButtonIconDelete,
  ],
})
export class OnboardingChecklistOptionListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<OnboardingChecklistOptionDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  protected readonly formatRoles = formatRolesUtil;
}
