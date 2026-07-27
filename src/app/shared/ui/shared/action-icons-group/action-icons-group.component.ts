import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-action-icons-group",
  imports: [],
  template: `
    <div
      class="flex align-items-center gap-1 border-1 surface-border rounded-lg px-2 py-1 surface-card"
    >
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ActionIconsGroupComponent {}
