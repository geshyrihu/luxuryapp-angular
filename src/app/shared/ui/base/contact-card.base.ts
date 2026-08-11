import { Directive, input, output } from "@angular/core";
import { avatarBackground } from "./avatar-palette";

export type ContactStatus = "active" | "inactive" | "prospect" | "vip";

export type ContactSeverity = "success" | "info" | "secondary" | "warn";

/**
 * Base compartida de ContactCard (API + estatus + avatar).
 *  - web:     `app-contact-card` (p-tag + lxTooltip)
 *  - mobile:  `ili-contact-card` (badge span, sin tooltip, acciones táctiles)
 *  - wrapper: `lx-contact-card`  (auto runtime)
 */
@Directive()
export abstract class ContactCardBase {
  name = input.required<string>();
  role = input<string>("");
  company = input<string>("");
  email = input<string>("");
  phone = input<string>("");
  avatarUrl = input<string>("");
  status = input<ContactStatus | undefined>(undefined);
  selected = input<boolean>(false);

  cardClick = output<void>();
  meetingClick = output<void>();

  protected readonly statusMap: Record<
    ContactStatus,
    { label: string; severity: ContactSeverity }
  > = {
    active: { label: "Activo", severity: "success" },
    inactive: { label: "Inactivo", severity: "secondary" },
    prospect: { label: "Prospecto", severity: "info" },
    vip: { label: "VIP", severity: "warn" },
  };

  statusLabel(): string {
    return this.status() ? this.statusMap[this.status()!].label : "";
  }

  statusSeverity(): ContactSeverity {
    return this.status() ? this.statusMap[this.status()!].severity : "info";
  }

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
