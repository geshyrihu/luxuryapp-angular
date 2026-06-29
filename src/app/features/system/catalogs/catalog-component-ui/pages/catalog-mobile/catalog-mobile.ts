import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";

import { MobileCoreCoverage } from "../../shared/mobile-core-coverage";
import { MobileButtons } from "./components/mobile-buttons/mobile-buttons";
import { MobileData } from "./components/mobile-data/mobile-data";
import { MobileFeedback } from "./components/mobile-feedback/mobile-feedback";
import { MobileForms } from "./components/mobile-forms/mobile-forms";
import { MobileInputs } from "./components/mobile-inputs/mobile-inputs";
import { MobileLists } from "./components/mobile-lists/mobile-lists";
import { MobileNavigation } from "./components/mobile-navigation/mobile-navigation";
import { MobileOverlays } from "./components/mobile-overlays/mobile-overlays";
import { MobileLayout } from "./components/mobile-layout/mobile-layout";
import { MobilePageStructure } from "./components/mobile-page-structure/mobile-page-structure";
import { MobileUtilities } from "./components/mobile-utilities/mobile-utilities";

@Component({
  selector: "app-catalog-mobile",
  imports: [
    CommonModule,
    MobileCoreCoverage,
    MobileButtons,
    MobileInputs,
    MobileFeedback,
    MobileNavigation,
    MobileLists,
    MobileData,
    MobileForms,
    MobileOverlays,
    MobileLayout,
    MobilePageStructure,
    MobileUtilities,
  ],
  template: `
    <div class="flex flex-column gap-4">
      <!-- Showcase principal é DataView, Listas, Buttons e Inputs -->
      <app-mobile-core-coverage />

      <!-- Componentes individuales adicionales -->
      <div class="grid">
        <div class="col-12 lg:col-6">
          <app-mobile-buttons />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-inputs />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-lists />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-utilities />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-feedback />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-navigation />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-data />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-forms />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-overlays />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-page-structure />
        </div>
        <div class="col-12 lg:col-6">
          <app-mobile-layout />
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogMobile {}
