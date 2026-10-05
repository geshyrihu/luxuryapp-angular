import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-maintenance-reports-desktop",
  templateUrl: "./maintenance-reports-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, AppIcon, AppTable, LuxTableCaption, TableEmptyMessage],
})
export class MaintenanceReportsDesktop {
  data = input.required<any[]>();

  readonly scrollHeight = inject(TableScrollHeightService).scrollHeight;
}
