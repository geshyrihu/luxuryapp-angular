import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppSortableColumn, AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { SendOperationReportBaseService } from "./send-operation-report-base.service";

@Component({
  selector: "app-send-operation-report-web",
  imports: [
    ButtonWeb,
    LxIcon,
    TableEmptyMessage,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    CustomInputTextSignal,
    LxTag,
    CustomInputCheckSignal,
    LuxTableCaption],
  templateUrl: "./send-operation-report-web.html",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SendOperationReportWeb {
  service = inject(SendOperationReportBaseService);
}
