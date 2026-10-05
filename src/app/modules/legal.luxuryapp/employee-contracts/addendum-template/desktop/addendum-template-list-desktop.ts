import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { AddendumTemplateListDTO } from "../interfaces/addendum-template.dto";

@Component({
  selector: "app-addendum-template-list-desktop",
  templateUrl: "./addendum-template-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconItem,
    ButtonWeb,
    WebButtonIconDelete,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    LuxTableCaption,
    TableFooter,
  ],
})
export class AddendumTemplateListDesktop {
  private tableScrollH = inject(TableScrollHeightService);

  data = input.required<AddendumTemplateListDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<AddendumTemplateListDTO>();
  toggleActive = output<AddendumTemplateListDTO>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollH.scrollHeight;
}
