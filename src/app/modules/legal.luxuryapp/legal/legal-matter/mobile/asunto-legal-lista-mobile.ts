import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-asunto-legal-lista-mobile",
  templateUrl: "./asunto-legal-lista-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    NgbTooltipModule,
    WebButtonLabel,
    DataViewMobile,
  ],
})
export class AsuntoLegalListaMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
  categoryForm = output<{ id: string; title: string }>();
  categoryDelete = output<string>();
}
