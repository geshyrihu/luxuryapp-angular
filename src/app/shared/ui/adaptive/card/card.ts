import { NgTemplateOutlet } from "@angular/common";
import { Component, contentChild, inject, TemplateRef } from "@angular/core";
import { CardBase } from "@ui/base/card.base";
import { MobileCard } from "@ui/mobile/card/card";
import { AppCard } from "@ui/web/card/card";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-card",

  imports: [NgTemplateOutlet, AppCard, MobileCard],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-card
        [header]="header()"
        [subheader]="subheader()"
        [padded]="padded()"
        [elevated]="elevated()"
        [headerTemplate]="headerTpl()"
        [titleTemplate]="titleTpl()"
        [subtitleTemplate]="subtitleTpl()"
        [contentTemplate]="contentTpl()"
        [footerTemplate]="footerTpl()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-card>
    } @else {
      <app-card
        [header]="header()"
        [subheader]="subheader()"
        [padded]="padded()"
        [elevated]="elevated()"
        [headerTemplate]="headerTpl()"
        [titleTemplate]="titleTpl()"
        [subtitleTemplate]="subtitleTpl()"
        [contentTemplate]="contentTpl()"
        [footerTemplate]="footerTpl()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-card>
    }
  `,
})
export class LxCard extends CardBase {
  protected platform = inject(PlatformService);

  // Plantillas nombradas al estilo p-card proyectadas por el consumidor.
  // `descendants: false` limita la búsqueda a los hijos directos de <lx-card>,
  // evitando colisiones con #header/#footer anidados (p. ej. dentro de un p-table).
  protected headerTpl = contentChild<TemplateRef<unknown>>("header", {
    descendants: false,
  });
  protected titleTpl = contentChild<TemplateRef<unknown>>("title", {
    descendants: false,
  });
  protected subtitleTpl = contentChild<TemplateRef<unknown>>("subtitle", {
    descendants: false,
  });
  protected contentTpl = contentChild<TemplateRef<unknown>>("content", {
    descendants: false,
  });
  protected footerTpl = contentChild<TemplateRef<unknown>>("footer", {
    descendants: false,
  });
}
