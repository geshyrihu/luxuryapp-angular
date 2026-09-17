import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { SendOperationReportBaseService } from "./send-operation-report-base.service";

@Component({
  selector: "app-send-operation-report-web",
  imports: [
    AppIcon,
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
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
})
export class SendOperationReportWeb {
  service = inject(SendOperationReportBaseService);
}
