import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-asunto-legal-lista-desktop",
  templateUrl: "./asunto-legal-lista-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    TableEmptyMessage,
    AppTable,
    NgbTooltipModule,
    WebButtonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    ActionMenu,
    LuxTableCaption,
  ],
})
export class AsuntoLegalListaDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
  categoryForm = output<{ id: string; title: string }>();
  categoryDelete = output<string>();
}
