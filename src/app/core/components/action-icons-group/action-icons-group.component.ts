import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-action-icons-group",
  imports: [CommonModule],
  template: `
    <div
      class="flex align-items-center gap-1 border-1 surface-border border-round-lg px-2 py-1 surface-card"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: ``,
})
export class ActionIconsGroupComponent {}
