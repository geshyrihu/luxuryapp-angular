import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonWeb } from "@ui/buttons/web";
import { AppImage } from "@ui/web/image/image";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-piscina-list-desktop",
  templateUrl: "./piscina-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    AppImage,
    RouterModule,
    LuxTableCaption,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
  ],
})
export class PiscinaListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
}
