import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ModalBase } from "@ui/base/modal.base";
import { MobileModal } from "@ui/mobile/modal/modal";
import { Dialog } from "@ui/web/dialog/dialog";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-modal",

  imports: [Dialog, MobileModal],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ili-modal
        [(visible)]="visible"
        [header]="header()"
        [closable]="closable()"
        (dismiss)="dismiss.emit()"
      >
        <ng-content />
      </ili-modal>
    } @else {
      <app-dialog
        [(visible)]="visible"
        [header]="header()"
        [closable]="closable()"
        (dismiss)="dismiss.emit()"
      >
        <ng-content />
      </app-dialog>
    }
  `,
})
export class LxModal extends ModalBase {
  protected platform = inject(PlatformService);
}
