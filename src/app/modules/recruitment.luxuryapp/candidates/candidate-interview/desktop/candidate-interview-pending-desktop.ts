import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { CandidateApplicationListItem } from "../../candidate-applications/interfaces/candidate-application";
import { CandidateStageBadge } from "../../../recruitment-shared/candidate-stage-badge";
import { CandidateInterviewFeedbackTarget } from "../interfaces/candidate-interview-feedback-target.interface";

@Component({
  selector: "app-candidate-interview-pending-desktop",
  templateUrl: "./candidate-interview-pending-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonIconEdit,
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


