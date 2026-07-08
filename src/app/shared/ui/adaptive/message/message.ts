import { Component, inject } from "@angular/core";
import { MessageBase } from "@ui/base/message.base";
import { MobileMessage } from "@ui/mobile/message/message";
import { AppMessage } from "@ui/web/message/message";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-message",
  standalone: true,
  imports: [AppMessage, MobileMessage],
  template: `
    @if (platform.isMobile()) {
      <ili-message
        [text]="text()"
        [severity]="severity()"
        [closable]="closable()"
        [icon]="icon()"
        (close)="close.emit()"
      >
        <ng-content />
      </ili-message>
    } @else {
      <app-message
        [text]="text()"
        [severity]="severity()"
        [closable]="closable()"
        [icon]="icon()"
        (close)="close.emit()"
      >
        <ng-content />
      </app-message>
    }
  `,
})
export class LxMessage extends MessageBase {
  protected platform = inject(PlatformService);
}
