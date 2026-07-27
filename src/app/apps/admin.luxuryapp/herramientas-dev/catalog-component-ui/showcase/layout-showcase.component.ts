import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Breadcrumbs } from "@ui/web/breadcrumbs/breadcrumbs";
import { Tabs } from "@ui/web/tabs/tabs";
import { Accordion } from "@ui/web/accordion/accordion";
import { AppCard } from "@ui/web/card/card";
import { AppFieldset } from "@ui/web/fieldset/fieldset";
import { AppDivider } from "@ui/web/divider/divider";

@Component({
  selector: "app-layout-showcase",
  imports: [Breadcrumbs, Tabs, Accordion, AppCard, AppFieldset, AppDivider],
  template: `
    <div class="p-4 fadein">
      <h2 class="text-2xl font-bold mb-4">Layout & Structure</h2>
      <p class="text-secondary mb-6">
        Ejemplos de menús, pestañas, separadores y organizadores de diseño.
      </p>

      <section class="mb-8">
        <h3 class="section-header">Breadcrumbs & Tabs</h3>
        <app-breadcrumbs [items]="[{label: 'Home'}, {label: 'Library'}, {label: 'Data'}]" class="block mb-4" />
        
        <app-tabs [tabs]="[{title: 'Opción 1', content: 'Contenido de opción 1'}, {title: 'Opción 2', content: 'Contenido de opción 2'}]" />
      </section>

      <section class="mb-8">
        <h3 class="section-header">Panels & Cards</h3>
        <div class="grid">
          <div class="col-12 md:col-6">
            <app-card title="Card Title" subtitle="Subtitle">
              <p>El componente card permite estructurar información con título, subtítulo, y acciones de manera consistente.</p>
            </app-card>
          </div>
          <div class="col-12 md:col-6">
            <app-fieldset legend="Datos Personales" [toggleable]="true">
              <p>Un fieldset agrupador de datos que puede colapsarse.</p>
            </app-fieldset>
          </div>
        </div>
      </section>

      <app-divider />

      <section class="mb-8 mt-4">
        <h3 class="section-header">Accordion</h3>
        <app-accordion [items]="[{id: '1', title: 'Panel 1'}, {id: '2', title: 'Panel 2'}]">
          <div accordion="1">Contenido del primer panel del acordeón</div>
          <div accordion="2">Contenido del segundo panel del acordeón</div>
        </app-accordion>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutShowcaseComponent {}
