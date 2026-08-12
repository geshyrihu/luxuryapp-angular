import { Directive, input, output } from "@angular/core";
import { avatarBackground } from "./avatar-palette";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

export interface ProfileAction {
  icon: AppIconName;
  label: string;
  action: string;
  severity?: "primary" | "secondary" | "success" | "danger" | "warn";
}

const DEFAULT_ACTIONS: ProfileAction[] = [
  { icon: "material-symbols-light:call-outline", label: "Llamar", action: "call", severity: "secondary" },
  { icon: "material-symbols-light:mail-outline", label: "Email", action: "email", severity: "secondary" },
  { icon: "material-symbols-light:event-note", label: "Reunión", action: "meeting", severity: "secondary" },
];

/**
 * Base compartida de ProfileCard (API + avatar).
 *  - web:     `app-profile-card` (p-tag + p-button + lxTooltip)
 *  - mobile:  `ili-profile-card` (badge span, acciones táctiles sin tooltip)
 *  - wrapper: `lx-profile-card`  (auto runtime)
 */
@Directive()
export abstract class ProfileCardBase {
  name = input.required<string>();
  role = input<string>("");
  email = input<string>("");
  phone = input<string>("");
  company = input<string>("");
  avatarUrl = input<string>("");
  badge = input<string>("");
  online = input<boolean | undefined>(undefined);
  compact = input<boolean>(false);
  actions = input<ProfileAction[]>(DEFAULT_ACTIONS);

  actionClick = output<string>();

  avatarBg(): string {
    return avatarBackground(this.name());
  }

  initials(): string {
    return this.name()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
}
