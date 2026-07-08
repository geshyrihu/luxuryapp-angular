import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabsModule } from "primeng/tabs";
import { TabsBase } from "@ui/base/tabs.base";

/**
 * AppTabs — Wrapper sobre p-tabs. PrimeNG 22 reemplazo TabView (`primeng/tabview`,
 * `p-tabView`/`p-tabPanel`, API por indice) por Tabs (`primeng/tabs`, API por
 * `value`: p-tabs / p-tablist / p-tab / p-tabpanels / p-tabpanel).
 * Se conserva el selector `app-tabs`, la API de TabsBase y los slots `[tab=<id>]`.
 */
@Component({
  selector: "app-tabs",
  standalone: true,
  imports: [CommonModule, TabsModule],
  template: `
    <p-tabs [value]="activeId()" (valueChange)="onValueChange($event)">
      <p-tablist>
        @for (tab of tabs(); track tab.id) {
          <p-tab [value]="tab.id" [disabled]="tab.disabled ?? false">
            {{ tab.label }}
          </p-tab>
        }
      </p-tablist>
      <p-tabpanels>
        @for (tab of tabs(); track tab.id) {
          <p-tabpanel [value]="tab.id">
            <ng-content [select]="'[tab=' + tab.id + ']'" />
          </p-tabpanel>
        }
      </p-tabpanels>
    </p-tabs>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Tabs extends TabsBase {
  onValueChange(value: string | number): void {
    const tab = this.tabs().find((t) => t.id === value);
    if (tab) {
      this.select(tab);
    }
  }
}
