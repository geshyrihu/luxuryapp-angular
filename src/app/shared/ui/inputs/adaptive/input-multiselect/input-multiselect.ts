import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputMultiselect } from "../../mobile/ion-input-multiselect";
import { WebInputMultiselect } from "../../web/input-multiselect/input-multiselect";

@Component({
  selector: "custom-input-multiselect-signal",

  imports: [WebInputMultiselect, IonInputMultiselect],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMultiselect),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-multiselect
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [options]="options()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [cancelText]="cancelText()"
        [okText]="okText()"
        (selectionChange)="onSelectionChange($event)"
      />
    } @else {
      <web-input-multiselect
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
        [options]="options()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [group]="group()"
        [optionGroupLabel]="optionGroupLabel()"
        [optionGroupChildren]="optionGroupChildren()"
        [filter]="filter()"
        [showClear]="showClear()"
        [selectionDisplay]="selectionDisplay()"
        [maxSelectedLabels]="maxSelectedLabels()"
        [selectedItemsLabel]="selectedItemsLabel()"
        [scrollHeight]="scrollHeight()"
        [panelStyle]="panelStyle()"
        [customClass]="customClass()"
        [size]="size()"
      />
    }
  `,
})
export class InputMultiselect extends BaseInputSignal {
  protected platform = inject(PlatformService);

  options = input<ISelectItem[]>([]);
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
  cancelText = input<string>("Cancelar");
  okText = input<string>("Aceptar");
  selectionChange = output<any>();

  onSelectionChange(event: any): void {
    this.selectionChange.emit(event);
  }
}
