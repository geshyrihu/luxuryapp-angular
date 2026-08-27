import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-recovery-guide-modal",

  imports: [AppIcon, WebButtonLabel],
  templateUrl: "./recovery-guide-modal.html",
  styleUrl: "./recovery-guide-modal.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryGuideModal {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly employeeName = signal<string>(this.config.data?.employeeName || "");

  close(): void {
    this.ref.close();
  }
}
