import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { SendOperationReportBaseService } from "./send-operation-report-base.service";

@Component({
  selector: "app-send-operation-report-web",
  imports: [
    AppIcon,
    TableEmptyMessage,
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
    LuxTableCaption,
  ],
  templateUrl: "./send-operation-report-web.html",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SendOperationReportWeb {
  service = inject(SendOperationReportBaseService);
}
