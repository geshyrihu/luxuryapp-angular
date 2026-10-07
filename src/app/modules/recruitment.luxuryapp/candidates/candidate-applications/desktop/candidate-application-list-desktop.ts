import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CandidateProcessStage } from "@core/enums/candidate-process-stage";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { CandidateStageBadge } from "../../../recruitment-shared/candidate-stage-badge";
import { CandidateApplicationListItem } from "../interfaces/candidate-application";

import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
@Component({
  selector: "app-candidate-application-list-desktop",
  templateUrl: "./candidate-application-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PdfViewerTrigger,
    CommonModule,
    ReactiveFormsModule,
    LuxInputSelectSignal,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    ButtonWeb,
    CandidateStageBadge,
  ],
})
export class CandidateApplicationListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<CandidateApplicationListItem[]>();
  stages = input<SelectItemDto[]>([]);
  activeStage = input<CandidateProcessStage | null>(null);
  globalFilterFields = input<string[]>([]);

  stageChange = output<CandidateProcessStage | null>();
  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  completeHiring = output<string>();

  loading = signal(true);
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly candidateProcessStage = CandidateProcessStage;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  onStageSelected(value: number | null) {
    this.stageChange.emit(
      value !== null ? (value as CandidateProcessStage) : null,
    );
  }

  stageControl = new FormControl<number | null>(null);
  private readonly subscription = this.stageControl.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((value) => this.onStageSelected(value));
}
