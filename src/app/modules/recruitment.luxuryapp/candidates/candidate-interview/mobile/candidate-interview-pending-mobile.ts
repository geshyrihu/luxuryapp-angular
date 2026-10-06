import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { CandidateApplicationListItem } from "../../candidate-applications/interfaces/candidate-application";
import { CandidateStageBadge } from "../../../recruitment-shared/candidate-stage-badge";
import { CandidateInterviewFeedbackTarget } from "../interfaces/candidate-interview-feedback-target.interface";

import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
@Component({
  selector: "app-candidate-interview-pending-mobile",
  templateUrl: "./candidate-interview-pending-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PdfViewerTrigger,
    DataViewMobile,
    MobileActionMenu,
    ButtonMobile,
    MobileListItem,
    CandidateStageBadge,
  ],
})
export class CandidateInterviewPendingMobile {
  data = input.required<CandidateApplicationListItem[]>();
  globalFilterFields = input<string[]>([]);

  feedback = output<CandidateInterviewFeedbackTarget>();
}

