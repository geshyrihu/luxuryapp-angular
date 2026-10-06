import {
  Component,
  inject,
  signal,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MobileButtons } from "../catalog-mobile/mobile-buttons/mobile-buttons";
import { MobileInputs } from "../catalog-mobile/mobile-inputs/mobile-inputs";
import { MobileFeedback } from "../catalog-mobile/mobile-feedback/mobile-feedback";
import { MobileNavigation } from "../catalog-mobile/mobile-navigation/mobile-navigation";
import { MobileLists } from "../catalog-mobile/mobile-lists/mobile-lists";
import { MobileData } from "../catalog-mobile/mobile-data/mobile-data";
import { MobileForms } from "../catalog-mobile/mobile-forms/mobile-forms";
import { MobileOverlays } from "../catalog-mobile/mobile-overlays/mobile-overlays";

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
        @case ("buttons") {
          <lux-mobile-buttons-web />
        }
        @case ("inputs") {
          <lux-mobile-inputs-web />
        }
        @case ("feedback") {
          <lux-mobile-feedback-web />
        }
        @case ("navigation") {
          <lux-mobile-navigation-web />
        }
        @case ("lists") {
          <lux-mobile-lists-web />
        }
        @case ("data") {
          <lux-mobile-data-web />
        }
        @case ("forms") {
          <lux-mobile-forms-web />
        }
        @case ("overlays") {
          <lux-mobile-overlays-web />
        }
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
