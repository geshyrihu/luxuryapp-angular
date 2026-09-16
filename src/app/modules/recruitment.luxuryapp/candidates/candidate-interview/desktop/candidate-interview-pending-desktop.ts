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
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { CandidateApplicationListItem } from "../../candidate-applications/interfaces/candidate-application";
import { CandidateStageBadge } from "../../../recruitment-shared/candidate-stage-badge";
import { CandidateInterviewFeedbackTarget } from "../interfaces/candidate-interview-feedback-target.interface";

@Component({
  selector: "app-candidate-interview-pending-desktop",
  templateUrl: "./candidate-interview-pending-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
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
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}


