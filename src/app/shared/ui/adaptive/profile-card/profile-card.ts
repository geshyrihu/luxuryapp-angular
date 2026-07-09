import { Component, inject } from "@angular/core";
import { ProfileCardBase } from "@ui/base/profile-card.base";
import { MobileProfileCard } from "@ui/mobile/profile-card/profile-card";
import { AppProfileCard } from "@ui/web/profile-card/profile-card";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de ProfileCard. Renderiza `app-profile-card` (PrimeNG)
 * o `ili-profile-card` (nativo táctil) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-profile-card [name]="..." />`.
 */
@Component({
  selector: "lx-profile-card",

  imports: [AppProfileCard, MobileProfileCard],
  template: `
    @if (platform.isMobile()) {
      <ili-profile-card
        [name]="name()"
        [role]="role()"
        [email]="email()"
        [phone]="phone()"
        [company]="company()"
        [avatarUrl]="avatarUrl()"
        [badge]="badge()"
        [online]="online()"
        [compact]="compact()"
        [actions]="actions()"
        (actionClick)="actionClick.emit($event)"
      />
    } @else {
      <app-profile-card
        [name]="name()"
        [role]="role()"
        [email]="email()"
        [phone]="phone()"
        [company]="company()"
        [avatarUrl]="avatarUrl()"
        [badge]="badge()"
        [online]="online()"
        [compact]="compact()"
        [actions]="actions()"
        (actionClick)="actionClick.emit($event)"
      />
    }
  `,
})
export class LxProfileCard extends ProfileCardBase {
  protected platform = inject(PlatformService);
}
