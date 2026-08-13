import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CandidateStatus } from "src/app/core/enums/candidate-status";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { CandidateListItem } from "../interfaces/candidate.dto";
import { MappedPTag } from "../../recruitment-shared/mapped-p-tag";
import { CANDIDATE_STATUS_TAG_OPTIONS } from "../candidate-status-tag-options";

@Component({
  selector: "app-candidate-list-desktop",
  templateUrl: "./candidate-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    TableModule,
    WebButtonIconDelete,
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconViewPdf,
    MappedPTag,
  ],
})
export class CandidateListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<CandidateListItem[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  archive = output<string>();
  detail = output<string>();

  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  protected readonly candidateStatus = CandidateStatus;
  protected readonly candidateStatusOptions = CANDIDATE_STATUS_TAG_OPTIONS;
}
