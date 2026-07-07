import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabViewModule } from "primeng/tabview";
import { TabsBase } from "@ui/base/tabs.base";

@Component({
  selector: "app-tabs",
  standalone: true,
  imports: [CommonModule, TabViewModule],
  template: `
    <p-tabView
      [(activeIndex)]="activeIndex"
      (onChange)="onTabChange($event)"
    >
      @for (tab of tabs(); track tab.id) {
        <p-tabPanel
          [header]="tab.label"
          [disabled]="tab.disabled"
        >
          <ng-content [select]="'[tab=' + tab.id + ']'" />
        </p-tabPanel>
      }
    </p-tabView>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Tabs extends TabsBase {
  get activeIndex(): number {
    return this.tabs().findIndex((t) => t.id === this.activeId());
  }

  onTabChange(event: { index: number }): void {
    const tab = this.tabs()[event.index];
    if (tab) {
      this.select(tab);
    }
  }
}
