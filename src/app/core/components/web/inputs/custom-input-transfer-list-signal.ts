import { CommonModule } from "@angular/common";
import { Component, input, output, model } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { PickListModule } from "primeng/picklist";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";

@Component({
  selector: "custom-input-transfer-list-signal",
  imports: [CommonModule, ButtonModule, PickListModule, AppIcon],
  template: `
    <div class="transfer-list-root">
      @if (label()) {
        <label class="field-label block mb-2">
          {{ label() }}
          @if (required()) {
            <span style="color:var(--ds-danger)">*</span>
          }
        </label>
      }
      <p-pickList
        [source]="source()"
        [target]="target()"
        (sourceChange)="onSourceChange($event)"
        (targetChange)="onTargetChange($event)"
        [sourceHeader]="sourceHeader()"
        [targetHeader]="targetHeader()"
        [showSourceFilter]="showSourceFilter()"
        [showTargetFilter]="showTargetFilter()"
        [disabled]="disabled()"
        [dragdrop]="dragdrop()"
        [responsive]="true"
        [breakpoint]="breakpoint()"
        [sourceFilterPlaceholder]="'Buscar...'"
        [targetFilterPlaceholder]="'Buscar...'"
        [dataKey]="'value'"
        [stripedRows]="true"
        [metaKeySelection]="false"
        styleClass="w-full"
      >
        <ng-template let-item pTemplate="item">
          <div class="flex align-items-center gap-2 py-1">
            @if (item.icon) {
              <app-icon [icon]="item.icon" class="text-sm" />
            }
            <span>{{ item.label }}</span>
          </div>
        </ng-template>
      </p-pickList>
      @if (description()) {
        <small class="block mt-1 text-500 line-height-2 italic px-1">
          {{ description() }}
        </small>
      }
    </div>
  `,
  styles: [`
    .transfer-list-root {
      width: 100%;
    }
    .field-label {
      font-size: var(--ds-font-size-label, 0.875rem);
      font-weight: var(--ds-font-weight-medium, 500);
      color: var(--ds-text-secondary, #434654);
    }
  `],
})
export class CustomInputTransferList {
  source = model<ISelectItem[]>([]);
  target = model<ISelectItem[]>([]);
  label = input<string>("");
  sourceHeader = input<string>("Disponibles");
  targetHeader = input<string>("Seleccionados");
  showSourceFilter = input<boolean>(true);
  showTargetFilter = input<boolean>(true);
  disabled = input<boolean>(false);
  dragdrop = input<boolean>(true);
  breakpoint = input<string>("768px");
  required = input<boolean>(false);
  description = input<string>("");

  sourceChange = output<ISelectItem[]>();
  targetChange = output<ISelectItem[]>();

  onSourceChange(items: ISelectItem[]): void {
    this.source.set(items);
    this.sourceChange.emit(items);
  }

  onTargetChange(items: ISelectItem[]): void {
    this.target.set(items);
    this.targetChange.emit(items);
  }
}
