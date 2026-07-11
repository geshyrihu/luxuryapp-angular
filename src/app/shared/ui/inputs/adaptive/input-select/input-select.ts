import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  forwardRef,
  inject,
  input,
  output,
  TemplateRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputSelect } from "../../mobile/ion-input-select";
import { WebInputSelect } from "../../web/input-select/input-select";

/**
 * 🔀 INPUT SELECT — adaptativo. `<custom-input-select-signal>` →
 * web `<web-input-select>` (PrimeNG) o móvil `<ion-input-select>` (Ionic).
 */
@Component({
  selector: "custom-input-select-signal",

  imports: [WebInputSelect, IonInputSelect],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelect),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-select
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [data]="data()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        (selectionChange)="selectionChange.emit($event)"
      />
    } @else {
      <web-input-select
        [control]="control() || internalControl"
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
        [data]="data()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [showClear]="showClear()"
        [filter]="filter()"
        [filterBy]="filterBy()"
        [optionDisabled]="optionDisabled()"
        [customClass]="customClass()"
        [size]="size()"
        [itemTemplate]="itemTemplate()"
        [selectedItemTemplate]="selectedItemTemplate()"
        (selectionChange)="selectionChange.emit($event)"
      />
    }
  `,
})
export class InputSelect extends BaseInputSignal {
  protected platform = inject(PlatformService);
  itemTemplate = contentChild<TemplateRef<any>>("item");
  selectedItemTemplate = contentChild<TemplateRef<any>>("selectedItem");
  selectionChange = output<any>();
  data = input<SelectItemDto[]>([]);
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  optionDisabled = input<string | undefined>(undefined);
  showClear = input<boolean>(true);
  filter = input<boolean>(false);
  filterBy = input<string>("label");
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  // Declarados por compatibilidad con la API previa (no se usaban en el template).
  valueDefault = input<any>(null);
  loading = input<boolean>(false);
}
