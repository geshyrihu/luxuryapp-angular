import { Directive, input, TemplateRef } from "@angular/core";

@Directive()
export abstract class CardBase {
  header = input<string>("");
  subheader = input<string>("");
  padded = input<boolean>(true);
  elevated = input<boolean>(false);

  /**
   * Plantillas nombradas al estilo `p-card` (`#header`, `#title`, `#subtitle`,
   * `#content`, `#footer`). Las pobla `lx-card` mediante `contentChild`; cuando
   * no se proporcionan, se usan los inputs de texto y el `<ng-content>` por defecto.
   */
  headerTemplate = input<TemplateRef<unknown>>();
  titleTemplate = input<TemplateRef<unknown>>();
  subtitleTemplate = input<TemplateRef<unknown>>();
  contentTemplate = input<TemplateRef<unknown>>();
  footerTemplate = input<TemplateRef<unknown>>();
}
