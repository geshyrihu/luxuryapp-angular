import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { SendOperationReportBaseService } from "./send-operation-report-base.service";
import { SendOperationReportWeb } from "./send-operation-report-web";
import { SendOperationReportMobile } from "./send-operation-report-mobile";

@Component({
  selector: "app-send-operation-report",
  imports: [SendOperationReportWeb, SendOperationReportMobile],
  template: `
    @if (platform.isMobile()) {
      <app-send-operation-report-mobile />
    } @else {
      <app-send-operation-report-web />
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [SendOperationReportBaseService],
})
export class SendOperationReport {
  protected platform = inject(PlatformService);
  private config = inject(DynamicDialogConfig);
  private service = inject(SendOperationReportBaseService);

  constructor() {
    this.service.initialize(this.config.data.year, this.config.data.numeroSemana);
  }
}
