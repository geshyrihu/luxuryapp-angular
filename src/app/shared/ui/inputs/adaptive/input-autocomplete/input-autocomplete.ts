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
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputAutocomplete } from "../../mobile/ion-input-autocomplete";
import { WebInputAutocomplete } from "../../web/input-autocomplete/input-autocomplete";

@Component({
  selector: "custom-input-autocomplete-signal",

  imports: [WebInputAutocomplete, IonInputAutocomplete],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAutocomplete),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-autocomplete
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [suggestions]="data()"
        [field]="field()"
        [optionLabel]="optionLabel()"
        (propagar)="propagar.emit($event)"
      />
    } @else {
      <web-input-autocomplete
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
        [field]="field()"
        [optionLabel]="optionLabel()"
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
        [selectedItemTemplateIn]="selectedItemTemplate() || selectedItemTemplateIn()"
        (propagar)="propagar.emit($event)"
        (completeMethod)="completeMethod.emit($event)"
        (cleared)="cleared.emit()"
      />
    }
  `,
})
export class InputAutocomplete extends BaseInputSignal {
  protected platform = inject(PlatformService);
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
