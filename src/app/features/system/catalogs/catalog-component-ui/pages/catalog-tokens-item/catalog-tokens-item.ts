import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TokensColors } from "../../shared/tokens-colors/tokens-colors";
import { TokensTypography } from "../../shared/tokens-typography/tokens-typography";

@Component({
  selector: "app-catalog-tokens-item",
  imports: [CommonModule, TokensColors, TokensTypography],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
        @case ('colors') { <app-tokens-colors /> }
        @case ('typography') { <app-tokens-typography /> }
      }
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogTokensItem {
  private route = inject(ActivatedRoute);
  item = signal(this.route.snapshot.paramMap.get('item') ?? '');
  label = this.item() === 'colors' ? 'Colors' : 'Typography';
}
