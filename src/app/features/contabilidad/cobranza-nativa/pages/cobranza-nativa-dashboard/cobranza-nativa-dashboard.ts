import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import {
  HeroMetric,
  ProposedRole,
  TagSeverity,
} from "../../models/cobranza-nativa.model";
import { COBRANZA_GROUPS } from "./cobranza-nativa-groups.const";

@Component({
  selector: "app-cobranza-nativa-dashboard",
  imports: [CustomButton, TagModule, CardModule, AppIcon],
  templateUrl: "./cobranza-nativa-dashboard.html",
  styleUrls: ["./cobranza-nativa-dashboard.scss"],
})
export default class CobranzaNativaDashboard {
  private router = inject(Router);

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

  toggleExpand(cardTitle: string) {
    this.expandedCard.update((v) => (v === cardTitle ? null : cardTitle));
  }

  isExpanded(cardTitle: string): boolean {
    return this.expandedCard() === cardTitle;
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
