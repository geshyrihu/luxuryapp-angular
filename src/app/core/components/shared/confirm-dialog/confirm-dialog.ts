import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { ConfirmDialog } from "src/app/core/components/web/confirm-dialog/confirm-dialog";
import { MobileConfirmDialog } from "src/app/core/components/mobile/confirm-dialog/confirm-dialog";
import { ConfirmDialogBase } from "./confirm-dialog-base";

/**
 * Wrapper multiplataforma de ConfirmDialog. Renderiza `app-confirm-dialog`
 * (PrimeNG) o `ili-confirm-dialog` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-confirm-dialog [(visible)]="..." />`.
 */
@Component({
  selector: "lx-confirm-dialog",
  standalone: true,
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
