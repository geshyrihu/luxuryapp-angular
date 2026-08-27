import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileButtonLabelViewPdf } from "@ui/buttons/mobile-label/button-view-pdf";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CandidateStageBadge } from "../../recruitment-shared/candidate-stage-badge";
import { CandidateApplicationListItem } from "../interfaces/candidate-application";

@Component({
  selector: "app-candidate-application-list-mobile",
  templateUrl: "./candidate-application-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DataViewMobile,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    MobileButtonLabelViewPdf,
    MobileListItem,
    CustomInputSelectSignal,
    CandidateStageBadge,
  ],
})
export class CandidateApplicationListMobile {
  data = input.required<CandidateApplicationListItem[]>();
  stages = input<SelectItemDto[]>([]);
  activeStage = input<CandidateProcessStage | null>(null);
  globalFilterFields = input<string[]>([]);

  stageChange = output<CandidateProcessStage | null>();
  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  completeHiring = output<string>();
  readonly candidateProcessStage = CandidateProcessStage;

  stageControl = new FormControl<number | null>(null);
  private readonly subscription = this.stageControl.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((value) =>
      this.stageChange.emit(
        value !== null ? (value as CandidateProcessStage) : null,
      ),
    );
}
