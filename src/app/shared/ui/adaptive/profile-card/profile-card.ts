import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppProfileCard } from "@ui/web/profile-card/profile-card";
import { MobileProfileCard } from "@ui/mobile/profile-card/profile-card";
import { ProfileCardBase } from "@ui/base/profile-card.base";

/**
 * Wrapper multiplataforma de ProfileCard. Renderiza `app-profile-card` (PrimeNG)
 * o `ili-profile-card` (nativo táctil) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-profile-card [name]="..." />`.
 */
@Component({
  selector: "lx-profile-card",
  standalone: true,
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
