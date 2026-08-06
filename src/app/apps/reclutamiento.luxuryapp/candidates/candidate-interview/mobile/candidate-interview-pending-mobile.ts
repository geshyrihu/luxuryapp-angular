import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelViewPdf } from "@ui/buttons/mobile-label/button-view-pdf";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { CandidateApplicationListItem } from "../../candidate-application/interfaces/candidate-application";
import { CandidateStageBadge } from "../../recruitment-shared/candidate-stage-badge";

@Component({
  selector: "app-candidate-interview-pending-mobile",
  standalone: true,
  templateUrl: "./candidate-interview-pending-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataViewMobile,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelViewPdf,
    MobileListItem,
    CandidateStageBadge,
  ],
})
export class CandidateInterviewPendingMobile {
  data = input.required<CandidateApplicationListItem[]>();
  globalFilterFields = input<string[]>([]);

  feedback = output<string>();
}
