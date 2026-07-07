import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { Dialog } from "@ui/web/dialog/dialog";
import { MobileModal } from "@ui/mobile/modal/modal";
import { ModalBase } from "@ui/base/modal.base";

@Component({
  selector: "lx-modal",
  standalone: true,
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
