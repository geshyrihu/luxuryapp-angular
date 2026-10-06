import { ButtonWeb } from "@ui/buttons/web";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-recovery-guide-modal",

  imports: [ButtonWeb, LxIcon],
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

