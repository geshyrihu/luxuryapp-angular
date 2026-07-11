import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ModalBase } from "@ui/base/modal.base";
import { MobileModal } from "@ui/mobile/modal/modal";
import { Dialog } from "@ui/web/dialog/dialog";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-modal",

  imports: [NgTemplateOutlet, Dialog, MobileModal],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-modal
        [(visible)]="visible"
        [header]="header()"
        [closable]="closable()"
        (dismiss)="dismiss.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-modal>
    } @else {
      <app-dialog
        [(visible)]="visible"
        [header]="header()"
        [closable]="closable()"
        (dismiss)="dismiss.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-dialog>
    }
  `,
})
export class LxModal extends ModalBase {
  protected platform = inject(PlatformService);
}
