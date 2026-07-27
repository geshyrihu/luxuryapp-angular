import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ModalBase } from "@ui/base/modal.base";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "app-dialog",

  imports: [DialogModule],
  template: `
    <p-dialog
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
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
export class Dialog extends ModalBase {}
