import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { PurchaseHistoryDTO } from "../presupuestos.interfaces";

@Component({
  selector: "app-purchase-history-desktop",
  templateUrl: "./purchase-history-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LxIcon,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter],
})
export class PurchaseHistoryDesktop {
  data = input.required<PurchaseHistoryDTO[]>();
  globalFilterFields = input<string[]>([]);

  showDetails = output<string>();
  viewPdf = output<{ url: string; fileName: string }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  sumaTotal = computed(() =>
    this.data().reduce((acc, item) => acc + (item.amount || 0), 0),
  );
}
