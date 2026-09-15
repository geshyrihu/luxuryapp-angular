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
import { NgSelectModule } from "@ng-select/ng-select";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "web-custom-input-autocomplete-signal",
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
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="requiredInput()"
      [description]="description()"
      [hidden]="hidden()"
      [noMargin]="noMargin()"
      [onlyInput]="onlyInput()"
    >
      <ng-select
        [items]="resolvedSuggestions()"
        (search)="onComplete($event)"
        (change)="onSelectItem($event)"
        (clear)="onClear()"
        [formControl]="control() || internalControl"
        [bindLabel]="optionLabel()"
        [placeholder]="placeholder()"
        [clearable]="showClear()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [labelForId]="id()"
        [searchable]="true"
        [addTag]="!forceSelection()"
        [ngClass]="getComponentClass()"
        appendTo="body"
      >
        @if (itemTemplate() || itemTemplateIn(); as tpl) {
          <ng-template ng-option-tmp let-item="item">
            <ng-container
              [ngTemplateOutlet]="tpl"
              [ngTemplateOutletContext]="{ $implicit: item }"
            />
          </ng-template>
        } @else {
          <ng-template ng-option-tmp let-item="item">
            {{ resolveItemLabel(item) }}
          </ng-template>
        }

        @if (selectedItemTemplate() || selectedItemTemplateIn(); as tpl) {
          <ng-template ng-label-tmp let-item="item">
            <ng-container
              [ngTemplateOutlet]="tpl"
              [ngTemplateOutletContext]="{ $implicit: item }"
            />
          </ng-template>
        } @else {
          <ng-template ng-label-tmp let-item="item">
            {{ resolveItemLabel(item) }}
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

    const query = (event?.term ?? event?.query ?? "").toLowerCase();
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

  public onSelectItem(event: any): void {
    const selectedItem = event;
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

  getComponentClass(): string {
    const classes: string[] = [];
    if (this.size() === "small") classes.push("ng-select-sm");
    if (this.size() === "large") classes.push("ng-select-lg");
    if (this.inputStyleClass()) classes.push(this.inputStyleClass());
    return classes.join(" ");
  }
}
