import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { ModalBase } from "@ui/core/modal.base";
import { MobileModal } from "@ui/mobile/modal/modal";
import { Dialog } from "@ui/web/dialog/dialog";

@Component({
  selector: "lux-modal",
  imports: [NgTemplateOutlet, Dialog, MobileModal],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <lux-modal-mobile
        [(visible)]="visible"
        [header]="header()"
        [closable]="closable()"
        (dismiss)="dismiss.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-modal-mobile>
    } @else {
      <lux-dialog-web
        [(visible)]="visible"
        [header]="header()"
        [closable]="closable()"
        (dismiss)="dismiss.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-dialog-web>
    }
  `,
})
export class LuxModal extends ModalBase {
  protected platform = inject(PlatformService);
}
