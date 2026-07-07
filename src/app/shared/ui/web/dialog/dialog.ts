import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { ModalBase } from "@ui/base/modal.base";

@Component({
  selector: "app-dialog",
  standalone: true,
  imports: [DialogModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="header()"
      [modal]="true"
      [closable]="closable()"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '520px' }"
      [breakpoints]="{ '640px': '96vw' }"
      (onHide)="onDismiss()"
    >
      <ng-content />
    </p-dialog>
  `,
  styles: [`
    :host { display: contents; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Dialog extends ModalBase {}
