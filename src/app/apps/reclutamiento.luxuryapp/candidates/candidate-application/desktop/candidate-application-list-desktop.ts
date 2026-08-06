import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconTracking } from "@ui/buttons/web-icon/button-tracking";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CandidateApplicationListItem } from "../interfaces/candidate-application";
import { CandidateStageBadge } from "../../recruitment-shared/candidate-stage-badge";

@Component({
  selector: "app-candidate-application-list-desktop",
  standalone: true,
  templateUrl: "./candidate-application-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputSelectSignal,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    TableModule,
    WebButtonIconEdit,
    WebButtonIconTracking,
    WebButtonIconViewPdf,
    CandidateStageBadge,
  ],
})
export class CandidateApplicationListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<CandidateApplicationListItem[]>();
  stages = input<SelectItemDto[]>([]);
  activeStage = input<CandidateApplicationStage | null>(null);
  globalFilterFields = input<string[]>([]);

  stageChange = output<CandidateApplicationStage | null>();
  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  advance = output<{
    id: string;
    fromStage: CandidateApplicationStage;
    customerId: string;
  }>();

  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  onStageSelected(value: number | null) {
    this.stageChange.emit(
      value !== null ? (value as CandidateApplicationStage) : null,
    );
  }

  stageControl = new FormControl<number | null>(null);
  private readonly subscription = this.stageControl.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((value) => this.onStageSelected(value));
}
