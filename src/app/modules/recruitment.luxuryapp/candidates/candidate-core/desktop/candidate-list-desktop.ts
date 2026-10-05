import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { CandidateInterviewProgressStatus } from "@core/enums/candidate-interview-progress-status";
import { CandidateStatus } from "@core/enums/candidate-status";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { MappedPTag } from "../../../recruitment-shared/mapped-p-tag";
import { CANDIDATE_INTERVIEW_PROGRESS_TAG_OPTIONS } from "../candidate-interview-progress-tag-options";
import { CANDIDATE_STATUS_TAG_OPTIONS } from "../candidate-status-tag-options";
import { CandidateListItem } from "../interfaces/candidate.dto";

@Component({
  selector: "app-candidate-list-desktop",
  templateUrl: "./candidate-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    WebButtonIconDelete,
    ButtonWeb,
    WebButtonIconItem,
    WebButtonIconViewPdf,
    MappedPTag,
  ],
})
export class CandidateListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);
  aspRoleS = inject(AspRoleService);

  data = input.required<CandidateListItem[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  archive = output<string>();
  delete = output<string>();
  detail = output<string>();
  viewInterview = output<string>();

  readonly isSuperUser = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);

  loading = signal(true);
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  protected readonly candidateStatus = CandidateStatus;
  protected readonly candidateStatusOptions = CANDIDATE_STATUS_TAG_OPTIONS;

  protected readonly interviewProgress = CandidateInterviewProgressStatus;
  protected readonly interviewProgressOptions =
    CANDIDATE_INTERVIEW_PROGRESS_TAG_OPTIONS;
  readonly interviewProgressFilter =
    signal<CandidateInterviewProgressStatus | null>(null);

  readonly filteredData = computed(() => {
    const filter = this.interviewProgressFilter();
    const data = this.data();
    return filter === null
      ? data
      : data.filter((item) => item.interviewProgress === filter);
  });
}
