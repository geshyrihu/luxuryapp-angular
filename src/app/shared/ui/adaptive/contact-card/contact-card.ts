import { Component, inject } from "@angular/core";
import { ContactCardBase } from "@ui/base/contact-card.base";
import { MobileContactCard } from "@ui/mobile/contact-card/contact-card";
import { AppContactCard } from "@ui/web/contact-card/contact-card";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de ContactCard. Renderiza `app-contact-card` (PrimeNG)
 * o `ili-contact-card` (nativo táctil) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-contact-card [name]="..." />`.
 */
@Component({
  selector: "lx-contact-card",

  imports: [AppContactCard, MobileContactCard],
  template: `
    @if (platform.isMobile()) {
      <ili-contact-card
        [name]="name()"
        [role]="role()"
        [company]="company()"
        [email]="email()"
        [phone]="phone()"
        [avatarUrl]="avatarUrl()"
        [status]="status()"
        [selected]="selected()"
        (cardClick)="cardClick.emit()"
        (meetingClick)="meetingClick.emit()"
      />
    } @else {
      <app-contact-card
        [name]="name()"
        [role]="role()"
        [company]="company()"
        [email]="email()"
        [phone]="phone()"
        [avatarUrl]="avatarUrl()"
        [status]="status()"
        [selected]="selected()"
        (cardClick)="cardClick.emit()"
        (meetingClick)="meetingClick.emit()"
      />
    }
  `,
})
export class LxContactCard extends ContactCardBase {
  protected platform = inject(PlatformService);
}
