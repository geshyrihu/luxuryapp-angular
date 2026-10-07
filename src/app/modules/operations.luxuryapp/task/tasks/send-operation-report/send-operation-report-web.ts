import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputCheckSignal } from "@ui/inputs/web/lux-input-check-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
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
    LuxInputTextSignal,
    LxTag,
    LuxInputCheckSignal,
    LuxTableCaption,
  ],
  templateUrl: "./send-operation-report-web.html",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SendOperationReportWeb {
  service = inject(SendOperationReportBaseService);
}
