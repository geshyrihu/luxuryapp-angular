import { Component, inject } from "@angular/core";
import { ConfirmPopupBase } from "@ui/base/confirm-popup.base";
import { MobileConfirmPopup } from "@ui/mobile/confirm-popup/confirm-popup";
import { ConfirmPopup } from "@ui/web/confirm-popup/confirm-popup";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-confirm-popup",

  imports: [ConfirmPopup, MobileConfirmPopup],
  template: `
    @if (platform.isMobile()) {
      <ili-confirm-popup
        [message]="message()"
        [acceptLabel]="acceptLabel()"
        [rejectLabel]="rejectLabel()"
        [type]="type()"
        (accept)="accept.emit()"
        (reject)="reject.emit()"
      />
    } @else {
      <app-confirm-popup
        [key]="key()"
        [message]="message()"
        [acceptLabel]="acceptLabel()"
        [rejectLabel]="rejectLabel()"
        (accept)="accept.emit()"
        (reject)="reject.emit()"
      />
    }
  `,
})
export class LxConfirmPopup extends ConfirmPopupBase {
  protected platform = inject(PlatformService);

  confirm(event: Event): void {}
}
