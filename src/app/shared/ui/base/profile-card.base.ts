import { Directive, input, output } from "@angular/core";
import { avatarBackground } from "./avatar-palette";

export interface ProfileAction {
  icon: string;
  label: string;
  action: string;
  severity?: "primary" | "secondary" | "success" | "danger" | "warn";
}

const DEFAULT_ACTIONS: ProfileAction[] = [
  { icon: "mdi:phone-outline", label: "Llamar", action: "call", severity: "secondary" },
  { icon: "mdi:email-outline", label: "Email", action: "email", severity: "secondary" },
  { icon: "mdi:calendar-plus-outline", label: "Reunión", action: "meeting", severity: "secondary" },
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
