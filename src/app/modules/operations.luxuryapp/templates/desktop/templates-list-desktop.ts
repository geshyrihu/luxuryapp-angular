import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-templates-list-desktop",
  templateUrl: "./templates-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    NgbDropdownModule,
    NgbTooltipModule,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonIconViewPdf,
  ],
})
export class TemplatesListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isSuperUsuario = input<boolean>(false);
  scrollHeight = input<string>("0px");

  add = output<{ id: string; title: string }>();
  edit = output<{ id: any; title: string }>();
  delete = output<any>();
}
