import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { DocumentCatalogDto } from "../interfaces/document-catalog.dto";

@Component({
  selector: "app-document-catalog-list-mobile",
  templateUrl: "./document-catalog-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    MobileButtonLabelDelete,
    MobileButtonLabelEdit,
    MobileListItem,
    DataViewMobile,
    AppIcon,
  ],
})
export class DocumentCatalogListMobile {
  data = input.required<DocumentCatalogDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
