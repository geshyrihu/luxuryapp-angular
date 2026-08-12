import { ChangeDetectionStrategy, Component } from "@angular/core";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ActionIconsGroupComponent } from "@ui/shared/action-icons-group/action-icons-group.component";
import { AppSplitButton } from "@ui/web/split-button/split-button";
import { AppToolbar } from "@ui/web/toolbar/toolbar";

@Component({
  selector: "app-buttons-showcase",
  imports: [
    WebButtonLabel,
    WebButtonIcon,
    AppSplitButton,
    ActionIconsGroupComponent,
    AppToolbar,
  ],
  template: `
    <div class="p-4 fadein">
      <h2 class="text-2xl font-bold mb-4">Buttons & Actions</h2>
      <p class="text-secondary mb-6">
        Ejemplos de botones utilizando el sistema de diseño en sus diferentes
        variantes y severidades.
      </p>

      <!-- Web Buttons -->
      <section class="mb-8">
        <h3 class="section-header">Botones Regulares</h3>
        <div class="flex flex-wrap gap-4 align-items-center">
          <il-button label="Primary" severity="primary" />
          <il-button label="Secondary" severity="secondary" />
          <il-button label="Success" severity="success" />
          <il-button label="Warning" severity="warn" />
          <il-button label="Danger" severity="danger" />
          <il-button label="Disabled" [disabled]="true" />
        </div>
      </section>

      <!-- Web Button Variants -->
      <section class="mb-8">
        <h3 class="section-header">Variantes (Outlined / Text)</h3>
        <div class="flex flex-wrap gap-4 align-items-center mb-4">
          <il-button
            label="Outlined Primary"
            severity="primary"
            variant="outline"
          />
          <il-button
            label="Outlined Secondary"
            severity="secondary"
            variant="outline"
          />
        </div>
        <div class="flex flex-wrap gap-4 align-items-center">
          <il-button label="Text Primary" severity="primary" variant="text" />
          <il-button
            label="Text Secondary"
            severity="secondary"
            variant="text"
          />
        </div>
      </section>

      <!-- Icon Buttons -->
      <section class="mb-8">
        <h3 class="section-header">Icon Buttons</h3>
        <div class="flex flex-wrap gap-4 align-items-center">
          <iw-button
            icon="material-symbols-light:add"
            severity="primary"
            [rounded]="true"
          />
          <iw-button
            icon="material-symbols-light:edit"
            severity="secondary"
            [rounded]="true"
          />
          <iw-button
            icon="material-symbols-light:delete"
            severity="danger"
            [rounded]="true"
            variant="outline"
          />
          <iw-button
            icon="material-symbols-light:search"
            severity="primary"
            variant="text"
          />
        </div>
      </section>

      <!-- Split Buttons -->
      <section class="mb-8">
        <h3 class="section-header">Split Buttons</h3>
        <div class="flex flex-wrap gap-4 align-items-center">
          <app-split-button label="Acciones" [model]="splitItems" />
        </div>
      </section>

      <!-- Action Groups & Toolbars -->
      <section class="mb-8">
        <h3 class="section-header">Action Groups & Toolbars</h3>

        <h4 class="text-sm text-secondary mb-2">Action Icons Group</h4>
        <app-action-icons-group class="inline-block mb-4">
          <iw-button
            icon="material-symbols-light:edit"
            severity="secondary"
            variant="text"
          />
          <iw-button
            icon="material-symbols-light:content-copy"
            severity="secondary"
            variant="text"
          />
          <iw-button
            icon="material-symbols-light:delete"
            severity="danger"
            variant="text"
          />
        </app-action-icons-group>

        <h4 class="text-sm text-secondary mb-2 mt-4">Toolbar</h4>
        <app-toolbar>
          <div class="p-toolbar-group-start">
            <il-button label="Nuevo" icon="material-symbols-light:add" />
            <il-button
              label="Upload"
              icon="material-symbols-light:upload"
              severity="secondary"
              class="ml-2"
            />
          </div>
          <div class="p-toolbar-group-end">
            <iw-button
              icon="material-symbols-light:search"
              severity="secondary"
            />
          </div>
        </app-toolbar>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsShowcaseComponent {
  splitItems = [
    {
      label: "Actualizar",
      icon: "material-symbols-light:refresh",
      command: () => {},
    },
    {
      label: "Eliminar",
      icon: "material-symbols-light:delete",
      command: () => {},
    },
  ];
}
