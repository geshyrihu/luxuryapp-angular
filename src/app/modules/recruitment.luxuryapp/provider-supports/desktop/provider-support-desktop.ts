import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { ProviderSupportList } from "@core/interfaces/provider-support-list.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-provider-support-desktop",
  templateUrl: "./provider-support-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    WebButtonIconDelete,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppAvatar,
    LuxTableCaption,
  ],
})
export class ProviderSupportDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<ProviderSupportList[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();

  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
