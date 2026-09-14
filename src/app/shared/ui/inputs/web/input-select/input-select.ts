import { CommonModule, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  TemplateRef,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { BaseInputSignal } from "../../base/base-input-signal";

/**
 * 🔽 WEB INPUT SELECT (PrimeNG) — interno del delegador `custom-input-select-signal`.
 */
@Component({
  selector: "web-input-select",

  imports: [
    CommonModule,
    NgTemplateOutlet,
    BaseInputSignal,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="requiredInput()"
      [noMargin]="noMargin()"
      [description]="description()"
      [hidden]="hidden()"
      [onlyInput]="onlyInput()"
    >
      <ng-select
        [items]="selectOptions()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [clearable]="showClear()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [labelForId]="id()"
        [bindLabel]="optionLabel()"
        [bindValue]="optionValue()"
        [class]="getComponentClass()"
        (change)="selectionChange.emit($event)"
        appendTo="body"
        [searchable]="filter()"
        [readonly]="readonly()"
      >
        @if (itemTemplate(); as tpl) {
          <ng-template ng-option-tmp let-item="item">
            <ng-container
              [ngTemplateOutlet]="tpl"
              [ngTemplateOutletContext]="{ $implicit: item }"
            />
          </ng-template>
        }
        @if (selectedItemTemplate(); as tpl) {
          <ng-template ng-label-tmp let-item="item">
            <ng-container
              [ngTemplateOutlet]="tpl"
              [ngTemplateOutletContext]="{ $implicit: item }"
            />
          </ng-template>
        }
      </ng-select>
    </base-input-signal>
  `,
  styles: [`
      :host ::ng-deep .ng-select-sm .ng-select-container { min-height: 2rem; font-size: .875rem; }
      :host ::ng-deep .ng-select-sm .ng-select-container .ng-value-container { padding: .25rem .5rem; }
      :host ::ng-deep .ng-select-lg .ng-select-container { min-height: 3rem; font-size: 1.125rem; }
      :host ::ng-deep .ng-select-lg .ng-select-container .ng-value-container { padding: .75rem 1rem; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputSelect),
      multi: true,
    },
  ],
})
export class WebInputSelect
  extends BaseInputSignal
  implements ControlValueAccessor
{
  selectionChange = output<any>();
  data = input<SelectItemDto[]>([]);
  showClear = input<boolean>(true);
  filter = input<boolean>(false);
  filterBy = input<string>("label");
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  optionDisabled = input<string | undefined>(undefined);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  itemTemplate = input<TemplateRef<any> | undefined>(undefined);
  selectedItemTemplate = input<TemplateRef<any> | undefined>(undefined);

  selectOptions = computed(() => {
    const disabledKey = this.optionDisabled();
    if (!disabledKey) return this.data();
    return this.data().map((item: any) => ({
      ...item,
      disabled: Boolean(item?.[disabledKey]),
    }));
  });

  getComponentClass(): string {
    const classes: string[] = [];
    if (this.size() === "small") classes.push("ng-select-sm");
    if (this.size() === "large") classes.push("ng-select-lg");
    if (this.customClass()) classes.push(this.customClass());
    return classes.join(" ");
  }

  constructor() {
    super();
  }
  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  override writeValue(obj: any): void {
    super.writeValue(obj);
  }
  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
  }
}
