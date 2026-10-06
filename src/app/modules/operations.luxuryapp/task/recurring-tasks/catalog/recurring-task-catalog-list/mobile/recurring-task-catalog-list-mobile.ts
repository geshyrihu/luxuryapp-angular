import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { RecurringTaskTemplateCatalog } from "@core/interfaces/recurring-tasks/recurring-task-template-catalog.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-recurring-task-catalog-list-mobile",
  templateUrl: "./recurring-task-catalog-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class RecurringTaskCatalogListMobile {
  data = input.required<RecurringTaskTemplateCatalog[]>();
  activeOnly = input<boolean>(true);

  add = output<void>();
  edit = output<RecurringTaskTemplateCatalog>();
  toggleStatus = output<string>();
  changeState = output<boolean>();

  isActive(template: RecurringTaskTemplateCatalog): boolean {
    const status = String(template.status).toLowerCase();
    return status === "active" || status === "activo" || status === "true";
  }
}
