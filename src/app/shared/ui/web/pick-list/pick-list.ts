import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { PickListModule } from "primeng/picklist";
import { PickListBase } from "@ui/base/pick-list.base";

@Component({
  selector: "app-pick-list",
  standalone: true,
  imports: [CommonModule, PickListModule],
  template: `
    <p-pickList
      [(source)]="source"
      [(target)]="target"
      styleClass="w-full"
    >
      <ng-template let-item pTemplate="item">
        <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
      </ng-template>
    </p-pickList>
    <ng-template #itemTemplate let-item>
      <ng-content [select]="'[pickListItem]'" />
    </ng-template>
  `,
  styles: [`
    :host { display: block; width: 100%; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class PickList extends PickListBase {}
