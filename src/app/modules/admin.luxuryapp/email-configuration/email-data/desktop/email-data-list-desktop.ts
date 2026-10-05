import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { EmailDataFormDto } from "@core/interfaces/email-data-form.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconSendEmail } from "@ui/buttons/web-icon/button-send-email";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-email-data-list-desktop",
  templateUrl: "./email-data-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonIconEdit,
    WebButtonIconSendEmail,
    LuxTableCaption,
    TableFooter,
  ],
})
export class EmailDataListDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<EmailDataFormDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  sendTestEmail = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
