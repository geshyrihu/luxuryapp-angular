import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  forwardRef,
  input,
  output,
  TemplateRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";
import { CustomInputAutoComplete } from "../custom-input-autocomplete-signal";

@Component({
  selector: "web-input-autocomplete",

  imports: [ReactiveFormsModule, CustomInputAutoComplete],
  template: `
    <web-custom-input-autocomplete-signal
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
      [forceSelection]="forceSelection()"
      [dropdown]="dropdown()"
      [data]="data()"
      [optionLabel]="optionLabel() ?? field()"
      [suggestions]="suggestions()"
      [dataKey]="dataKey()"
      [size]="size()"
      [showClear]="showClear()"
      [emptyMessage]="emptyMessage()"
      [scrollHeight]="scrollHeight()"
      [panelStyleClass]="panelStyleClass()"
      [panelStyle]="panelStyle()"
      [inputStyleClass]="inputStyleClass()"
      [itemTemplateIn]="itemTemplate() || itemTemplateIn()"
      [selectedItemTemplateIn]="
        selectedItemTemplate() || selectedItemTemplateIn()
      "
      (propagar)="propagar.emit($event)"
      (completeMethod)="completeMethod.emit($event)"
      (cleared)="cleared.emit()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputAutocomplete),
      multi: true,
    },
  ],
})
export class WebInputAutocomplete extends BaseInputSignal {
  data = input<any[]>([]);
  field = input<string>("label");
  /** Nombre canónico del leaf; tiene prioridad sobre 'field'. */
  optionLabel = input<string | undefined>(undefined);
  forceSelection = input<boolean>(true);
  dropdown = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>(28);
  suggestions = input<any[]>([]);
  dataKey = input<string>("value");
  size = input<"small" | "large" | undefined>(undefined);
  showClear = input<boolean>(true);
  emptyMessage = input<string>("No se encontraron resultados");
  scrollHeight = input<string>("14rem");
  panelStyleClass = input<string>("");
  panelStyle = input<Record<string, string> | null>(null);
  inputStyleClass = input<string>("");

  itemTemplate = contentChild<TemplateRef<any>>("item");
  selectedItemTemplate = contentChild<TemplateRef<any>>("selectedItem");
  itemTemplateIn = input<TemplateRef<any> | undefined>(undefined);
  selectedItemTemplateIn = input<TemplateRef<any> | undefined>(undefined);

  propagar = output<any>();
  completeMethod = output<any>();
  cleared = output<void>();
}
