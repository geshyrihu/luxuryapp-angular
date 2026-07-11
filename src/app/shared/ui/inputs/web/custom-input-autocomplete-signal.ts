import { CommonModule, NgTemplateOutlet } from "@angular/common";
import {
  Component,
  contentChild,
  forwardRef,
  input,
  output,
  TemplateRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "web-custom-input-autocomplete-signal",
  imports: [
    CommonModule,
    NgTemplateOutlet,
    BaseInputSignal,
    ReactiveFormsModule,
    AutoCompleteModule,
    FormsModule,
  ],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="requiredInput()"
      [description]="description()"
      [hidden]="hidden()"
      [noMargin]="noMargin()"
      [onlyInput]="onlyInput()"
    >
      <p-autocomplete
        [suggestions]="resolvedSuggestions()"
        (completeMethod)="onComplete($event)"
        (onSelect)="onSelectItem($event)"
        (onClear)="onClear()"
        [ngModel]="(control() || internalControl).value"
        (ngModelChange)="onModelChange($event)"
        [optionLabel]="optionLabel()"
        [dataKey]="dataKey()"
        [placeholder]="placeholder()"
        [forceSelection]="forceSelection()"
        [showClear]="showClear()"
        [dropdown]="dropdown()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [emptyMessage]="emptyMessage()"
        [scrollHeight]="scrollHeight()"
        [panelStyleClass]="panelStyleClass()"
        [panelStyle]="panelStyle()"
        [inputStyleClass]="inputStyleClass()"
        fluid
        [inputId]="id()"
        appendTo="body"
      >
        @if (itemTemplate() || itemTemplateIn(); as tpl) {
          <ng-template let-item #item>
            <ng-container
              [ngTemplateOutlet]="tpl"
              [ngTemplateOutletContext]="{ $implicit: item }"
            />
          </ng-template>
        } @else {
          <ng-template let-item #item>
            {{ resolveItemLabel(item) }}
          </ng-template>
        }

        @if (selectedItemTemplate() || selectedItemTemplateIn(); as tpl) {
          <ng-template let-item #selectedItem>
            <ng-container
              [ngTemplateOutlet]="tpl"
              [ngTemplateOutletContext]="{ $implicit: item }"
            />
          </ng-template>
        } @else {
          <ng-template let-item #selectedItem>
            {{ resolveItemLabel(item) }}
          </ng-template>
        }
      </p-autocomplete>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputAutoComplete),
      multi: true,
    },
  ],
})
export class CustomInputAutoComplete extends BaseInputSignal {
  itemTemplate = contentChild<TemplateRef<any>>("item");
  selectedItemTemplate = contentChild<TemplateRef<any>>("selectedItem");
  /** Passthrough para capas superiores (shell/adaptive) que re-proyectan templates. */
  itemTemplateIn = input<TemplateRef<any> | undefined>(undefined);
  selectedItemTemplateIn = input<TemplateRef<any> | undefined>(undefined);

  data = input<any[]>([]);
  suggestionsInput = input<any[]>([], { alias: "suggestions" });
  optionLabel = input<string>("label");
  dataKey = input<string>("value");
  size = input<"small" | "large" | undefined>(undefined);
  showClear = input<boolean>(true);
  forceSelection = input<boolean>(true);
  dropdown = input<boolean>(false);
  emptyMessage = input<string>("No se encontraron resultados");
  scrollHeight = input<string>("14rem");
  panelStyleClass = input<string>("");
  panelStyle = input<Record<string, string> | null>(null);
  inputStyleClass = input<string>("");

  propagar = output<any>();
  completeMethod = output<any>();
  cleared = output<void>();

  onComplete(event: any): void {
    this.completeMethod.emit(event);

    const query = (event?.query ?? "").toLowerCase();
    const suggestions = this.data();
    const optionLabel = this.optionLabel();
    const filtered = !query
      ? suggestions
      : suggestions.filter((item) =>
          `${item?.[optionLabel] ?? ""}`.toLowerCase().includes(query),
        );

    this.writeValue((this.control() || this.internalControl).value);
    this._suggestionsCache = filtered;
  }

  private _suggestionsCache: any[] = [];

  resolveItemLabel(item: any): string {
    if (!item) return "";
    if (typeof item === "string") return item;
    return item?.[this.optionLabel()] ?? "";
  }

  public onModelChange(value: any): void {
    (this.control() || this.internalControl).setValue(value);
  }

  public onSelectItem(event: any): void {
    const selectedItem = event.value;
    (this.control() || this.internalControl).setValue(selectedItem);
    this.propagar.emit(selectedItem);
  }

  public onClear(): void {
    (this.control() || this.internalControl).setValue(null);
    this.propagar.emit(null);
    this.cleared.emit();
  }

  resolvedSuggestions() {
    return this.suggestionsInput().length
      ? this.suggestionsInput()
      : this._suggestionsCache;
  }
}
