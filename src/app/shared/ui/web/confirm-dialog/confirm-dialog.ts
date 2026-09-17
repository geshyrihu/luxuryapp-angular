import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { ConfirmDialogBase } from "@ui/base/confirm-dialog.base";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

export type { ConfirmType } from "@ui/base/confirm-dialog.base";

@Component({
  selector: "app-confirm-dialog",
  imports: [WebButtonLabel, AppIcon],
  template: `
    <div
      class="modal fade"
      [class.show]="visible()"
      [style.display]="visible() ? 'block' : 'none'"
      tabindex="-1"
      role="dialog"
      [attr.aria-hidden]="!visible()"
    >
      <div class="modal-dialog modal-dialog-centered" style="width: 420px; max-width: 90vw">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">{{ title() }}</h5></div>
          <div class="modal-body">
            <div class="d-flex flex-column align-items-center text-center gap-3 py-3">
              <app-icon [icon]="config().icon" class="text-4xl" [style.color]="config().color" />
              <p class="m-0 text-color-secondary line-height-3">{{ message() }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <il-button [label]="cancelLabel()" severity="secondary" variant="outline" (clicked)="onCancel()" />
            <il-button [label]="confirmLabel()" [severity]="config().severity" (clicked)="onConfirm()" />
          </div>
        </div>
      </div>
    </div>
    @if (visible()) {
      <div class="modal-backdrop fade show"></div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmDialog extends ConfirmDialogBase {}
