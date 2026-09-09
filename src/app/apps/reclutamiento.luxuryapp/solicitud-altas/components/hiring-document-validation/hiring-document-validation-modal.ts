import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { HiringDocumentValidation } from "./hiring-document-validation";

@Component({
  selector: "app-hiring-document-validation-modal",

  imports: [HiringDocumentValidation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./hiring-document-validation-modal.html",
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class HiringDocumentValidationModal {
  private config = inject(DynamicDialogConfig);

  readonly employeeId = this.config.data?.employeeId as string;
}
