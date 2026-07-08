import { Component, inject } from "@angular/core";
import { TerminalBase } from "@ui/base/terminal.base";
import { MobileTerminal } from "@ui/mobile/terminal/terminal";
import { AppTerminal } from "@ui/web/terminal/terminal";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-terminal",

  imports: [AppTerminal, MobileTerminal],
  template: `
    @if (platform.isMobile()) {
      <ili-terminal [welcomeMessage]="welcomeMessage()" [prompt]="prompt()">
        <ng-content />
      </ili-terminal>
    } @else {
      <app-terminal [welcomeMessage]="welcomeMessage()" [prompt]="prompt()" />
    }
  `,
})
export class LxTerminal extends TerminalBase {
  protected platform = inject(PlatformService);
}
