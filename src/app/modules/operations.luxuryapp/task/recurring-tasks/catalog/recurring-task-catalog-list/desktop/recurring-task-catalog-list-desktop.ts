import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { RecurringTaskTemplateCatalog } from "@core/interfaces/recurring-tasks/recurring-task-template-catalog.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-recurring-task-catalog-list-desktop",
  templateUrl: "./recurring-task-catalog-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    LuxTableCaption,
    AppTable],
})
export class RecurringTaskCatalogListDesktop {
  data = input.required<RecurringTaskTemplateCatalog[]>();
  loading = input<boolean>(false);
  activeOnly = input<boolean>(true);

  add = output<void>();
  edit = output<RecurringTaskTemplateCatalog>();
  toggleStatus = output<string>();
  changeState = output<boolean>();

  private tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  isActive(template: RecurringTaskTemplateCatalog): boolean {
    const status = String(template.status).toLowerCase();
    return status === "active" || status === "activo" || status === "true";
  }
}
