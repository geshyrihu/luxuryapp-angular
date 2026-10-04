import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { MessageBase } from "@ui/core/message.base";
import { MobileMessage } from "@ui/mobile/message/message";
import { AppMessage } from "@ui/web/message/message";

@Component({
  selector: "lux-message",

  imports: [NgTemplateOutlet, AppMessage, MobileMessage],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-message
        [text]="text()"
        [severity]="severity()"
        [closable]="closable()"
        [icon]="icon()"
        (close)="close.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-message>
    } @else {
      <lux-message-web
        [text]="text()"
        [severity]="severity()"
        [closable]="closable()"
        [icon]="icon()"
        (close)="close.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-message-web>
    }
  `,
})
export class LxMessage extends MessageBase {
  protected platform = inject(PlatformService);
}
