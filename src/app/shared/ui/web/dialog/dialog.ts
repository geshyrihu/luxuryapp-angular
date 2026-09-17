import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { ModalBase } from "@ui/base/modal.base";

@Component({
  selector: "app-dialog",
  template: `
    <div
      class="modal fade"
      [class.show]="visible()"
      [style.display]="visible() ? 'block' : 'none'"
      tabindex="-1"
      role="dialog"
      [attr.aria-hidden]="!visible()"
    >
      <div class="modal-dialog modal-dialog-centered" style="width: 520px; max-width: 96vw">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ header() }}</h5>
            @if (closable()) {
              <button type="button" class="btn-close" aria-label="Cerrar" (click)="onDismiss()"></button>
            }
          </div>
          <div class="modal-body"><ng-content /></div>
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
export class Dialog extends ModalBase {}
