import { Component, ViewEncapsulation } from "@angular/core";
import { TokensColors } from "../../shared/tokens-colors/tokens-colors";
import { TokensTypography } from "../../shared/tokens-typography/tokens-typography";

@Component({
  selector: "app-catalog-tokens",
  imports: [TokensColors, TokensTypography],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">Tokens & Identidad Visual</h2>
        <p class="text-secondary">
          Variables base y paletas oficiales que definen la marca LuxuryApp.
        </p>
      </div>
      <div class="grid">
        <div class="col-12">
          <app-tokens-colors />
        </div>
        <div class="col-12 mt-4">
          <app-tokens-typography />
        </div>
      </div>
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogTokens {}
