import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { ConfirmPopupBase } from "@ui/base/confirm-popup.base";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmPopupModule } from "primeng/confirmpopup";

@Component({
  selector: "app-confirm-popup",
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [ConfirmPopupModule, ButtonModule],
  template: ` <p-confirmPopup [key]="key()" /> `,
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
export class ConfirmPopup extends ConfirmPopupBase {
  private confirmationService = inject(ConfirmationService);

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => {
      this.confirmationService.close();
    });
  }

  confirm(event: Event): void {
    this.confirmationService.confirm({
      key: this.key(),
      target: event.target as EventTarget,
      message: this.message(),
      acceptLabel: this.acceptLabel(),
      rejectLabel: this.rejectLabel(),
      accept: () => this.accept.emit(),
      reject: () => this.reject.emit(),
    });
  }
}
