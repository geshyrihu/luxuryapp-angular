import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppContactCard } from "src/app/core/components/web/contact-card/contact-card";
import { MobileContactCard } from "src/app/core/components/mobile/contact-card/contact-card";
import { ContactCardBase } from "./contact-card-base";

/**
 * Wrapper multiplataforma de ContactCard. Renderiza `app-contact-card` (PrimeNG)
 * o `ili-contact-card` (nativo táctil) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-contact-card [name]="..." />`.
 */
@Component({
  selector: "lx-contact-card",
  standalone: true,
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
