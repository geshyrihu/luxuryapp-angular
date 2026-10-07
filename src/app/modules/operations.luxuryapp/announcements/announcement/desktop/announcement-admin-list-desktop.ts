import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";

import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { IAnnouncementAdminList } from "../announcement.model";

@Component({
  selector: "app-announcement-admin-list-desktop",
  templateUrl: "./announcement-admin-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    LxTag,
    LuxTableCaption,
    TableFooter,
    LuxInputSelectSignal,
  ],
})
export class AnnouncementAdminListDesktop {
  data = input.required<IAnnouncementAdminList[]>();
  globalFilterFields = input<string[]>([]);
  statusControl = input.required<FormControl<string>>();
  typeControl = input.required<FormControl<string>>();
  statusOptions = input.required<SelectItemDto[]>();
  typeOptions = input.required<SelectItemDto[]>();

  add = output<{ id: string; title: string }>();
  edit = output<IAnnouncementAdminList>();
  delete = output<string>();
  downloadPdf = output<string>();
  viewPreview = output<string>();
  viewAnalytics = output<string>();
  filterChange = output<void>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
