import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { ConfirmationService } from "@ui/web/primeng-api/primeng-api";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { SendOperationReportBaseService } from "./send-operation-report-base.service";

@Component({
  selector: "app-send-operation-report-web",
  imports: [
    AppIcon,
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    TableModule,
    CustomInputTextSignal,
    LxTag,
    CustomInputCheckSignal,
    WebButtonLabel,
    WebButtonLabelConfirm,
    WebButtonLabelAdd,
    PrimeNgCustomCaption,
  ],
  templateUrl: "./send-operation-report-web.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConfirmationService],
})
export class SendOperationReportWeb {
  service = inject(SendOperationReportBaseService);
}
