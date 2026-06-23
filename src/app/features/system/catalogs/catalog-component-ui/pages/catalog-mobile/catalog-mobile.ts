import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";

import { MobileButtons } from "./components/mobile-buttons/mobile-buttons";
import { MobileData } from "./components/mobile-data/mobile-data";
import { MobileFeedback } from "./components/mobile-feedback/mobile-feedback";
import { MobileForms } from "./components/mobile-forms/mobile-forms";
import { MobileInputs } from "./components/mobile-inputs/mobile-inputs";
import { MobileLists } from "./components/mobile-lists/mobile-lists";
import { MobileNavigation } from "./components/mobile-navigation/mobile-navigation";
import { MobileCoreCoverage } from "../../shared/mobile-core-coverage";

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
  ],
  template: `
    <div class="flex flex-column gap-4">
      <!-- Showcase principal — DataView, Listas, Buttons e Inputs -->
      <app-mobile-core-coverage />

      <!-- Componentes individuales adicionales -->
      <div class="grid">
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
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogMobile {}
