import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { CandidateStageBadge } from "../../../recruitment-shared/candidate-stage-badge";
import { CandidateApplicationListItem } from "../../candidate-applications/interfaces/candidate-application";
import { CandidateInterviewFeedbackTarget } from "../interfaces/candidate-interview-feedback-target.interface";

@Component({
  selector: "app-candidate-interview-pending-desktop",
  templateUrl: "./candidate-interview-pending-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    ButtonWeb,
    WebButtonIconViewPdf,
    CandidateStageBadge,
  ],
})
export class CandidateInterviewPendingDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<CandidateApplicationListItem[]>();
  globalFilterFields = input<string[]>([]);

  feedback = output<CandidateInterviewFeedbackTarget>();

  loading = signal(true);
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
