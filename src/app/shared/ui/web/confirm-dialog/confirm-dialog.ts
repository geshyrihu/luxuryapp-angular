import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { ConfirmDialogBase } from "@ui/core/confirm-dialog.base";
import { ButtonWeb } from "@ui/buttons/web";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

export type { ConfirmType } from "@ui/core/confirm-dialog.base";

@Component({
  selector: "lux-confirm-dialog-web",
  imports: [ButtonWeb, AppIcon],
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
              <lux-icon-base [icon]="config().icon" class="text-4xl" [style.color]="config().color" />
              <p class="m-0 text-color-secondary line-height-3">{{ message() }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <lux-button-web displayMode="both" [label]="cancelLabel()" severity="secondary" variant="outline" (clicked)="onCancel()" />
            <lux-button-web displayMode="both" [label]="confirmLabel()" [severity]="config().severity" (clicked)="onConfirm()" />
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
    `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmDialog extends ConfirmDialogBase {}
