import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { TerminalBase } from "@ui/base/terminal.base";
import { TerminalModule } from "primeng/terminal";

@Component({
  selector: "app-terminal",

  imports: [TerminalModule],
  template: `
    <p-terminal [welcomeMessage]="welcomeMessage()" [prompt]="prompt()" />
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppTerminal extends TerminalBase {}
