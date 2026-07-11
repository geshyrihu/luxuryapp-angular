import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MobileButtons } from "../catalog-mobile/components/mobile-buttons/mobile-buttons";
import { MobileInputs } from "../catalog-mobile/components/mobile-inputs/mobile-inputs";
import { MobileFeedback } from "../catalog-mobile/components/mobile-feedback/mobile-feedback";
import { MobileNavigation } from "../catalog-mobile/components/mobile-navigation/mobile-navigation";
import { MobileLists } from "../catalog-mobile/components/mobile-lists/mobile-lists";
import { MobileData } from "../catalog-mobile/components/mobile-data/mobile-data";
import { MobileForms } from "../catalog-mobile/components/mobile-forms/mobile-forms";
import { MobileOverlays } from "../catalog-mobile/components/mobile-overlays/mobile-overlays";

const MOBILE_LABELS: Record<string, string> = {
  buttons: "Mobile Buttons",
  inputs: "Mobile Inputs",
  feedback: "Mobile Feedback & Skeleton",
  navigation: "Mobile Navigation & Segment",
  lists: "Mobile Lists & Reorder",
  data: "Mobile Data, Accordion & Grid",
  forms: "Mobile Forms",
  overlays: "Mobile Overlays (Alert / Toast / Action Sheet / Loading)",
};

@Component({
  selector: "app-catalog-mobile-item",
  imports: [
    CommonModule,
    MobileButtons,
    MobileInputs,
    MobileFeedback,
    MobileNavigation,
    MobileLists,
    MobileData,
    MobileForms,
    MobileOverlays,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
        @case ('buttons') { <app-mobile-buttons /> }
        @case ('inputs') { <app-mobile-inputs /> }
        @case ('feedback') { <app-mobile-feedback /> }
        @case ('navigation') { <app-mobile-navigation /> }
        @case ('lists') { <app-mobile-lists /> }
        @case ('data') { <app-mobile-data /> }
        @case ('forms') { <app-mobile-forms /> }
        @case ('overlays') { <app-mobile-overlays /> }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogMobileItem {
  private route = inject(ActivatedRoute);
  item = signal("");

  get label(): string {
    return MOBILE_LABELS[this.item()] ?? this.item();
  }

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
  }
}
