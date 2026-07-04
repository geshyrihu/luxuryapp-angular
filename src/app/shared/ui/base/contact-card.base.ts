import { Directive, input, output } from "@angular/core";

export type ContactStatus = "active" | "inactive" | "prospect" | "vip";

export type ContactSeverity = "success" | "info" | "secondary" | "warn";

/**
 * Base compartida de ContactCard (API + estatus + avatar).
 *  - web:     `app-contact-card` (p-tag + pTooltip)
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
    const colors = ["#003d9b", "#006477", "#006837", "#b45309", "#7c3aed", "#ba1a1a"];
    let h = 0;
    for (const c of this.name()) h = c.charCodeAt(0) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
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
