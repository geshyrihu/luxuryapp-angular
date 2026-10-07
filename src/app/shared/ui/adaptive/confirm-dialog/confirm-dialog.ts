import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmDialogBase } from "@ui/core/confirm-dialog.base";
import { MobileConfirmDialog } from "@ui/mobile/confirm-dialog/confirm-dialog";
import { ConfirmDialog } from "@ui/web/confirm-dialog/confirm-dialog";

/**
 * Wrapper multiplataforma de ConfirmDialog. Renderiza `app-confirm-dialog`
 * (Bootstrap) o `lux-confirm-dialog-mobile` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-confirm-dialog [(visible)]="..." />`.
 */
@Component({
  selector: "lux-confirm-dialog",

  imports: [ConfirmDialog, MobileConfirmDialog],
  template: `
    @if (platform.isMobile()) {
      <lux-confirm-dialog-mobile
        [(visible)]="visible"
        [title]="title()"
        [message]="message()"
        [type]="type()"
        [confirmLabel]="confirmLabel()"
        [cancelLabel]="cancelLabel()"
        (confirm)="confirm.emit()"
        (cancel)="cancel.emit()"
      />
    } @else {
      <lux-confirm-dialog-web
        [(visible)]="visible"
        [title]="title()"
        [message]="message()"
        [type]="type()"
        [confirmLabel]="confirmLabel()"
        [cancelLabel]="cancelLabel()"
        (confirm)="confirm.emit()"
        (cancel)="cancel.emit()"
      />
    }
  `,
})
export class LxConfirmDialog extends ConfirmDialogBase {
  protected platform = inject(PlatformService);
}
