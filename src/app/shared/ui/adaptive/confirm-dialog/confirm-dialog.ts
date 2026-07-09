import { Component, inject } from "@angular/core";
import { ConfirmDialogBase } from "@ui/base/confirm-dialog.base";
import { MobileConfirmDialog } from "@ui/mobile/confirm-dialog/confirm-dialog";
import { ConfirmDialog } from "@ui/web/confirm-dialog/confirm-dialog";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de ConfirmDialog. Renderiza `app-confirm-dialog`
 * (PrimeNG) o `ili-confirm-dialog` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-confirm-dialog [(visible)]="..." />`.
 */
@Component({
  selector: "lx-confirm-dialog",

  imports: [ConfirmDialog, MobileConfirmDialog],
  template: `
    @if (platform.isMobile()) {
      <ili-confirm-dialog
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
      <app-confirm-dialog
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
