import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-multiselect",

  imports: [BaseInputSignal, ReactiveFormsModule, NgSelectModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
    >
      <ng-select
        [items]="options()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [searchable]="filter()"
        [clearable]="showClear()"
        [bindLabel]="optionLabel()"
        [bindValue]="optionValue() || undefined"
        [groupBy]="group() ? optionGroupLabel() : undefined"
        [labelForId]="id()"
        [class]="getComponentClass()"
        [style.--ng-select-panel-min-width]="panelStyle()['min-width'] || null"
        [style.--ng-select-panel-max-height]="scrollHeight()"
        [multiple]="true"
        [closeOnSelect]="false"
        [disabled]="disabled()"
        [readonly]="readonly()"
        (change)="onChange($event)"
        (blur)="onTouch()"
      >
        <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
          @if (items.length <= (maxSelectedLabels() ?? items.length)) {
            @for (item of items; track item) {
              <span class="badge bg-soft-primary text-primary me-1 mb-1 d-inline-flex align-items-center" style="font-size: 0.85rem; font-weight: 500; padding: 0.35em 0.65em;">
                {{ item[optionLabel()] }}
                <span class="ms-1 cursor-pointer fw-bold hover:text-red-500" (click)="clear(item)" aria-hidden="true" style="font-size: 1.1em;">&times;</span>
              </span>
            }
          } @else {
            <span class="badge bg-soft-secondary text-secondary me-1 mb-1 d-inline-flex align-items-center" style="font-size: 0.85rem; font-weight: 500; padding: 0.35em 0.65em;">
              {{ selectedItemsLabel() || (items.length + " seleccionados") }}
            </span>
          }
        </ng-template>
      </ng-select>
    </base-input-signal>
  `,
  styles: [`
      :host ::ng-deep .ng-select-sm .ng-select-container { min-height: 2rem; font-size: .875rem; }
      :host ::ng-deep .ng-select-sm .ng-select-container .ng-value-container { padding: .25rem .5rem; }
      :host ::ng-deep .ng-select-lg .ng-select-container { min-height: 3rem; font-size: 1.125rem; }
      :host ::ng-deep .ng-select-lg .ng-select-container .ng-value-container { padding: .75rem 1rem; }
      :host ::ng-deep .ng-dropdown-panel { 
        min-width: var(--ng-select-panel-min-width, 20rem); 
        max-height: var(--ng-select-panel-max-height, 350px);
        border-radius: 0.375rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.175);
      }
      :host ::ng-deep .ng-dropdown-panel .scroll-host { max-height: var(--ng-select-panel-max-height, 350px); }
      :host ::ng-deep .ng-select-container { border-radius: 0.375rem; }
      :host ::ng-deep .ng-value-container { gap: 0.25rem; }
      :host ::ng-deep .ng-value-container .ng-input { padding-bottom: 0.25rem; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputMultiselect),
      multi: true,
    },
  ],
})
export class WebInputMultiselect extends BaseInputSignal {
  options = input<SelectItemDto[]>([]);
  optionLabel = input<string>("label");
  optionValue = input<string | undefined>("value");
  group = input<boolean>(false);
  optionGroupLabel = input<string>("label");
  optionGroupChildren = input<string>("items");
  filter = input<boolean>(true);
  showClear = input<boolean>(true);
  selectionDisplay = input<"comma" | "chip" | undefined>("chip");
  maxSelectedLabels = input<number | undefined>(undefined);
  selectedItemsLabel = input<string | undefined>(undefined);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  scrollHeight = input<string>("350px");
  panelStyle = input<Record<string, string>>({ "min-width": "20rem" });

  getComponentClass(): string {
    const classes: string[] = [];
    if (this.size() === "small") classes.push("ng-select-sm");
    if (this.size() === "large") classes.push("ng-select-lg");
    if (this.customClass()) classes.push(this.customClass());
    return classes.join(" ");
  }
}

