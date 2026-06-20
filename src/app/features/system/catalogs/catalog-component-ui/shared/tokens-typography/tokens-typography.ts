import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-tokens-typography",
  standalone: true,
  template: `
    <div class="grid">
      <div class="col-12">
        <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">Escala Tipográfica</h3>
        <div class="flex flex-column gap-3">
          <div>
            <h1 class="m-0">h1. DM Sans Bold 32px — Título Principal</h1>
            <code class="text-xs">--ds-text-primary / 32px / Bold</code>
          </div>
          <div>
            <h2 class="m-0">h2. DM Sans Bold 28px — Encabezado Sección</h2>
            <code class="text-xs">--ds-text-primary / 28px / Bold</code>
          </div>
          <div>
            <h3 class="m-0">h3. DM Sans Semibold 24px — Subtítulo</h3>
            <code class="text-xs">--ds-text-primary / 24px / Semibold</code>
          </div>
          <div>
            <h4 class="m-0">h4. DM Sans Medium 20px — Título Tarjeta</h4>
            <code class="text-xs">--ds-text-primary / 20px / Medium</code>
          </div>
          <div>
            <h5 class="m-0">h5. DM Sans Medium 16px — Encabezado Menor</h5>
            <code class="text-xs">--ds-text-secondary / 16px / Medium</code>
          </div>
          <div>
            <h6 class="m-0">h6. DM Sans Regular 14px — Label / Metadata</h6>
            <code class="text-xs">--ds-text-tertiary / 14px / Regular</code>
          </div>
        </div>
      </div>
      <div class="col-12 mt-4">
        <p class="text-sm text-secondary">
          Familias base: <strong>DM Sans</strong> (UI), <strong>Inter</strong> (alternate), <strong>Roboto Mono</strong> (código y nomenclatura).
        </p>
      </div>
    </div>
  `,
  styles: [`
    code {
      background: var(--ds-bg-sunken);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: var(--ds-font-family-mono);
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--ds-font-family-base, 'DM Sans', sans-serif);
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class TokensTypography {}
