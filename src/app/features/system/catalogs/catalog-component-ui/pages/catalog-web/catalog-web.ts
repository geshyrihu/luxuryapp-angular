import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";

import { WebAlerts } from "./components/web-alerts/web-alerts";
import { WebAiPatterns } from "./components/web-ai-patterns/web-ai-patterns";
import { WebBadges } from "./components/web-badges/web-badges";
import { WebButtons } from "./components/web-buttons/web-buttons";
import { WebCards } from "./components/web-cards/web-cards";
import { WebEmptyStates } from "./components/web-empty-states/web-empty-states";
import { WebErpPatterns } from "./components/web-erp-patterns/web-erp-patterns";
import { WebForms } from "./components/web-forms/web-forms";
import { WebInputs } from "./components/web-inputs/web-inputs";
import { WebNavigation } from "./components/web-navigation/web-navigation";
import { WebOverlays } from "./components/web-overlays/web-overlays";
import { WebProgress } from "./components/web-progress/web-progress";
import { WebTables } from "./components/web-tables/web-tables";

@Component({
  selector: "app-catalog-web",
  imports: [
    CommonModule,
    // Corto plazo (implementados sesión anterior)
    WebButtons,
    WebInputs,
    WebAlerts,
    WebBadges,
    WebCards,
    WebTables,
    WebForms,
    WebEmptyStates,
    // Mediano plazo (esta sesión)
    WebOverlays,
    WebNavigation,
    WebProgress,
    // Patrones ERP & AI
    WebErpPatterns,
    WebAiPatterns,
  ],
  templateUrl: "./catalog-web.html",
  styleUrls: ["./catalog-web.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogWeb {}
