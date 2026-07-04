import { Component, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { ConfirmDialogBase } from "@ui/base/confirm-dialog.base";

export type { ConfirmType } from "@ui/base/confirm-dialog.base";

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, AppIcon],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="title()"
      [modal]="true"
      [closable]="false"
      [draggable]="false"
      [style]="{ width: '420px' }"
      [breakpoints]="{ '480px': '90vw' }"
    >
      <div class="flex flex-column align-items-center text-center gap-3 py-3">
        <app-icon [icon]="config.icon" class="text-4xl" [style.color]="config.color" />
        <p class="m-0 text-color-secondary line-height-3">{{ message() }}</p>
      </div>
      <ng-template #footer>
        <div class="flex gap-2 justify-content-end">
          <p-button
            [label]="cancelLabel()"
            severity="secondary"
            [outlined]="true"
            (onClick)="onCancel()"
          />
          <p-button
            [label]="confirmLabel()"
            [severity]="config.severity"
            (onClick)="onConfirm()"
          />
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host { display: contents; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmDialog extends ConfirmDialogBase {}
