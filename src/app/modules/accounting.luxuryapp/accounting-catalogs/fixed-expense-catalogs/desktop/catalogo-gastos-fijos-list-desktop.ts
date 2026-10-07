import { UpperCasePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { LxCheckbox } from "@ui/adaptive/checkbox/checkbox";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-catalogo-gastos-fijos-list-desktop",
  templateUrl: "./catalogo-gastos-fijos-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    UpperCasePipe,
    FormsModule,
    RouterModule,
    LuxInputSelectSignal,
    LxTooltipDirective,
    LxMessage,
    LxCheckbox,
    LxIcon,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon,
  ],
})
export class CatalogoGastosFijosListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  fundingYear = input<number>(new Date().getFullYear());
  cbFundingYear = input<SelectItemDto[]>([]);
  fundingPeriodsByMonth = input<any[]>([]);
  selectedMonthName = input<string | null>(null);
  selectedFundingStatus = input<any | null>(null);
  isFirstQuincenaSelected = input<boolean>(false);
  isSecondQuincenaSelected = input<boolean>(false);
  isGenerationParamsSelected = input<boolean>(false);
  isFirstQuincenaGenerationBlocked = input<boolean>(false);
  isSecondQuincenaGenerationBlocked = input<boolean>(false);
  isAllSelected = input<boolean>(false);

  yearChange = output<number>();
  selectByQuincena = output<number>();
  generateQuincena = output<number>();
  selectMonth = output<string>();
  toggleSelectAll = output<boolean>();
  itemCheckChange = output<{ item: any; checked: boolean }>();
  delete = output<any>();
  modal = output<{ id: string; title: string }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
