import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { IonItem, IonItemDivider, IonLabel, IonList } from "@ionic/angular/standalone";
import {
  HeroMetric,
  ProposedRole,
  TagSeverity,
} from "../../models/cobranza-nativa.model";
import { COBRANZA_GROUPS } from "./cobranza-nativa-groups.const";

@Component({
  selector: "app-cobranza-nativa-dashboard",
  imports: [CustomButton, TagModule, CardModule, AppIcon, ButtonModule,
            IonList, IonItem, IonItemDivider, IonLabel],
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

  /** Deriva el color de acento (borde/icono) desde el bgColor pastel si no está definido en los datos */
  getCardColor(card: { bgColor: string; color?: string }): string {
    if (card.color) return card.color;
    const map: Record<string, string> = {
      "#dbeafe": "#1d4ed8", "#e0f2fe": "#0284c7", "#e0e7ff": "#3730a3",
      "#ede9fe": "#7c3aed", "#f3e8ff": "#7c3aed", "#f5f3ff": "#5b21b6",
      "#dcfce7": "#15803d", "#bbf7d0": "#15803d", "#a7f3d0": "#065f46",
      "#ccfbf1": "#0f766e", "#fef9c3": "#854d0e", "#fef3c7": "#92400e",
      "#fee2e2": "#b91c1c", "#fce7f3": "#9d174d", "#fef2f2": "#dc2626",
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

