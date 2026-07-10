import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";

import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { DialogSize } from "src/app/core/enums/dialog-size";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  HeroMetric,
  ProposedRole,
  TagSeverity,
} from "../../models/cobranza-nativa.model";
import BillingConfigModal from "../billing-config/billing-config-modal";
import { COBRANZA_GROUPS } from "./cobranza-nativa-groups.const";

@Component({
  selector: "app-cobranza-nativa-dashboard",
  imports: [
    WebButtonLabel,
    AppIcon,
    ButtonModule,
    LxTag,
    LxCard,
    MobileListItem,
  ],
  templateUrl: "./cobranza-nativa-dashboard.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./cobranza-nativa-dashboard.scss"],
})
export default class CobranzaNativaDashboard {
  private router = inject(Router);
  private dialogHandlerS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);

  groups = COBRANZA_GROUPS;
  expandedCard = signal<string | null>(null);

  readonly heroMetrics: HeroMetric[] = [
    {
      label: "Modulos funcionales",
      value: String(COBRANZA_GROUPS.reduce((a, g) => a + g.cards.length, 0)),
      detail: "Paginas y funciones activas",
      icon: "mdi:grid",
      tone: "primary",
    },
    {
      label: "Grupos de trabajo",
      value: String(COBRANZA_GROUPS.length),
      detail: "Areas funcionales del modulo",
      icon: "mdi:sitemap",
      tone: "info",
    },
    {
      label: "Endpoints documentados",
      value: String(
        COBRANZA_GROUPS.reduce(
          (a, g) => a + g.cards.reduce((b, c) => b + c.endpoints.length, 0),
          0,
        ),
      ),
      detail: "Rutas del API por funcionalidad",
      icon: "mdi:server",
      tone: "success",
    },
  ];

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }

  async openBillingConfig() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    await this.dialogHandlerS.openDialog(
      BillingConfigModal,
      { customerId },
      "Configuracion de Facturacion y Notificaciones",
      DialogSize.md,
    );
  }

  toggleExpand(cardTitle: string) {
    this.expandedCard.update((value) =>
      value === cardTitle ? null : cardTitle,
    );
  }

  isExpanded(cardTitle: string): boolean {
    return this.expandedCard() === cardTitle;
  }

  /** Deriva el color de acento desde el bgColor pastel si no viene definido. */
  getCardColor(card: { bgColor: string; color?: string }): string {
    if (card.color) return card.color;

    const map: Record<string, string> = {
      "#dbeafe": "#1d4ed8",
      "#e0f2fe": "#0284c7",
      "#e0e7ff": "#3730a3",
      "#ede9fe": "#7c3aed",
      "#f3e8ff": "#7c3aed",
      "#f5f3ff": "#5b21b6",
      "#dcfce7": "#15803d",
      "#bbf7d0": "#15803d",
      "#a7f3d0": "#065f46",
      "#ccfbf1": "#0f766e",
      "#fef9c3": "#854d0e",
      "#fef3c7": "#92400e",
      "#fee2e2": "#b91c1c",
      "#fce7f3": "#9d174d",
      "#fef2f2": "#dc2626",
    };

    return map[card.bgColor.toLowerCase()] ?? "#6b7280";
  }

  roleTagSeverity(role: ProposedRole): TagSeverity {
    const map: Record<ProposedRole, TagSeverity> = {
      SuperUsuario: "warn",
      Administrador: "info",
      Cobranza: "success",
      Contador: "secondary",
      Legal: "danger",
    };

    return map[role];
  }
}
